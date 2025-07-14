'use client'

import { useState, ChangeEvent } from 'react'
import MyCombobox from '@/components/my-combobox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CardholderIcon, MoneyWavyIcon } from '@phosphor-icons/react/ssr';
import { CurrencyList } from '@/data';

const paymentMethods = [
    { icon: 'usdc', label: 'USDC', value: 'usdc' },
    { icon: 'ethereum', label: 'ETH', value: 'eth' },
];

// 固定汇率配置（相对于美元）
const exchangeRates = {
    usdc: 1.0,    // 1 USDC = 1 USD
    eth: 2500.0   // 1 ETH = 2500 USD
};

// 简化的法币汇率（相对于美元）
const fiatExchangeRates: Record<string, number> = {
    USD: 1.0,      // 美元 (基准货币)
    CNY: 7.2,      // 人民币
    HKD: 7.8,      // 港币
    INR: 83.0,     // 印度卢比
    NGN: 1600.0,   // 尼日利亚奈拉
    GBP: 0.79,     // 英镑
    EUR: 0.92,     // 欧元
    SGD: 1.35,     // 新加坡元
    CAD: 1.38,     // 加拿大元
    AUD: 1.52,     // 澳元
    MYR: 4.68,     // 马来西亚林吉特
    CHF: 0.88,     // 瑞士法郎
    AED: 3.67,     // 阿联酋迪拉姆
    PHP: 56.0,     // 菲律宾比索
};

// 首页中用到的捐款的demo widget
export default function PaymentDemo() {
    const [donationType, setDonationType] = useState<'crypto' | 'cash'>('crypto');
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
    const [dollar, setDollar] = useState(1);
    const [currency, setCurrency] = useState<string>('USD');
    const [targetCurrency, setTargetCurrency] = useState<string>('CNY');
    const [amount, setAmount] = useState<number | ''>(24000);
    const [convertedAmount, setConvertedAmount] = useState<number | ''>('');

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

            {/* Donation Type Selection */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => setDonationType('crypto')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${donationType === 'crypto'
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <CardholderIcon size={16} weight="fill" />
                        <span className="font-medium">Crypto</span>
                    </button>
                    <button
                        onClick={() => setDonationType('cash')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${donationType === 'cash'
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <MoneyWavyIcon size={16} weight="fill" />
                        <span className="font-medium">Cash</span>
                    </button>
                </div>
            </div>

            {/* Content based on donation type */}
            {donationType === 'crypto' ? (
                <CryptoPaymentContent
                    paymentMethod={paymentMethod}
                    amount={amount}
                    dollar={dollar}
                    onPaymentMethodChange={onPaymentMethodChange}
                    onAmountChange={onAmountChange}
                    onDollarChange={onDollarChange}
                />
            ) : (
                <CashPaymentContent
                    amount={amount}
                    currency={currency}
                    targetCurrency={targetCurrency}
                    convertedAmount={convertedAmount}
                    onAmountChange={(value) => setAmount(value)}
                    onCurrencyChange={setCurrency}
                    onTargetCurrencyChange={setTargetCurrency}
                    onConvertedAmountChange={(value) => setConvertedAmount(value)}
                />
            )}
        </div>
    )
}

// 加密货币支付内容组件
function CryptoPaymentContent({
    paymentMethod,
    amount,
    dollar,
    onPaymentMethodChange,
    onAmountChange,
    onDollarChange
}: {
    paymentMethod: string;
    amount: number | '';
    dollar: number;
    onPaymentMethodChange: (value: string) => void;
    onAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onDollarChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <>
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
        </>
    );
}

// 现金支付内容组件
function CashPaymentContent({
    amount,
    currency,
    targetCurrency,
    convertedAmount,
    onAmountChange,
    onCurrencyChange,
    onTargetCurrencyChange,
    onConvertedAmountChange
}: {
    amount: number | '';
    currency: string;
    targetCurrency: string;
    convertedAmount: number | '';
    onAmountChange: (value: number | '') => void;
    onCurrencyChange: (value: string) => void;
    onTargetCurrencyChange: (value: string) => void;
    onConvertedAmountChange: (value: number | '') => void;
}) {
    // 处理基础货币输入变化，同时更新转换后的金额
    const onBaseAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim() ? Number(event.target.value) : '';
        onAmountChange(value);

        // 计算并更新转换后的金额
        if (value !== '' && typeof value === 'number') {
            const baseRate = fiatExchangeRates[currency] || 1;
            const targetRate = fiatExchangeRates[targetCurrency] || 1;

            // 先转换为美元，再转换为目标货币
            const usdAmount = value / baseRate;
            const converted = usdAmount * targetRate;
            onConvertedAmountChange(Number(converted.toFixed(2)));
        } else {
            onConvertedAmountChange('');
        }
    };

    // 处理目标货币输入变化，根据目标货币金额反向计算基础货币金额
    const onTargetAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim() ? Number(event.target.value) : '';

        if (value === '' || value === 0) {
            onAmountChange('');
            onConvertedAmountChange('');
            return;
        }

        if (typeof value === 'number') {
            const baseRate = fiatExchangeRates[currency] || 1;
            const targetRate = fiatExchangeRates[targetCurrency] || 1;

            // 从目标货币转换为美元，再转换为基础货币
            const usdAmount = value / targetRate;
            const baseAmount = usdAmount * baseRate;
            onAmountChange(Number(baseAmount.toFixed(2)));
            onConvertedAmountChange(value);
        }
    };

    return (
        <>
            {/* Amount Input */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold text-black/50">Amount</Label>
                <div className="flex items-center">
                    <div className="flex-1">
                        <input
                            type="number"
                            className="w-full border rounded-l-lg border-r-0 h-14 font-semibold px-4"
                            onChange={onBaseAmountChange}
                            step="0.01"
                            value={amount}
                            placeholder="0.00"
                            title="Enter amount"
                        />
                    </div>
                    <div className="w-32 flex-shrink-0">
                        <MyCombobox
                            className="rounded-r-lg h-14 w-full"
                            options={CurrencyList.map(c => ({ icon: c.icon, label: c.code, value: c.code }))}
                            onChange={onCurrencyChange}
                            value={currency}
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    <Label className="text-sm font-semibold text-black/50">Send in a different currency</Label>
                    <div className="flex items-center">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 z-10">
                                ≈
                            </span>
                            <input
                                type="number"
                                className="w-full border rounded-l-lg border-r-0 h-14 font-semibold pl-8 pr-4 focus:outline-none"
                                value={convertedAmount}
                                placeholder="0.00"
                                step="0.01"
                                onChange={onTargetAmountChange}
                            />
                        </div>
                        <div className="w-32 flex-shrink-0">
                            <MyCombobox
                                className="rounded-r-lg h-14 w-full"
                                options={CurrencyList.map(c => ({ icon: c.icon, label: c.code, value: c.code }))}
                                onChange={onTargetCurrencyChange}
                                value={targetCurrency}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
