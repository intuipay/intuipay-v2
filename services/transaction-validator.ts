import { BLOCKCHAIN_CONFIG, getFundsDividerContract } from '@/config/blockchain';
import { decodeFunctionData, parseAbi } from 'viem';
import ERC20_ABI from '@/lib/erc20.abi.json';
import FUNDS_DIVIDER_ABI from '@/lib/IntuipayFundsDivider.abi.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface TransactionValidationResult {
    isValid: boolean;
    error?: string;
    txDetails?: {
        hash: string;
        from?: string;
        to?: string;
        value?: bigint; // 使用 bigint 替代 string
        input?: string; // 添加 input 字段用于 ERC-20 解析
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

            // 使用 Solana Connection 检查健康状态
            const connection = new Connection(rpcUrl, 'confirmed');
            const slot = await connection.getSlot();
            
            return { healthy: true, blockNumber: slot };
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
    expectedAmount?: bigint,
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
        const validation = validateEvmTransactionDetails(tx, expectedTo, expectedAmount, expectedFrom, networkId);

        return {
            isValid: validation.isValid,
            error: validation.error,
            txDetails: {
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: BigInt(tx.value || '0'), // 转换为 bigint
                input: tx.input, // 添加 input 数据用于 ERC-20 解析
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
    expectedAmount?: bigint,
    expectedFrom?: string,
    networkId?: string
): { isValid: boolean; error?: string } {
    // 检查交易是否确认
    if (!tx.blockNumber || tx.blockNumber === '0x0') {
        return { isValid: false, error: 'Transaction not yet confirmed' };
    }

    // 检查发送方地址（如果提供）
    if (expectedFrom && tx.from?.toLowerCase() !== expectedFrom.toLowerCase()) {
        return { isValid: false, error: 'Transaction sender address mismatch' };
    }

    // 先尝试解析 ERC-20 交易信息
    let isERC20Transfer = false;
    let erc20To: string | null = null;
    let erc20Amount: bigint | null = null;

    if (tx.input && tx.input !== '0x' && tx.input.length > 10) {
        try {
            const decoded = decodeFunctionData({
                abi: ERC20_ABI,
                data: tx.input as `0x${string}`,
            });

            if (decoded.functionName === 'transfer') {
                isERC20Transfer = true;
                const [to, amount] = decoded.args as [string, bigint];
                erc20To = to;
                erc20Amount = amount;
            } else if (decoded.functionName === 'transferFrom') {
                isERC20Transfer = true;
                const [, to, amount] = decoded.args as [string, string, bigint];
                erc20To = to;
                erc20Amount = amount;
            }
        } catch (error) {
            console.warn('Failed to parse ERC-20 function data:', error);
        }
    }

    // 检查金额（如果提供）
    if (expectedAmount !== undefined) {
        if (isERC20Transfer && erc20Amount !== null) {
            // ERC-20 代币转账，使用解析出的金额
            if (erc20Amount !== expectedAmount) {
                return { isValid: false, error: `ERC-20 token amount mismatch. Expected ${expectedAmount}, but got ${erc20Amount}` };
            }
        } else if (!isERC20Transfer) {
            // 原生代币转账，检查 value 字段
            const txValueBigInt = BigInt(tx.value || '0');
            if (txValueBigInt !== expectedAmount) {
                return { isValid: false, error: `Native currency amount mismatch. Expected ${expectedAmount}, but got ${txValueBigInt}` };
            }
        }
    }

    // 检查接收方地址（如果提供）
    if (expectedTo) {
        if (isERC20Transfer && erc20To) {
            // ERC-20 转账，使用解析出的接收方地址
            if (erc20To.toLowerCase() !== expectedTo.toLowerCase()) {
                return { isValid: false, error: `ERC-20 transaction recipient address mismatch, expected: ${expectedTo}, got: ${erc20To}` };
            }
        } else if (tx.to?.toLowerCase() !== expectedTo.toLowerCase()) {
            // 原生代币转账或合约调用，检查交易的 to 字段
            
            // 如果期望地址是项目钱包，但实际接收地址是合约，检查是否使用了手续费分配合约
            if (networkId) {
                const fundsDividerContract = getFundsDividerContract(networkId);
                if (fundsDividerContract && tx.to?.toLowerCase() === fundsDividerContract.toLowerCase()) {
                    // 通过合约转账是有效的
                    return { isValid: true };
                }
            }
            
            return { isValid: false, error: 'Transaction recipient address mismatch' };
        }
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
    expectedAmount?: bigint,
    expectedFrom?: string,
    currencyConfig?: any
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

        // 创建 Solana 连接
        const connection = new Connection(rpcUrl, 'confirmed');

        // 获取交易信息
        const txInfo = await connection.getTransaction(txHash, {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });

        if (!txInfo) {
            return { isValid: false, error: 'Transaction not found on Solana network' };
        }

        // 检查交易是否成功
        if (txInfo.meta?.err) {
            return { isValid: false, error: 'Transaction failed on blockchain' };
        }

        // 验证交易详情
        const validation = validateSolanaTransactionDetails(txInfo, expectedTo, expectedAmount, expectedFrom, currencyConfig);

        // 获取账户密钥
        const accountKeys = txInfo.transaction.message.getAccountKeys();

        return {
            isValid: validation.isValid,
            error: validation.error,
            txDetails: {
                hash: txHash,
                from: accountKeys.staticAccountKeys?.[0]?.toString() || '',
                to: expectedTo || '',
                value: expectedAmount,
                status: txInfo.meta?.err ? 'failed' : 'confirmed',
                blockNumber: txInfo.slot,
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
    txInfo: any,
    expectedTo?: string,
    expectedAmount?: bigint,
    expectedFrom?: string,
    currencyConfig?: any
): { isValid: boolean; error?: string } {
    // 1. 检查交易是否成功
    if (txInfo.meta?.err) {
        return { isValid: false, error: 'Transaction failed on Solana blockchain' };
    }

    // 如果没有提供具体的验证细节，仅确认交易存在且成功
    if (!expectedTo && !expectedAmount && !expectedFrom) {
        return { isValid: true };
    }

    // 2. 获取账户密钥
    const accountKeys = txInfo.transaction.message.getAccountKeys();
    const staticAccountKeys = accountKeys.staticAccountKeys || [];
    
    if (!staticAccountKeys || staticAccountKeys.length === 0) {
        return { isValid: false, error: 'Could not parse account keys from transaction.' };
    }

    // 转换为字符串数组以便于比较
    const accountKeyStrings = staticAccountKeys.map((key: PublicKey) => key.toString());

    // 3. 检查是 SPL 代币转账还是原生 SOL 转账
    const isSplToken = currencyConfig && currencyConfig.networks.find((n: any) => n.networkId.startsWith('solana'))?.contractAddress;

    if (isSplToken) {
        // --- SPL Token 转账验证 ---
        const expectedAmountInSmallestUnit = expectedAmount;
        if (expectedAmountInSmallestUnit === undefined) {
            return { isValid: false, error: 'Expected amount not provided for SPL token transfer validation.' };
        }

        const tokenContractAddress = currencyConfig.networks.find((n: any) => n.networkId.startsWith('solana'))?.contractAddress;
        if (!tokenContractAddress) {
            return { isValid: false, error: 'Could not find token contract address for Solana in currency config.' };
        }

        const preTokenBalances = txInfo.meta.preTokenBalances || [];
        const postTokenBalances = txInfo.meta.postTokenBalances || [];

        const relevantPreBalances = preTokenBalances.filter((b: any) => b.mint === tokenContractAddress);
        const relevantPostBalances = postTokenBalances.filter((b: any) => b.mint === tokenContractAddress);

        const senderBalanceChange = relevantPreBalances.find((b: any) => b.owner === expectedFrom);
        const recipientBalanceChange = relevantPostBalances.find((b: any) => b.owner === expectedTo);

        if (!senderBalanceChange) {
            return { isValid: false, error: `Sender ${expectedFrom} not involved in this SPL token transaction.` };
        }
        
        const senderPreAmount = BigInt(senderBalanceChange.uiTokenAmount.amount);
        const senderPostBalance = relevantPostBalances.find((b: any) => b.accountIndex === senderBalanceChange.accountIndex);
        const senderPostAmount = BigInt(senderPostBalance?.uiTokenAmount.amount || '0');
        const actualSentAmount = senderPreAmount - senderPostAmount;

        if (actualSentAmount !== expectedAmountInSmallestUnit) {
            return { isValid: false, error: `Amount mismatch for sender. Expected to send ${expectedAmountInSmallestUnit}, but sent ${actualSentAmount}` };
        }

        const recipientPreBalance = relevantPreBalances.find((b: any) => b.accountIndex === recipientBalanceChange?.accountIndex);
        const recipientPreAmount = BigInt(recipientPreBalance?.uiTokenAmount.amount || '0');
        const recipientPostAmount = BigInt(recipientBalanceChange.uiTokenAmount.amount);
        const actualReceivedAmount = recipientPostAmount - recipientPreAmount;

        if (actualReceivedAmount !== expectedAmountInSmallestUnit) {
            return { isValid: false, error: `Amount mismatch for recipient. Expected to receive ${expectedAmountInSmallestUnit}, but received ${actualReceivedAmount}` };
        }

    } else {
        // --- 原生 SOL 转账验证 ---
        if (!expectedFrom || !expectedTo) {
            return { isValid: false, error: 'Sender or recipient address not provided for native SOL transfer.' };
        }

        const senderIndex = accountKeyStrings.indexOf(expectedFrom);
        if (senderIndex === -1) {
            return { isValid: false, error: `Sender address ${expectedFrom} not found in transaction accounts` };
        }
        const recipientIndex = accountKeyStrings.indexOf(expectedTo);
        if (recipientIndex === -1) {
            return { isValid: false, error: `Recipient address ${expectedTo} not found in transaction account keys.` };
        }

        const expectedAmountLamports = expectedAmount;
        if (expectedAmountLamports === undefined) {
            return { isValid: false, error: 'Expected amount not provided for SOL transfer validation.' };
        }

        const preBalances: number[] = txInfo.meta.preBalances || [];
        const postBalances: number[] = txInfo.meta.postBalances || [];

        if (recipientIndex >= preBalances.length || recipientIndex >= postBalances.length) {
            return { isValid: false, error: 'Transaction metadata is missing balance information for the recipient.' };
        }

        const recipientPreBalance = BigInt(preBalances[recipientIndex]);
        const recipientPostBalance = BigInt(postBalances[recipientIndex]);

        const amountReceived = recipientPostBalance - recipientPreBalance;

        if (amountReceived !== expectedAmountLamports) {
            return { isValid: false, error: `Amount mismatch. Expected ${expectedAmountLamports}, but received ${amountReceived}` };
        }
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
    expectedAmount?: bigint,
    expectedFrom?: string,
    currencyConfig?: any
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
            return validateEvmTransaction(networkId, txHash, expectedTo, expectedAmount, expectedFrom);
        } else if (network.type === 'solana') {
            return validateSolanaTransaction(networkId, txHash, expectedTo, expectedAmount, expectedFrom, currencyConfig);
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
 * 将人类可读的金额字符串转换为最小单位的 BigInt
 * @param amount - 金额字符串 (e.g., "0.1")
 * @param decimals - 货币的小数位数
 * @returns 最小单位的 BigInt
 */
export function convertAmountToSmallestUnit(amount: string, decimals: number): bigint {
    if (typeof amount !== 'string' || !/^-?\d*(\.\d+)?$/.test(amount)) {
        throw new Error('Invalid amount format. Amount must be a string representing a number.');
    }
    if (amount.startsWith('-')) {
        throw new Error('Amount cannot be negative.');
    }

    const parts = amount.split('.');
    const integerPart = BigInt(parts[0] || '0');
    const fractionalPartStr = (parts[1] || '').padEnd(decimals, '0');
    // 确保小数部分不会超过货币支持的精度
    const truncatedFractionalPart = fractionalPartStr.slice(0, decimals);
    const fractionalPart = BigInt(truncatedFractionalPart);

    // bigint 幂运算必须依赖 target: es2020
    return integerPart * (10n ** BigInt(decimals)) + fractionalPart;
}


/**
 * 验证捐赠交易的特定函数
 */
export async function validateDonationTransaction(
    networkId: string,
    txHash: string,
    expectedTo: string,
    amountInSmallestUnit: bigint,
    expectedFrom: string,
    currency: any
): Promise<TransactionValidationResult> {

    if (!currency) {
        return { isValid: false, error: 'Unknown currency configuration' };
    }
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];
    if (!network) {
        return { isValid: false, error: 'Unknown network' };
    }
    
    console.log(`Validating tx ${txHash} on ${networkId}:
    - Expected To: ${expectedTo}
    - Expected From: ${expectedFrom}
    - Expected Amount (smallest unit): ${amountInSmallestUnit}`);

    if (network.type === 'evm') {
        return validateEvmTransaction(networkId, txHash, expectedTo, amountInSmallestUnit, expectedFrom);
    } else if (network.type === 'solana') {
        return validateSolanaTransaction(networkId, txHash, expectedTo, amountInSmallestUnit, expectedFrom, currency);
    } else {
        return { isValid: false, error: 'Unsupported blockchain type' };
    }
}
