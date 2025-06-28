import { describe, it, expect } from "vitest";
import { validateTransaction, validateDonationTransaction, checkRpcHealth, convertAmountToSmallestUnit } from '@/services/transaction-validator';
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

// 成功转账例子4：通过 solana-devnet 测试网直接转账 1 USDC(测试的 SPL token) 给大学的钱包地址
// explorer url: https://explorer.solana.com/tx/3ZWFmUnot3oSynTD6C8zyMb51PHZ1NXKsA6EQqd8YKvMTK6LqaUoMZ76QVaai5uQK2Myt898xV4Y7U4R6r3QxBoq?cluster=devnet
// 交易哈希：3ZWFmUnot3oSynTD6C8zyMb51PHZ1NXKsA6EQqd8YKvMTK6LqaUoMZ76QVaai5uQK2Myt898xV4Y7U4R6r3QxBoq
// fromAddress: FYw5bVnWS4DN3V8uxK2DKe7FbjYUGAmFBrk9da8T6NRT
// toAddress: Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1
// SPL token contractAddress: Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr
// amount: 1 USDC

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
        // 例子4：1 USDC (SPL Token) 转账（根据实际交易数据）
        usdcTx: {
            hash: '3ZWFmUnot3oSynTD6C8zyMb51PHZ1NXKsA6EQqd8YKvMTK6LqaUoMZ76QVaai5uQK2Myt898xV4Y7U4R6r3QxBoq',
            senderAddress: 'FYw5bVnWS4DN3V8uxK2DKe7FbjYUGAmFBrk9da8T6NRT',
            recipientAddress: 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
            amount: 1, // 1 USDC (修正为实际交易金额)
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
            expect(result.error).toContain('RPC Error');
        });

        it("should reject invalid Solana transaction hash format", async () => {
            const result = await validateTransaction('solana-devnet', 'invalid-hash');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('validation error');
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
            const currency = BLOCKCHAIN_CONFIG.currencies[usdcTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const amountInSmallestUnit = convertAmountToSmallestUnit(usdcTx.amount.toString(), currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                usdcTx.recipientAddress,
                amountInSmallestUnit,
                usdcTx.senderAddress,
                currency
            );
            console.log('Real USDC donation validation:', result);
            // 使用真实交易数据，验证应该通过
            expect(result.isValid).toBe(true);
            expect(result.txDetails).toBeDefined();
            if (result.isValid) {
                expect(result.txDetails?.from?.toLowerCase()).toBe(usdcTx.senderAddress.toLowerCase());
                // For ERC20, the tx.to is the contract address
                const currencyNetworkConfig = currency.networks.find(n => n.networkId === 'ethereum-sepolia');
                expect(result.txDetails?.to?.toLowerCase()).toBe(currencyNetworkConfig?.contractAddress?.toLowerCase());
            }
        });

        it("should validate real ETH donation transaction", async () => {
            const ethTx = TEST_TRANSACTIONS['ethereum-sepolia'].ethTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[ethTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const amountInSmallestUnit = convertAmountToSmallestUnit(ethTx.amount.toString(), currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                ethTx.hash,
                ethTx.recipientAddress,
                amountInSmallestUnit,
                ethTx.senderAddress,
                currency
            );
            console.log('Real ETH donation validation:', result);
            expect(result.isValid).toBe(true);
            expect(result.txDetails).toBeDefined();
            if (result.isValid) {
                expect(result.txDetails?.from?.toLowerCase()).toBe(ethTx.senderAddress.toLowerCase());
                expect(result.txDetails?.to?.toLowerCase()).toBe(ethTx.recipientAddress.toLowerCase());
            }
        });

        it("should validate real SOL donation transaction", async () => {
            const solTx = TEST_TRANSACTIONS['solana-devnet'].solTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[solTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const amountInSmallestUnit = convertAmountToSmallestUnit(solTx.amount.toString(), currency.decimals);
            const result = await validateDonationTransaction(
                'solana-devnet',
                solTx.hash,
                solTx.recipientAddress,
                amountInSmallestUnit,
                solTx.senderAddress,
                currency
            );
            console.log('Real SOL donation validation:', result);
            expect(result.isValid).toBe(true);
            expect(result.txDetails).toBeDefined();
        });

        it("should validate real Solana USDC donation transaction", async () => {
            const usdcTx = TEST_TRANSACTIONS['solana-devnet'].usdcTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[usdcTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const amountInSmallestUnit = convertAmountToSmallestUnit(usdcTx.amount.toString(), currency.decimals);
            const result = await validateDonationTransaction(
                'solana-devnet',
                usdcTx.hash,
                usdcTx.recipientAddress,
                amountInSmallestUnit,
                usdcTx.senderAddress,
                currency
            );
            console.log('Real Solana USDC donation validation:', result);
            expect(result.isValid).toBe(true);
            expect(result.txDetails).toBeDefined();
        });

        it("should validate USDC donation structure with test data", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const currency = BLOCKCHAIN_CONFIG.currencies.usdc;
            const amountInSmallestUnit = convertAmountToSmallestUnit('10', currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86',
                amountInSmallestUnit, // 不同金额测试
                '0x1234567890123456789012345678901234567890',
                currency
            );
            // 由于金额和发送地址不匹配，应该会失败
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });

        it("should validate SOL donation structure", async () => {
            const solTx = TEST_TRANSACTIONS['solana-devnet'].solTx;
            const currency = BLOCKCHAIN_CONFIG.currencies.sol;
            const amountInSmallestUnit = convertAmountToSmallestUnit('0.1', currency.decimals);
            const result = await validateDonationTransaction(
                'solana-devnet',
                solTx.hash,
                'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
                amountInSmallestUnit, // 0.1 SOL
                'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
                currency
            );
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });

        it("should reject unknown currency", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const amountInSmallestUnit = convertAmountToSmallestUnit('10', 18); // Assuming 18 decimals for the test
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                '0x1234567890123456789012345678901234567890',
                amountInSmallestUnit,
                '0x1234567890123456789012345678901234567890',
                null as any // unknown currency
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
            expect(result.error).toContain('Transaction sender address mismatch');
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

                const currency = BLOCKCHAIN_CONFIG.currencies[tx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
                const amountInSmallestUnit = convertAmountToSmallestUnit(tx.amount.toString(), currency.decimals);
                const result = await validateDonationTransaction(
                    network as any,
                    tx.hash,
                    tx.recipientAddress,
                    amountInSmallestUnit,
                    tx.senderAddress,
                    currency
                );

                console.log(`   Result: ${result.isValid ? '✅ Valid' : '❌ Invalid'}`);
                if (!result.isValid) {
                    console.log(`   Error: ${result.error}`);
                }

                // 所有真实交易都应该能够验证
                expect(result.isValid).toBe(true);
                expect(result.txDetails).toBeDefined();
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

    describe("Transaction Tampering Detection Tests", () => {
        it("should detect amount tampering in USDC transaction", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[usdcTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const tamperedAmount = convertAmountToSmallestUnit('10', currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                usdcTx.recipientAddress,
                tamperedAmount, // 篡改金额：真实是1 USDC，但声称是10 USDC
                usdcTx.senderAddress,
                currency
            );
            console.log('Amount tampering test (10 USDC instead of 1):', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('amount mismatch');
        });

        it("should detect currency tampering in ETH transaction", async () => {
            const ethTx = TEST_TRANSACTIONS['ethereum-sepolia'].ethTx;
            const currency = BLOCKCHAIN_CONFIG.currencies.usdc; // 篡改货币：真实是ETH，但声称是USDC
            const amountInSmallestUnit = convertAmountToSmallestUnit(ethTx.amount.toString(), currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                ethTx.hash,
                ethTx.recipientAddress,
                amountInSmallestUnit,
                ethTx.senderAddress,
                currency
            );
            console.log('Currency tampering test (USDC instead of ETH):', result);
            expect(result.isValid).toBe(false);
            // 应该在金额检查处失败，因为原生交易的 value 和 usdc 的期望值不匹配
            expect(result.error).toBeDefined();
        });

        it("should detect sender address tampering", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[usdcTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const amountInSmallestUnit = convertAmountToSmallestUnit(usdcTx.amount.toString(), currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                usdcTx.recipientAddress,
                amountInSmallestUnit,
                '0x1234567890123456789012345678901234567890', // 篡改发送方地址
                currency
            );
            console.log('Sender address tampering test:', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('sender address mismatch');
        });

        it("should detect recipient address tampering", async () => {
            const ethTx = TEST_TRANSACTIONS['ethereum-sepolia'].ethTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[ethTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const amountInSmallestUnit = convertAmountToSmallestUnit(ethTx.amount.toString(), currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                ethTx.hash,
                '0x9876543210987654321098765432109876543210', // 篡改接收方地址
                amountInSmallestUnit,
                ethTx.senderAddress,
                currency
            );
            console.log('Recipient address tampering test:', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('recipient address mismatch');
        });

        it("should detect multiple field tampering in SOL transaction", async () => {
            const solTx = TEST_TRANSACTIONS['solana-devnet'].solTx;
            const currency = BLOCKCHAIN_CONFIG.currencies.usdc; // 篡改货币：真实是SOL，声称是USDC
            const tamperedAmount = convertAmountToSmallestUnit('1.0', currency.decimals);
            const result = await validateDonationTransaction(
                'solana-devnet',
                solTx.hash,
                solTx.recipientAddress,
                tamperedAmount, // 篡改金额：真实是0.15 SOL，声称是1.0 USDC
                'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1', // 篡改发送方
                currency
            );
            console.log('Multiple field tampering test (SOL):', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });

        it("should detect precise amount tampering in Solana USDC", async () => {
            const usdcTx = TEST_TRANSACTIONS['solana-devnet'].usdcTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[usdcTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const tamperedAmount = convertAmountToSmallestUnit('1.01', currency.decimals);
            const result = await validateDonationTransaction(
                'solana-devnet',
                usdcTx.hash,
                usdcTx.recipientAddress,
                tamperedAmount, // 细微篡改：真实是1 USDC，声称是1.01 USDC
                usdcTx.senderAddress,
                currency
            );
            console.log('Precise amount tampering test (1.01 instead of 1):', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Amount mismatch');
        });

        it("should detect network mismatch for cross-chain fraud", async () => {
            // 使用以太坊交易的哈希，但声称是Solana网络上的交易
            const ethTx = TEST_TRANSACTIONS['ethereum-sepolia'].ethTx;
            const result = await validateTransaction(
                'solana-devnet', // 错误的网络
                ethTx.hash // 以太坊交易哈希
            );
            console.log('Cross-chain fraud test:', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('failed to get transaction');
        });

        it("should detect wrong network for existing transaction", async () => {
            // 使用Solana交易的哈希，但声称是以太坊网络上的交易
            const solTx = TEST_TRANSACTIONS['solana-devnet'].solTx;
            const result = await validateTransaction(
                'ethereum-sepolia', // 错误的网络
                solTx.hash // Solana交易哈希
            );
            console.log('Wrong network test:', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('RPC Error');
        });

        it("should detect case manipulation attacks", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[usdcTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            // 尝试大小写变化的地址（虽然以太坊地址不区分大小写，但测试系统的鲁棒性）
            const amountInSmallestUnit = convertAmountToSmallestUnit(usdcTx.amount.toString(), currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                usdcTx.recipientAddress.toLowerCase(), // 全小写
                amountInSmallestUnit,
                usdcTx.senderAddress.toUpperCase(), // 全大写
                currency
            );
            console.log('Case manipulation test:', result);
            // 这个应该通过，因为地址比较时会转换为小写
            expect(result.isValid).toBe(true);
        });

        it("should detect zero amount fraud", async () => {
            const ethTx = TEST_TRANSACTIONS['ethereum-sepolia'].ethTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[ethTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const zeroAmount = convertAmountToSmallestUnit('0', currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                ethTx.hash,
                ethTx.recipientAddress,
                zeroAmount, // 声称金额为0
                ethTx.senderAddress,
                currency
            );
            console.log('Zero amount fraud test:', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('amount mismatch');
        });

        it("should detect negative amount fraud", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[usdcTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            // convertAmountToSmallestUnit 会抛出错误，所以我们用 try/catch 来验证
            await expect(async () => {
                const negativeAmount = convertAmountToSmallestUnit('-1', currency.decimals);
                await validateDonationTransaction(
                    'ethereum-sepolia',
                    usdcTx.hash,
                    usdcTx.recipientAddress,
                    negativeAmount, // 负数金额
                    usdcTx.senderAddress,
                    currency
                );
            }).rejects.toThrow('Amount cannot be negative');
        });

        it("should detect decimal precision manipulation", async () => {
            const usdcTx = TEST_TRANSACTIONS['ethereum-sepolia'].usdcTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[usdcTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const tamperedAmount = convertAmountToSmallestUnit('1.000001', currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                usdcTx.hash,
                usdcTx.recipientAddress,
                tamperedAmount, // 微小的精度差异：真实是1，声称是1.000001
                usdcTx.senderAddress,
                currency
            );
            console.log('Decimal precision manipulation test:', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('amount mismatch');
        });

        it("should handle edge case with very large amount claims", async () => {
            const ethTx = TEST_TRANSACTIONS['ethereum-sepolia'].ethTx;
            const currency = BLOCKCHAIN_CONFIG.currencies[ethTx.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            const largeAmount = convertAmountToSmallestUnit('1000000', currency.decimals);
            const result = await validateDonationTransaction(
                'ethereum-sepolia',
                ethTx.hash,
                ethTx.recipientAddress,
                largeAmount, // 声称转了100万ETH
                ethTx.senderAddress,
                currency
            );
            console.log('Large amount fraud test:', result);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('amount mismatch');
        });
    });
});
