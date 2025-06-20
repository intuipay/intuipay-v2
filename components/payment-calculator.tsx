'use client'

import { useEffect, useMemo, useState } from 'react'
import uniq from 'lodash-es/uniq';
import CompareRateDrawer from './compare-rate-drawer'
import MyCombobox from '@/components/my-combobox';
import { CurrencyList, UniversityList } from '@/data';
import useStore from '@/store';

export default function PaymentCalculator() {
  const isLoading = useStore(state => state.isLoading);
  const paymentMethodList = useStore(state => state.paymentMethodList);
  const updateAllMethods = useStore(state => state.updateAllMethods);
  const [fromCountry, setFromCountry] = useState('China')
  const [toCountry, setToCountry] = useState('United States')
  const [university, setUniversity] = useState('')
  const [amount, setAmount] = useState<number | ''>(24000);
  const [currency, setCurrency] = useState<string>('USD');
  const toCountries = useMemo(() => {
    const countries = uniq(UniversityList.map(item => item.country));
    return CurrencyList.filter(item => countries.includes(item.country));
  }, []);
  const universities = useMemo(() => {
    return UniversityList.filter(item => item.country === toCountry);
  }, [toCountry]);
  const fromCurrency = useMemo(() => {
    return CurrencyList.find(item => item.country === fromCountry)?.code;
  }, [fromCountry]);

  useEffect(() => {
    const fromCode: string = CurrencyList.find(item => item.country === fromCountry)?.code as string;
    updateAllMethods(currency, fromCode, Number(amount));
  }, [fromCountry, amount, currency]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="from-country" className="block text-sm font-medium">
          Paying From
        </label>
        <MyCombobox
          labelKey="country"
          options={CurrencyList}
          onChange={setFromCountry}
          value={fromCountry}
          valueKey="country"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="to-country" className="block text-sm font-medium">
          Institution Destination
        </label>
        <MyCombobox
          labelKey="country"
          options={toCountries}
          onChange={setToCountry}
          value={toCountry}
          valueKey="country"
        />
        <MyCombobox
          iconPath="university"
          iconExtension="png"
          labelKey="name"
          options={universities}
          onChange={setUniversity}
          value={university}
          valueKey="name"
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
            onChange={event => setAmount(event.target.value.trim() ? Number(event.target.value) : '')}
            step="0.01"
            value={amount}
          />
          <MyCombobox
            className="rounded-r-lg h-14"
            labelKey="code"
            options={CurrencyList}
            onChange={setCurrency}
            value={currency}
            valueKey="code"
          />
        </div>
      </div>

      <div className="space-y-2">
        <p>Best price with Intuipay</p>
        {isLoading
          ? <div className="skeleton w-full h-9 bg-gray-100" />
          : <p className="text-3xl font-bold">{(paymentMethodList?.[ 0 ]?.amountRange?.[ 0 ] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0} {fromCurrency}</p>
        }
        <p>Will take only a few seconds</p>
      </div>

      <CompareRateDrawer />
    </div>
  )
}
