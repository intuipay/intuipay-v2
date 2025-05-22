'use client'

import { useEffect, useMemo, useState } from 'react'
import uniq from 'lodash-es/uniq';
import CompareRateDrawer from './compare-rate-drawer'
import MyCombobox from '@/components/my-combobox';
import { CurrencyList, UniversityList } from '@/data';
import useStore from '@/store';

export default function PaymentCalculator() {
  const updateAllMethods = useStore(state => state.updateAllMethods);
  const paymentMethodList = useStore(state => state.paymentMethodList);
  const [fromCountry, setFromCountry] = useState('China')
  const [toCountry, setToCountry] = useState('United States')
  const [university, setUniversity] = useState('')
  const [amount, setAmount] = useState<number>(24000);
  const [currency, setCurrency] = useState<string>('USD');
  const univercities = useMemo(() => {
    return uniq(UniversityList.filter(item => item.country === toCountry)
      .map(item => item.name));
  }, [toCountry]);
  const fromCurrency = useMemo(() => {
    return CurrencyList.find(item => item.country === fromCountry)?.code;
  }, [fromCountry]);

  useEffect(() => {
    const fromCode: string = CurrencyList.find(item => item.country === fromCountry)?.code as string;
    updateAllMethods(fromCode, currency, amount);
  }, [fromCountry, amount, currency]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label htmlFor="from-country" className="block text-sm font-medium">
          Paying From
        </label>
        <MyCombobox
          options={CurrencyList.map(currency => currency.country)}
          onChange={setFromCountry}
          value={fromCountry}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="to-country" className="block text-sm font-medium">
          Institution Destination
        </label>
        <MyCombobox
          options={uniq(UniversityList.map(item => item.country))}
          onChange={setToCountry}
          value={toCountry}
        />
        <MyCombobox
          options={univercities}
          onChange={setUniversity}
          value={university}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-medium">
          Payment Amount
        </label>
        <div className="flex items-center">
          <input
            type="number"
            className="w-full border rounded-l-lg border-r-0 h-14 font-semibold px-4"
            onChange={event => setAmount(Number(event.target.value))}
            value={amount}
          />
          <MyCombobox
            className="rounded-r-lg"
            options={CurrencyList.map(item => item.code)}
            onChange={setCurrency}
            value={currency}
          />
        </div>
      </div>

      <div className="pt-4 space-y-2">
        <p>Best price paying with Intuipay</p>
        <p className="text-3xl font-bold">{paymentMethodList?.[ 0 ]?.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0} {fromCurrency}</p>
        <p>Will take only <strong>~20-60 mins</strong></p>
      </div>

      <CompareRateDrawer />
    </div>
  )
}
