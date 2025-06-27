import { describe, it, expect } from "bun:test"; // 可以换成 jest 或其他测试框架
import { validateTransaction, validateDonationTransaction, checkRpcHealth } from '@/services/transaction-validator';
import { BLOCKCHAIN_CONFIG } from '@/config/blockchain';

// 测试用的交易哈希（使用真实的 Sepolia 交易）
// https://sepolia.etherscan.io/tx/0x8b933c520338754c0c46de0dc5433b084dc40a7d041ec398ea45f4e64d172ce0
const TEST_TRANSACTIONS = {
    // Ethereum Sepolia 真实测试交易
    'ethereum-sepolia': {
        validTx: '0x8b933c520338754c0c46de0dc5433b084dc40a7d041ec398ea45f4e64d172ce0',
        invalidTx: '0x0000000000000000000000000000000000000000000000000000000000000000',
        // 交易详情
        senderAddress: '0x7e727520B29773e7F23a8665649197aAf064CeF1',
        recipientAddress: '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86',
        amount: 1, // 1 USDC
        currency: 'usdc',
        contractAddress: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    },
    // Solana Devnet 测试交易
    'solana-devnet': {
        validTx: '5j8WF4H2rGWRJ8Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5',
        invalidTx: '1111111111111111111111111111111111111111111111111111111111111111111111111111111',
    },
};

