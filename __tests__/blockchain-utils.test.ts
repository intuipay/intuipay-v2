import { describe, it, expect } from "vitest";
import { convertToSmallestUnit } from '@/config/blockchain';

describe('Blockchain Utility Functions', () => {
    describe('convertToSmallestUnit', () => {
        it('should convert PHRS amount without precision loss', () => {
            const result = convertToSmallestUnit(0.14, 'phrs');
            expect(result).toBe(140000000000000000n); // 18位小数的正确结果 (bigint)
            expect(result.toString()).toBe('140000000000000000');
        });

        it('should convert ETH amount correctly', () => {
            const result = convertToSmallestUnit(1, 'eth');
            expect(result).toBe(1000000000000000000n); // 1 ETH = 10^18 wei (bigint)
        });

        it('should convert USDC amount correctly', () => {
            const result = convertToSmallestUnit(1, 'usdc');
            expect(result).toBe(1000000n); // 1 USDC = 10^6 micro USDC (bigint)
        });

        it('should convert SOL amount correctly', () => {
            const result = convertToSmallestUnit(1, 'sol');
            expect(result).toBe(1000000000n); // 1 SOL = 10^9 lamports (bigint)
        });

        it('should handle decimal amounts correctly', () => {
            const result = convertToSmallestUnit(0.1, 'eth');
            expect(result).toBe(100000000000000000n); // 0.1 ETH (bigint)
        });

        it('should handle very small amounts correctly', () => {
            const result = convertToSmallestUnit(0.000001, 'usdc');
            expect(result).toBe(1n); // 0.000001 USDC = 1 micro USDC (bigint)
        });

        it('should handle amounts with many decimal places', () => {
            // 使用 JavaScript 能够精确表示的数字
            const result = convertToSmallestUnit(0.12345678912345678, 'eth');
            expect(result).toBe(123456789123456780n); // JavaScript 实际存储的值 (bigint)
        });

        it('should demonstrate precision limitation of number input', () => {
            // 这个测试展示了为什么在实际应用中应该考虑使用字符串输入
            const preciseDecimal = 0.123456789123456789;
            const actualValue = preciseDecimal.toString();
            const result = convertToSmallestUnit(preciseDecimal, 'eth');

            // JavaScript 浮点数精度限制
            expect(actualValue).toBe('0.12345678912345678');
            expect(result).toBe(123456789123456780n); // 现在返回 bigint
        });

        it('should handle amounts that exceed decimals precision', () => {
            // USDC只有6位小数，viem 会进行四舍五入（比截断更准确）
            const result = convertToSmallestUnit(1.1234567890, 'usdc');
            expect(result).toBe(1123457n); // 四舍五入到6位小数 (bigint)
        });

        it('should handle integer amounts', () => {
            const result = convertToSmallestUnit(5, 'phrs');
            expect(result).toBe(5000000000000000000n); // 5 PHRS (bigint)
        });

        it('should handle unknown currency', () => {
            const result = convertToSmallestUnit(1, 'unknown');
            expect(result).toBe(0n); // 返回 BigInt(0) 而不是原始值
        });
    });

    describe('Precision Loss Prevention', () => {
        it('should prevent the original precision loss issue', () => {
            // 原始问题：0.14 PHRS 应该是 140000000000000000，而不是 140000000000000020
            const preciseResult = convertToSmallestUnit(0.14, 'phrs');
            const impreciseResult = (0.14 * Math.pow(10, 18)).toString();

            expect(preciseResult).toBe(140000000000000000n); // 现在返回 bigint
            expect(impreciseResult).not.toBe('140000000000000000'); // 验证原方法确实有问题
        });

        it('should handle edge cases that commonly cause precision issues', () => {
            // 常见的精度问题案例
            const testCases = [
                { amount: 0.1, currency: 'eth', expected: 100000000000000000n },
                { amount: 0.2, currency: 'eth', expected: 200000000000000000n },
                { amount: 0.3, currency: 'eth', expected: 300000000000000000n },
                { amount: 0.14, currency: 'phrs', expected: 140000000000000000n },
                { amount: 0.99, currency: 'usdc', expected: 990000n },
            ];

            testCases.forEach(({ amount, currency, expected }) => {
                const result = convertToSmallestUnit(amount, currency);
                expect(result).toBe(expected); // 直接比较 bigint 值
            });
        });
    });
});
