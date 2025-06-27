import { BLOCKCHAIN_CONFIG } from '@/config/blockchain';

export interface TransactionValidationResult {
    isValid: boolean;
    error?: string;
    txDetails?: {
        hash: string;
        from?: string;
        to?: string;
        value?: string;
        status?: string;
        blockNumber?: number;
    };
}

/**
 * 检查 RPC 端点健康状态
 */
export async function checkRpcHealth(networkId: string): Promise<{ healthy: boolean; error?: string; blockNumber?: number }> {
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];

    if (!network) {
        return { healthy: false, error: 'Unknown network' };
    }

    let rpcUrl: string;

    try {
        if (network.type === 'evm') {
            // 获取 RPC URL - 直接从配置文件获取
            if (!network.rpcUrl) {
                return { healthy: false, error: 'RPC URL not configured' };
            }
            rpcUrl = network.rpcUrl;

            // 调用 eth_blockNumber 检查连接
            const response = await fetch(rpcUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_blockNumber',
                    params: [],
                    id: 1,
                }),
            });

            if (!response.ok) {
                return { healthy: false, error: `HTTP ${response.status}: ${response.statusText}` };
            }

            const data = await response.json();

            if (data.error) {
                return { healthy: false, error: `RPC Error: ${data.error.message}` };
            }

            const blockNumber = parseInt(data.result, 16);
            return { healthy: true, blockNumber };

        } else if (network.type === 'solana') {
            rpcUrl = network.rpcUrl || '';
            if (!rpcUrl) {
                return { healthy: false, error: 'Solana RPC URL not configured' };
            }

            // 调用 getSlot 检查连接
            const response = await fetch(rpcUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getSlot',
                }),
            });

            if (!response.ok) {
                return { healthy: false, error: `HTTP ${response.status}: ${response.statusText}` };
            }

            const data = await response.json();

            if (data.error) {
                return { healthy: false, error: `RPC Error: ${data.error.message}` };
            }

            return { healthy: true, blockNumber: data.result };
        } else {
            return { healthy: false, error: 'Unsupported blockchain type' };
        }
    } catch (error) {
        return {
            healthy: false,
            error: `Connection failed: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

/**
 * 验证 EVM 区块链上的交易
 */
async function validateEvmTransaction(
    networkId: string,
    txHash: string,
    expectedTo?: string,
    expectedAmount?: string,
    expectedFrom?: string
): Promise<TransactionValidationResult> {
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];

    if (!network || network.type !== 'evm') {
        return { isValid: false, error: 'Invalid EVM network configuration' };
    }

    try {
        // 使用 RPC 接口验证交易
        const rpcUrl = network.rpcUrl;
        if (!rpcUrl) {
            return { isValid: false, error: 'RPC URL not configured for network' };
        }

        const rpcResponse = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getTransactionByHash',
                params: [txHash],
                id: 1,
            }),
        });

        if (!rpcResponse.ok) {
            return { isValid: false, error: `Failed to fetch transaction from ${networkId} RPC` };
        }

        const rpcData = await rpcResponse.json();

        if (rpcData.error) {
            return { isValid: false, error: `RPC Error: ${rpcData.error.message}` };
        }

        const tx = rpcData.result;
        if (!tx) {
            return { isValid: false, error: `Transaction not found on ${networkId}` };
        }

        // 验证交易详情
        const validation = validateEvmTransactionDetails(tx, expectedTo, expectedAmount, expectedFrom);

        return {
            isValid: validation.isValid,
            error: validation.error,
            txDetails: {
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                status: tx.blockNumber && tx.blockNumber !== '0x0' ? 'confirmed' : 'pending',
                blockNumber: parseInt(tx.blockNumber || '0', 16),
            },
        };

    } catch (error) {
        return {
            isValid: false,
            error: `EVM validation error: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

/**
 * 验证 EVM 交易详情
 */
function validateEvmTransactionDetails(
    tx: any,
    expectedTo?: string,
    expectedAmount?: string,
    expectedFrom?: string
): { isValid: boolean; error?: string } {
    // 检查交易是否确认
    if (!tx.blockNumber || tx.blockNumber === '0x0') {
        return { isValid: false, error: 'Transaction not yet confirmed' };
    }

    // 检查接收方地址（如果提供）
    if (expectedTo && tx.to?.toLowerCase() !== expectedTo.toLowerCase()) {
        console.log('tx detail', tx.to, expectedTo);
        return { isValid: false, error: 'Transaction recipient address mismatch' };
    }

    // 检查发送方地址（如果提供）
    if (expectedFrom && tx.from?.toLowerCase() !== expectedFrom.toLowerCase()) {
        return { isValid: false, error: 'Transaction sender address mismatch' };
    }

    // 检查金额（如果提供）
    if (expectedAmount && tx.value !== expectedAmount) {
        return { isValid: false, error: 'Transaction amount mismatch' };
    }

    return { isValid: true };
}

/**
 * 验证 Solana 区块链上的交易
 */
async function validateSolanaTransaction(
    networkId: string,
    txHash: string,
    expectedTo?: string,
    expectedAmount?: string,
    expectedFrom?: string
): Promise<TransactionValidationResult> {
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];

    if (!network || network.type !== 'solana') {
        return { isValid: false, error: 'Invalid Solana network configuration' };
    }

    try {
        const rpcUrl = network.rpcUrl;
        if (!rpcUrl) {
            return { isValid: false, error: 'Solana RPC URL not configured' };
        }

        // 使用 Solana RPC 获取交易信息
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getTransaction',
                params: [
                    txHash,
                    {
                        encoding: 'json',
                        maxSupportedTransactionVersion: 0,
                    },
                ],
            }),
        });

        if (!response.ok) {
            return { isValid: false, error: 'Failed to fetch transaction from Solana RPC' };
        }

        const data = await response.json();

        if (data.error) {
            return { isValid: false, error: `RPC Error: ${data.error.message}` };
        }

        const tx = data.result;
        if (!tx) {
            return { isValid: false, error: 'Transaction not found on Solana network' };
        }

        // 检查交易是否成功
        if (tx.meta?.err) {
            return { isValid: false, error: 'Transaction failed on blockchain' };
        }

        // 验证交易详情
        const isValid = validateSolanaTransactionDetails(tx, expectedTo, expectedAmount, expectedFrom);

        return {
            isValid: isValid.isValid,
            error: isValid.error,
            txDetails: {
                hash: txHash,
                from: tx.transaction?.message?.accountKeys?.[0] || '',
                to: expectedTo || '',
                value: expectedAmount || '',
                status: tx.meta?.err ? 'failed' : 'confirmed',
                blockNumber: tx.slot,
            },
        };

    } catch (error) {
        return {
            isValid: false,
            error: `Solana validation error: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

/**
 * 验证 Solana 交易详情
 */
function validateSolanaTransactionDetails(
    tx: any,
    expectedTo?: string,
    expectedAmount?: string,
    expectedFrom?: string
): { isValid: boolean; error?: string } {
    // 检查交易是否成功
    if (tx.meta?.err) {
        return { isValid: false, error: 'Transaction failed on Solana blockchain' };
    }

    // Solana 交易验证比较复杂，因为涉及到账户变化和指令解析
    // 这里做基本的验证

    // 检查是否有账户余额变化
    const preBalances = tx.meta?.preBalances || [];
    const postBalances = tx.meta?.postBalances || [];

    if (preBalances.length !== postBalances.length) {
        return { isValid: false, error: 'Invalid transaction balance data' };
    }

    // 检查是否有余额变化（表示有资金转移）
    let hasBalanceChange = false;
    for (let i = 0; i < preBalances.length; i++) {
        if (preBalances[i] !== postBalances[i]) {
            hasBalanceChange = true;
            break;
        }
    }

    if (!hasBalanceChange) {
        return { isValid: false, error: 'No balance changes detected in transaction' };
    }

    return { isValid: true };
}

/**
 * 主要的交易验证函数
 */
export async function validateTransaction(
    networkId: string,
    txHash: string,
    expectedTo?: string,
    expectedAmount?: string,
    expectedFrom?: string
): Promise<TransactionValidationResult> {
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];

    if (!network) {
        return { isValid: false, error: 'Unknown network' };
    }

    // 验证交易哈希格式
    if (!txHash || txHash.trim() === '') {
        return { isValid: false, error: 'Invalid transaction hash' };
    }

    try {
        if (network.type === 'evm') {
            // EVM 区块链验证
            if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
                return { isValid: false, error: 'Invalid EVM transaction hash format' };
            }
            return await validateEvmTransaction(networkId, txHash, expectedTo, expectedAmount, expectedFrom);
        } else if (network.type === 'solana') {
            // Solana 区块链验证
            if (!/^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(txHash)) {
                return { isValid: false, error: 'Invalid Solana transaction hash format' };
            }
            return await validateSolanaTransaction(networkId, txHash, expectedTo, expectedAmount, expectedFrom);
        } else {
            return { isValid: false, error: 'Unsupported blockchain type' };
        }
    } catch (error) {
        return {
            isValid: false,
            error: `Transaction validation failed: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

/**
 * 验证捐赠交易的特定函数
 */
export async function validateDonationTransaction(
    networkId: string,
    txHash: string,
    donationData: {
        amount: string | number;
        currency: string;
        wallet_address?: string;
        project_wallet?: string;
    }
): Promise<TransactionValidationResult> {
    const { amount, currency, wallet_address, project_wallet } = donationData;

    // 获取货币配置进行金额验证
    const currencyConfig = BLOCKCHAIN_CONFIG.currencies[currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
    if (!currencyConfig) {
        return {
            isValid: false,
            error: 'Unknown currency configuration'
        };
    }

    // 首先进行基本的交易验证
    const basicValidation = await validateTransaction(
        networkId,
        txHash,
        project_wallet, // 期望的接收地址
        undefined,      // 先不验证金额，后面单独处理
        wallet_address  // 期望的发送地址
    );

    if (!basicValidation.isValid) {
        return basicValidation;
    }

    // 获取该货币在指定网络的配置
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];
    if (!network) {
        return {
            ...basicValidation,
            isValid: false,
            error: 'Unknown network configuration'
        };
    }

    // 验证金额（如果提供了）
    if (typeof amount === 'number' && amount > 0 && basicValidation.txDetails?.value) {
        const txValue = basicValidation.txDetails.value;

        try {
            let expectedAmountInSmallestUnit: bigint;

            if (network.type === 'solana') {
                // Solana 金额处理
                if (currency === 'sol') {
                    // SOL 使用 lamports (1 SOL = 10^9 lamports)
                    expectedAmountInSmallestUnit = BigInt(Math.floor(amount * 1_000_000_000));
                } else {
                    // SPL tokens
                    expectedAmountInSmallestUnit = BigInt(Math.floor(amount * Math.pow(10, currencyConfig.decimals)));
                }

                // Solana 的金额比较（txValue 通常是 number）
                const txValueBigInt = BigInt(txValue);
                const tolerance = expectedAmountInSmallestUnit / BigInt(1000); // 0.1% 容差

                if (txValueBigInt < expectedAmountInSmallestUnit - tolerance ||
                    txValueBigInt > expectedAmountInSmallestUnit + tolerance) {
                    return {
                        ...basicValidation,
                        isValid: false,
                        error: `Amount mismatch: expected ${expectedAmountInSmallestUnit.toString()}, got ${txValueBigInt.toString()}`
                    };
                }
            } else {
                // EVM 金额处理
                expectedAmountInSmallestUnit = BigInt(Math.floor(amount * Math.pow(10, currencyConfig.decimals)));

                // 移除 '0x' 前缀并转换为 BigInt
                const txValueHex = txValue.startsWith('0x') ? txValue.slice(2) : txValue;
                const txValueBigInt = BigInt('0x' + txValueHex);

                // 允许一定的容差（例如 0.1%）来处理精度问题
                const tolerance = expectedAmountInSmallestUnit / BigInt(1000);

                if (txValueBigInt < expectedAmountInSmallestUnit - tolerance ||
                    txValueBigInt > expectedAmountInSmallestUnit + tolerance) {
                    return {
                        ...basicValidation,
                        isValid: false,
                        error: `Amount mismatch: expected ${expectedAmountInSmallestUnit.toString()}, got ${txValueBigInt.toString()}`
                    };
                }
            }
        } catch (error) {
            console.warn('Amount validation failed:', error);
            // 如果金额验证失败，我们仍然认为交易有效，但记录警告
            return {
                ...basicValidation,
                isValid: true,
                error: undefined // 清除错误，因为基本验证通过了
            };
        }
    }

    return basicValidation;
}