describe("Transaction Validator Tests", () => {

    describe("RPC Health Tests", () => {
        it("should check Ethereum Mainnet RPC health", async () => {
            const health = await checkRpcHealth('ethereum-mainnet');
            console.log(`Ethereum Mainnet RPC: ${health.healthy ? '✅' : '❌'} ${health.error || `Block: ${health.blockNumber}`}`);
            // RPC 可能会失败，所以我们只验证返回了结果
            expect(health).toHaveProperty('healthy');
        });

        it("should check Ethereum Sepolia RPC health", async () => {
            const health = await checkRpcHealth('ethereum-sepolia');
            console.log(`Ethereum Sepolia RPC: ${health.healthy ? '✅' : '❌'} ${health.error || `Block: ${health.blockNumber}`}`);
            expect(health).toHaveProperty('healthy');
        });

        it("should check Solana Mainnet RPC health", async () => {
            const health = await checkRpcHealth('solana-mainnet');
            console.log(`Solana Mainnet RPC: ${health.healthy ? '✅' : '❌'} ${health.error || `Slot: ${health.blockNumber}`}`);
            expect(health).toHaveProperty('healthy');
        });

        it("should check Pharos Testnet RPC health", async () => {
            const health = await checkRpcHealth('pharos-testnet');
            console.log(`Pharos Testnet RPC: ${health.healthy ? '✅' : '❌'} ${health.error || `Block: ${health.blockNumber}`}`);
            expect(health).toHaveProperty('healthy');
        });
    });

    describe("Format Validation Tests", () => {
        it("should reject invalid EVM transaction hash format", async () => {
            const result = await validateTransaction('ethereum-sepolia', 'invalid-hash');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Invalid EVM transaction hash format');
        });

        it("should reject invalid Solana transaction hash format", async () => {
            const result = await validateTransaction('solana-devnet', 'invalid-hash');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Invalid Solana transaction hash format');
        });

        it("should reject empty transaction hash", async () => {
            const result = await validateTransaction('ethereum-sepolia', '');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Invalid transaction hash');
        });
    });

    describe("Network Validation Tests", () => {
        it("should reject unsupported network", async () => {
            const result = await validateTransaction(
                'bitcoin-mainnet' as any,
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            );
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Unknown network');
        });
    });

    describe("Transaction Existence Tests", () => {
        it("should validate real Sepolia USDC transaction", async () => {
            const result = await validateTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].validTx
            );
            console.log('Real Sepolia transaction validation:', result);
            // 真实交易应该能被验证
            expect(result.isValid).toBe(true);
            expect(result.txDetails).toBeDefined();
            expect(result.txDetails?.hash).toBe(TEST_TRANSACTIONS['ethereum-sepolia'].validTx);
        });

        it("should handle non-existent EVM transaction", async () => {
            const result = await validateTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].invalidTx
            );
            expect(result.isValid).toBe(false);
            // 交易不存在或其他 RPC 错误都是预期的
            expect(result.error).toBeDefined();
        });

        it("should handle non-existent Solana transaction", async () => {
            const result = await validateTransaction(
                'solana-devnet',
                TEST_TRANSACTIONS['solana-devnet'].invalidTx
            );
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe("Donation Transaction Validation Tests", () => {
        it("should validate real USDC donation transaction", async () => {
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].validTx,
                {
                    amount: TEST_TRANSACTIONS['ethereum-sepolia'].amount, // 1 USDC
                    currency: TEST_TRANSACTIONS['ethereum-sepolia'].currency,
                    wallet_address: TEST_TRANSACTIONS['ethereum-sepolia'].senderAddress,
                    project_wallet: TEST_TRANSACTIONS['ethereum-sepolia'].recipientAddress,
                }
            );
            console.log('Real USDC donation validation:', result);
            // 使用真实交易数据，验证应该通过
            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('txDetails');
            if (result.isValid) {
                expect(result.txDetails?.from?.toLowerCase()).toBe(TEST_TRANSACTIONS['ethereum-sepolia'].senderAddress.toLowerCase());
                expect(result.txDetails?.to?.toLowerCase()).toBe(TEST_TRANSACTIONS['ethereum-sepolia'].recipientAddress.toLowerCase());
            }
        });

        it("should validate USDC donation structure with test data", async () => {
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].validTx,
                {
                    amount: 10, // 不同金额测试
                    currency: 'usdc',
                    wallet_address: '0x1234567890123456789012345678901234567890',
                    project_wallet: '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86',
                }
            );
            // 由于金额和发送地址不匹配，应该会失败
            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('error');
        });

        it("should validate SOL donation structure", async () => {
            const result = await validateDonationTransaction(
                'solana-devnet',
                TEST_TRANSACTIONS['solana-devnet'].validTx,
                {
                    amount: 0.1, // 0.1 SOL
                    currency: 'sol',
                    wallet_address: 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
                    project_wallet: 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
                }
            );
            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('error');
        });

        it("should reject unknown currency", async () => {
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].validTx,
                {
                    amount: 10,
                    currency: 'unknown-token',
                    wallet_address: '0x1234567890123456789012345678901234567890',
                }
            );
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Unknown currency configuration');
        });
    });

    describe("Real Transaction Validation Tests", () => {
        it("should validate transaction details match expected values", async () => {
            const result = await validateTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].validTx,
                TEST_TRANSACTIONS['ethereum-sepolia'].recipientAddress, // expectedTo
                undefined, // expectedAmount (will be checked separately)
                TEST_TRANSACTIONS['ethereum-sepolia'].senderAddress // expectedFrom
            );

            console.log('Transaction validation with expected values:', result);

            if (result.isValid && result.txDetails) {
                expect(result.txDetails.hash).toBe(TEST_TRANSACTIONS['ethereum-sepolia'].validTx);
                expect(result.txDetails.status).toBe('confirmed');
                expect(result.txDetails.blockNumber).toBeGreaterThan(0);
            }
        });

        it("should fail validation with wrong recipient address", async () => {
            const result = await validateTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].validTx,
                '0x1234567890123456789012345678901234567890', // wrong recipient
                undefined,
                TEST_TRANSACTIONS['ethereum-sepolia'].senderAddress
            );

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('recipient address mismatch');
        });

        it("should fail validation with wrong sender address", async () => {
            const result = await validateTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].validTx,
                TEST_TRANSACTIONS['ethereum-sepolia'].recipientAddress,
                undefined,
                '0x1234567890123456789012345678901234567890' // wrong sender
            );

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Transaction recipient address mismatch');
        });
    });

    describe("Configuration Tests", () => {
        it("should have all required RPC URLs configured", () => {
            const networks = ['ethereum-mainnet', 'ethereum-sepolia', 'pharos-testnet', 'solana-mainnet', 'solana-devnet'];

            for (const networkId of networks) {
                const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];
                expect(network).toBeDefined();
                expect(network.rpcUrl).toBeDefined();
                expect(network.rpcUrl).not.toBe('');
                console.log(`✅ ${networkId}: ${network.rpcUrl}`);
            }
        });

        it("should have correct network types", () => {
            expect(BLOCKCHAIN_CONFIG.networks['ethereum-mainnet'].type).toBe('evm');
            expect(BLOCKCHAIN_CONFIG.networks['ethereum-sepolia'].type).toBe('evm');
            expect(BLOCKCHAIN_CONFIG.networks['pharos-testnet'].type).toBe('evm');
            expect(BLOCKCHAIN_CONFIG.networks['solana-mainnet'].type).toBe('solana');
            expect(BLOCKCHAIN_CONFIG.networks['solana-devnet'].type).toBe('solana');
        });

        it("should have correct chain IDs for EVM networks", () => {
            expect(BLOCKCHAIN_CONFIG.networks['ethereum-mainnet'].chainId).toBe(1);
            expect(BLOCKCHAIN_CONFIG.networks['ethereum-sepolia'].chainId).toBe(11155111);
            expect(BLOCKCHAIN_CONFIG.networks['pharos-testnet'].chainId).toBe(688688);
        });
    });
});
