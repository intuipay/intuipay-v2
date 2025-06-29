import { BLOCKCHAIN_CONFIG, getFundsDividerContract } from '@/config/blockchain';
import { decodeFunctionData, createPublicClient, http, type Transaction, parseUnits } from 'viem';
import ERC20_ABI from '@/lib/erc20.abi.json';
import FUNDS_DIVIDER_ABI from '@/lib/IntuipayFundsDivider.abi.json';
import { Connection, PublicKey } from '@solana/web3.js';

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

            // 使用 viem 客户端检查连接
            const client = createPublicClient({
                transport: http(rpcUrl)
            });

            const blockNumber = await client.getBlockNumber();
            return { healthy: true, blockNumber: Number(blockNumber) };

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
        const rpcUrl = network.rpcUrl;
        if (!rpcUrl) {
            return { isValid: false, error: 'RPC URL not configured for network' };
        }

        // 使用 viem 创建公共客户端
        const client = createPublicClient({
            transport: http(rpcUrl)
        });

        // 获取交易信息
        const tx = await client.getTransaction({
            hash: txHash as `0x${string}`,
        });

        if (!tx) {
            return { isValid: false, error: `Transaction not found on ${networkId}` };
        }

        // 获取交易收据以确认状态
        const receipt = await client.getTransactionReceipt({
            hash: txHash as `0x${string}`,
        });

        // 验证交易详情
        const validation = validateEvmTransactionDetails(tx, expectedTo, expectedAmount, expectedFrom, networkId);

        return {
            isValid: validation.isValid,
            error: validation.error,
            txDetails: {
                hash: tx.hash,
                from: tx.from,
                to: tx.to || undefined,
                value: tx.value,
                input: tx.input,
                status: receipt ? 'confirmed' : 'pending',
                blockNumber: Number(tx.blockNumber || 0),
            },
        };

    } catch (error) {
        // 处理交易未找到的情况
        if (error instanceof Error && error.message.includes('not found')) {
            return { isValid: false, error: `Transaction not found on ${networkId}` };
        }

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
    tx: Transaction,
    expectedTo?: string,
    expectedAmount?: bigint,
    expectedFrom?: string,
    networkId?: string
): { isValid: boolean; error?: string } {
    // 检查交易是否确认（viem 的 Transaction 对象，如果有 blockNumber 就是已确认的）
    if (!tx.blockNumber) {
        return { isValid: false, error: 'Transaction not yet confirmed' };
    }

    // 检查发送方地址（如果提供）
    if (expectedFrom && tx.from.toLowerCase() !== expectedFrom.toLowerCase()) {
        return { isValid: false, error: 'Transaction sender address mismatch' };
    }

    // 如果没有提供期望的接收地址，只做基本验证
    if (!expectedTo) {
        return { isValid: true };
    }

    // 获取合约地址用于判断交易类型
    const fundsDividerContract = networkId ? getFundsDividerContract(networkId) : null;

    // 根据实际的 to 地址判断交易类型
    const actualTo = tx.to?.toLowerCase();
    const expectedToLower = expectedTo.toLowerCase();

    // 情况1: 交易直接发送到期望的地址（大学钱包地址）
    if (actualTo === expectedToLower) {
        console.log('Direct transfer to university wallet detected');
        // 直接转账到大学钱包，验证原生货币金额
        if (expectedAmount !== undefined && tx.value !== expectedAmount) {
            return { isValid: false, error: `Native currency amount mismatch. Expected ${expectedAmount}, but got ${tx.value}` };
        }
        return { isValid: true };
    }

    // 情况2: 通过 fundsDivider 合约转账
    if (fundsDividerContract && actualTo === fundsDividerContract.toLowerCase()) {
        console.log('FundsDivider contract transfer detected');
        return validateFundsDividerTransaction(tx, expectedTo, expectedAmount, expectedFrom);
    }

    // 情况3: ERC20 代币转账（tx.to 是 ERC20 合约地址）
    if (tx.input && tx.input !== '0x' && tx.input.length > 10) {
        console.log('Potential ERC20 transfer detected');
        const erc20Validation = validateERC20Transfer(tx, expectedTo, expectedAmount);
        if (erc20Validation.isValid || erc20Validation.error !== 'Not an ERC20 transfer') {
            return erc20Validation;
        }
    }

    // 如果都不匹配，返回地址不匹配错误
    return { isValid: false, error: `Transaction recipient address mismatch. Expected: ${expectedTo}, but transaction was sent to: ${tx.to}` };
}

