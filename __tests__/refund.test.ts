import { describe, it, expect } from "vitest";
import { getUserRefund } from "@/lib/data";

describe('Test Refund', () => {
    describe('getUserRefund', () => {
        it('should return user refund information', async () => {
            process.loadEnvFile('./.env');
            const userId = 'jXqDtVMvNv1vf81izMoLabAkoOlQX5P1';
            const projectId = 120002;
            const refund = await getUserRefund(userId, projectId);
            console.log('refund info', refund);

            // { amount: 0, count: 1, dollar: 100 }
            expect(refund).toHaveProperty('amount');
            expect(refund).toHaveProperty('count');
            expect(refund).toHaveProperty('dollar');
        });
    });
});
