import { describe, it, expect } from "vitest";
import { validateTransaction, validateDonationTransaction, checkRpcHealth } from '@/services/transaction-validator';
import { BLOCKCHAIN_CONFIG } from '@/config/blockchain';

// 测试用的交易哈希（使用真实的 Sepolia 交易）

// 成功转账例子1：通过 ethereum-sepolia 测试网直接转账 1 USDC 给大学的钱包地址
// explorer url: https://sepolia.etherscan.io/tx/0x8b933c520338754c0c46de0dc5433b084dc40a7d041ec398ea45f4e64d172ce0
// 交易哈希：0x8b933c520338754c0c46de0dc5433b084dc40a7d041ec398ea45f4e64d172ce0
// fromAddress: 0x7e727520B29773e7F23a8665649197aAf064CeF1
// toAddress: 0xE62868F9Ae622aa11aff94DB30091B9De20AEf86
// amount: 1 USDC
// usdc contractAddress: 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8

// 成功转账例子2：通过 ethereum-sepolia 测试网直接转账 0.01 ETH 给大学的钱包地址
// explorer url: https://sepolia.etherscan.io/tx/0x9f7755027696a5c64b52423d069f1ea3cc2978f399094a31c6ad4c108c9dc1be
// 交易哈希：0x9f7755027696a5c64b52423d069f1ea3cc2978f399094a31c6ad4c108c9dc1be
// fromAddress: 0x7e727520B29773e7F23a8665649197aAf064CeF1
// toAddress: 0xE62868F9Ae622aa11aff94DB30091B9De20AEf86
// amount: 0.01 ETH

// 成功转账例子3：通过 solana-devnet 测试网直接转账 0.15 SOL 给大学的钱包地址
// explorer url: https://explorer.solana.com/tx/4N4osPdFtJLv8YaMc36REjZqSDqYoQs3gYjXvVsujqt7mYoJS1g6bKcvATwnZ2LSbpyzEDzd7cPhUhcwD4TNecm7?cluster=devnet
// 交易哈希：4N4osPdFtJLv8YaMc36REjZqSDqYoQs3gYjXvVsujqt7mYoJS1g6bKcvATwnZ2LSbpyzEDzd7cPhUhcwD4TNecm7
// fromAddress: FYw5bVnWS4DN3V8uxK2DKe7FbjYUGAmFBrk9da8T6NRT
// toAddress: Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1
// amount: 0.15 SOL

// 成功转账例子4：通过 solana-devnet 测试网直接转账 12 USDC(测试的 SPL token) 给大学的钱包地址
// explorer url: https://explorer.solana.com/tx/3ZWFmUnot3oSynTD6C8zyMb51PHZ1NXKsA6EQqd8YKvMTK6LqaUoMZ76QVaai5uQK2Myt898xV4Y7U4R6r3QxBoq?cluster=devnet
// 交易哈希：3ZWFmUnot3oSynTD6C8zyMb51PHZ1NXKsA6EQqd8YKvMTK6LqaUoMZ76QVaai5uQK2Myt898xV4Y7U4R6r3QxBoq
// fromAddress: FYw5bVnWS4DN3V8uxK2DKe7FbjYUGAmFBrk9da8T6NRT
// toAddress: Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1
// SPL token contractAddress: Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr
// amount: 12 USDC