/**
 * 验证 ERC20 代币转账
 */
function validateERC20Transfer(
    tx: Transaction,
    expectedTo: string,
    expectedAmount?: bigint
): { isValid: boolean; error?: string } {
    try {
        const decoded = decodeFunctionData({
            abi: ERC20_ABI,
            data: tx.input,
        });

        let erc20To: string | null = null;
        let erc20Amount: bigint | null = null;

        if (decoded.functionName === 'transfer') {
            const [to, amount] = decoded.args as [string, bigint];
            erc20To = to;
            erc20Amount = amount;
        } else if (decoded.functionName === 'transferFrom') {
            const [, to, amount] = decoded.args as [string, string, bigint];
            erc20To = to;
            erc20Amount = amount;
        } else {
            return { isValid: false, error: 'Not an ERC20 transfer' };
        }

        // 验证接收方地址
        if (erc20To?.toLowerCase() !== expectedTo.toLowerCase()) {
            return { isValid: false, error: `ERC20 recipient address mismatch. Expected: ${expectedTo}, got: ${erc20To}` };
        }

        // 验证金额
        if (expectedAmount !== undefined && erc20Amount !== expectedAmount) {
            return { isValid: false, error: `ERC20 amount mismatch. Expected: ${expectedAmount}, got: ${erc20Amount}` };
        }

        return { isValid: true };

    } catch (error) {
        return { isValid: false, error: 'Not an ERC20 transfer' };
    }
}

/**
 * 验证通过 FundsDivider 合约的转账
 */
function validateFundsDividerTransaction(
    tx: Transaction,
    expectedTo: string,
    expectedAmount?: bigint,
    expectedFrom?: string
): { isValid: boolean; error?: string } {
    try {
        const decoded = decodeFunctionData({
            abi: FUNDS_DIVIDER_ABI,
            data: tx.input,
        });

        console.log('FundsDivider function called:', decoded.functionName);

        // 验证发送方地址（如果提供）
        if (expectedFrom && tx.from.toLowerCase() !== expectedFrom.toLowerCase()) {
            return { isValid: false, error: `FundsDivider transaction sender address mismatch. Expected: ${expectedFrom}, got: ${tx.from}` };
        }

        if (decoded.functionName === 'divideNativeTransfer') {
            // 原生货币通过合约转账
            const [recipient] = decoded.args as [string];

            // 验证最终受益人地址
            if (recipient.toLowerCase() !== expectedTo.toLowerCase()) {
                return { isValid: false, error: `FundsDivider recipient address mismatch. Expected: ${expectedTo}, got: ${recipient}` };
            }

            // 验证交易金额（tx.value 应该是总金额，包括手续费）
            if (expectedAmount !== undefined && tx.value !== expectedAmount) {
                return { isValid: false, error: `FundsDivider native transfer amount mismatch. Expected: ${expectedAmount}, got: ${tx.value}` };
            }

            return { isValid: true };

        } else if (decoded.functionName === 'divideERC20Transfer') {
            // ERC20 代币通过合约转账
            const [tokenContract, recipient, amount] = decoded.args as [string, string, bigint];

            // 验证最终受益人地址
            if (recipient.toLowerCase() !== expectedTo.toLowerCase()) {
                return { isValid: false, error: `FundsDivider ERC20 recipient address mismatch. Expected: ${expectedTo}, got: ${recipient}` };
            }

            // 验证转账金额
            if (expectedAmount !== undefined && amount !== expectedAmount) {
                return { isValid: false, error: `FundsDivider ERC20 transfer amount mismatch. Expected: ${expectedAmount}, got: ${amount}` };
            }

            console.log(`FundsDivider ERC20 transfer: ${amount} tokens to ${recipient} via contract ${tokenContract}`);
            return { isValid: true };

        } else {
            return { isValid: false, error: `Unknown FundsDivider function: ${decoded.functionName}` };
        }

    } catch (error) {
        return { isValid: false, error: `Failed to decode FundsDivider transaction: ${error instanceof Error ? error.message : String(error)}` };
    }
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

    // 使用 viem 的 parseUnits 函数，避免手动处理精度问题
    return parseUnits(amount, decimals);
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
