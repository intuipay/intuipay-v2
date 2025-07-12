'use client'

import { useEffect, useMemo, useState, ChangeEvent } from 'react'
import MyCombobox from '@/components/my-combobox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const paymentMethods = [
    { icon: 'usdc', label: 'USDC', value: 'usdc' },
    { icon: 'ethereum', label: 'ETH', value: 'eth' },
];

// 固定汇率配置（相对于美元）
const exchangeRates = {
    usdc: 1.0,    // 1 USDC = 1 USD
    eth: 2500.0   // 1 ETH = 2500 USD
};

// 首页中用到的捐款的demo widget
export default function PaymentDemo() {
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
    const [amount, setAmount] = useState(1);
    const [dollar, setDollar] = useState(1);

    function onAmountChange(event: ChangeEvent<HTMLInputElement>) {
        const input = event.target as HTMLInputElement;
        const value = input.value ? Number(input.value) : 0;
        setAmount(value);
        
        // 根据当前支付方式和汇率计算美元价值
        const rate = exchangeRates[paymentMethod as keyof typeof exchangeRates];
        const dollarValue = value * rate;
        setDollar(Number(dollarValue.toFixed(2)));
    }

    // update crypto amount based on dollar and payment method
    function onDollarChange(event: ChangeEvent<HTMLInputElement>) {
        const input = event.target as HTMLInputElement;
        const value = input.value ? Number(input.value) : 0;
        setDollar(value);
        
        // 根据当前支付方式和汇率计算加密货币数量
        const rate = exchangeRates[paymentMethod as keyof typeof exchangeRates];
        const cryptoAmount = value / rate;
        setAmount(Number(cryptoAmount.toFixed(6)));
    }

    // 当支付方式改变时，重新计算金额
    function onPaymentMethodChange(value: string) {
        setPaymentMethod(value);
        
        // 设置 amount 为 1，然后根据新的汇率计算美元价值
        const newAmount = 1;
        setAmount(newAmount);
        
        const rate = exchangeRates[value as keyof typeof exchangeRates];
        const dollarValue = newAmount * rate;
        setDollar(Number(dollarValue.toFixed(2)));
    }

    return (
        <div className="space-y-6 pt-8">
            <h2 className="text-xl font-semibold text-center text-black">Make your donation today</h2>

            {/* Currency Selection */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-black/50">Donate with</Label>
                </div>
                <MyCombobox
                    className="rounded-lg h-12"
                    iconClass="top-3"
                    iconPath="information"
                    iconExtension="png"
                    options={paymentMethods}
                    onChange={onPaymentMethodChange}
                    value={paymentMethod}
                />
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold text-black/50">Amount</Label>
                <div className={`flex items-center border border-black/10 rounded-lg focus-within:outline focus-within:outline-1 focus-within:outline-blue-400`}>
                    <Input
                        className="text-sm h-12 flex-1 px-4 focus:outline-none"
                        hasRing={false}
                        min="0"
                        placeholder="1.0"
                        type="number"
                        value={amount}
                        onChange={onAmountChange}
                    />
                    <div className="text-sm w-fit flex-none px-4 flex items-center gap-1">
                        {paymentMethod} ≈ $
                    </div>
                    <Input
                        className="text-sm h-12 flex-1 px-4 focus:outline-none"
                        hasRing={false}
                        min="0"
                        type="number"
                        value={dollar}
                        onChange={onDollarChange}
                    />
                </div>
            </div>
        </div>
    )
}