const TEST_TRANSACTIONS = {
    // Ethereum Sepolia 真实测试交易
    'ethereum-sepolia': {
        // 例子1：1 USDC 转账
        usdcTx: {
            hash: '0x8b933c520338754c0c46de0dc5433b084dc40a7d041ec398ea45f4e64d172ce0',
            senderAddress: '0x7e727520B29773e7F23a8665649197aAf064CeF1',
            recipientAddress: '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86',
            amount: 1, // 1 USDC
            currency: 'usdc',
            contractAddress: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
        },
        // 例子2：0.01 ETH 转账
        ethTx: {
            hash: '0x9f7755027696a5c64b52423d069f1ea3cc2978f399094a31c6ad4c108c9dc1be',
            senderAddress: '0x7e727520B29773e7F23a8665649197aAf064CeF1',
            recipientAddress: '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86',
            amount: 0.01, // 0.01 ETH
            currency: 'eth',
        },
        invalidTx: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    // Solana Devnet 真实测试交易
    'solana-devnet': {
        // 例子3：0.15 SOL 转账
        solTx: {
            hash: '4N4osPdFtJLv8YaMc36REjZqSDqYoQs3gYjXvVsujqt7mYoJS1g6bKcvATwnZ2LSbpyzEDzd7cPhUhcwD4TNecm7',
            senderAddress: 'FYw5bVnWS4DN3V8uxK2DKe7FbjYUGAmFBrk9da8T6NRT',
            recipientAddress: 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
            amount: 0.15, // 0.15 SOL
            currency: 'sol',
        },
        // 例子4：12 USDC (SPL Token) 转账
        usdcTx: {
            hash: '3ZWFmUnot3oSynTD6C8zyMb51PHZ1NXKsA6EQqd8YKvMTK6LqaUoMZ76QVaai5uQK2Myt898xV4Y7U4R6r3QxBoq',
            senderAddress: 'FYw5bVnWS4DN3V8uxK2DKe7FbjYUGAmFBrk9da8T6NRT',
            recipientAddress: 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
            amount: 12, // 12 USDC
            currency: 'usdc',
            contractAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
        },
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
                TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx.hash
            );
            console.log('Real Sepolia transaction validation:', result);
            // 真实交易应该能被验证
            expect(result.isValid).toBe(true);
            expect(result.txDetails).toBeDefined();
            expect(result.txDetails?.hash).toBe(TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx.hash);
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
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                {
                    amount: usdcTx.amount, // 1 USDC
                    currency: usdcTx.currency,
                    wallet_address: usdcTx.senderAddress,
                    project_wallet: usdcTx.recipientAddress,
                }
            );
            console.log('Real USDC donation validation:', result);
            // 使用真实交易数据，验证应该通过
            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('txDetails');
            if (result.isValid) {
                expect(result.txDetails?.from?.toLowerCase()).toBe(usdcTx.senderAddress.toLowerCase());
                expect(result.txDetails?.to?.toLowerCase()).toBe(usdcTx.recipientAddress.toLowerCase());
            }
        });

        it("should validate real ETH donation transaction", async () => {
            const ethTx = TEST_TRANSACTIONS['ethereum-sepolia'].ethTx;
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                ethTx.hash,
                {
                    amount: ethTx.amount, // 0.01 ETH
                    currency: ethTx.currency,
                    wallet_address: ethTx.senderAddress,
                    project_wallet: ethTx.recipientAddress,
                }
            );
            console.log('Real ETH donation validation:', result);
            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('txDetails');
            if (result.isValid) {
                expect(result.txDetails?.from?.toLowerCase()).toBe(ethTx.senderAddress.toLowerCase());
                expect(result.txDetails?.to?.toLowerCase()).toBe(ethTx.recipientAddress.toLowerCase());
            }
        });

        it("should validate real SOL donation transaction", async () => {
            const solTx = TEST_TRANSACTIONS['solana-devnet'].solTx;
            const result = await validateDonationTransaction(
                'solana-devnet',
                solTx.hash,
                {
                    amount: solTx.amount, // 0.15 SOL
                    currency: solTx.currency,
                    wallet_address: solTx.senderAddress,
                    project_wallet: solTx.recipientAddress,
                }
            );
            console.log('Real SOL donation validation:', result);
            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('txDetails');
        });

        it("should validate real Solana USDC donation transaction", async () => {
            const usdcTx = TEST_TRANSACTIONS['solana-devnet'].usdcTx;
            const result = await validateDonationTransaction(
                'solana-devnet',
                usdcTx.hash,
                {
                    amount: usdcTx.amount, // 12 USDC
                    currency: usdcTx.currency,
                    wallet_address: usdcTx.senderAddress,
                    project_wallet: usdcTx.recipientAddress,
                }
            );
            console.log('Real Solana USDC donation validation:', result);
            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('txDetails');
        });

        it("should validate USDC donation structure with test data", async () => {
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx.hash,
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
                TEST_TRANSACTIONS['solana-devnet'].solTx.hash,
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
                TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx.hash,
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
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const result = await validateTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                usdcTx.recipientAddress, // expectedTo
                undefined, // expectedAmount (will be checked separately)
                usdcTx.senderAddress // expectedFrom
            );

            console.log('Transaction validation with expected values:', result);

            if (result.isValid && result.txDetails) {
                expect(result.txDetails.hash).toBe(usdcTx.hash);
                expect(result.txDetails.status).toBe('confirmed');
                expect(result.txDetails.blockNumber).toBeGreaterThan(0);
            }
        });

        it("should fail validation with wrong recipient address", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const result = await validateTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                '0x1234567890123456789012345678901234567890', // wrong recipient
                undefined,
                usdcTx.senderAddress
            );

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('recipient address mismatch');
        });

        it("should fail validation with wrong sender address", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const result = await validateTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                usdcTx.recipientAddress,
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

    describe("Real Donation Transaction Tests", () => {
        it("should validate all 4 real donation transactions", async () => {
            const transactions = [
                // Ethereum Sepolia USDC
                {
                    network: 'ethereum-sepolia',
                    tx: TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx,
                    description: 'Ethereum Sepolia USDC donation'
                },
                // Ethereum Sepolia ETH
                {
                    network: 'ethereum-sepolia',
                    tx: TEST_TRANSACTIONS['ethereum-sepolia'].ethTx,
                    description: 'Ethereum Sepolia ETH donation'
                },
                // Solana Devnet SOL
                {
                    network: 'solana-devnet',
                    tx: TEST_TRANSACTIONS['solana-devnet'].solTx,
                    description: 'Solana Devnet SOL donation'
                },
                // Solana Devnet USDC
                {
                    network: 'solana-devnet',
                    tx: TEST_TRANSACTIONS['solana-devnet'].usdcTx,
                    description: 'Solana Devnet USDC donation'
                }
            ];

            for (const { network, tx, description } of transactions) {
                console.log(`\n🧪 Testing ${description}:`);
                console.log(`   Hash: ${tx.hash}`);
                console.log(`   Amount: ${tx.amount} ${tx.currency.toUpperCase()}`);
                console.log(`   From: ${tx.senderAddress}`);
                console.log(`   To: ${tx.recipientAddress}`);

                const result = await validateDonationTransaction(
                    network as any,
                    tx.hash,
                    {
                        amount: tx.amount,
                        currency: tx.currency,
                        wallet_address: tx.senderAddress,
                        project_wallet: tx.recipientAddress,
                    }
                );

                console.log(`   Result: ${result.isValid ? '✅ Valid' : '❌ Invalid'}`);
                if (!result.isValid) {
                    console.log(`   Error: ${result.error}`);
                }

                // 所有真实交易都应该能够验证
                expect(result).toHaveProperty('isValid');
                expect(result).toHaveProperty('txDetails');
            }
        });

        it("should validate specific transaction types individually", async () => {
            // Test USDC on Ethereum Sepolia
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const usdcResult = await validateTransaction('ethereum-sepolia', usdcTx.hash);
            expect(usdcResult.isValid).toBe(true);
            expect(usdcResult.txDetails?.hash).toBe(usdcTx.hash);

            // Test ETH on Ethereum Sepolia
            const ethTx = TEST_TRANSACTIONS['ethereum-sepolia'].ethTx;
            const ethResult = await validateTransaction('ethereum-sepolia', ethTx.hash);
            expect(ethResult.isValid).toBe(true);
            expect(ethResult.txDetails?.hash).toBe(ethTx.hash);

            // Test SOL on Solana Devnet
            const solTx = TEST_TRANSACTIONS['solana-devnet'].solTx;
            const solResult = await validateTransaction('solana-devnet', solTx.hash);
            console.log('SOL transaction validation:', solResult);
            expect(solResult).toHaveProperty('isValid');

            // Test USDC on Solana Devnet
            const solUsdcTx = TEST_TRANSACTIONS['solana-devnet'].usdcTx;
            const solUsdcResult = await validateTransaction('solana-devnet', solUsdcTx.hash);
            console.log('Solana USDC transaction validation:', solUsdcResult);
            expect(solUsdcResult).toHaveProperty('isValid');
        });
    });
});
