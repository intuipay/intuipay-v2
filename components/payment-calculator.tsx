'use client'

import { useMemo, useState } from 'react'
import uniq from 'lodash-es/uniq';
import CompareRateDrawer from './compare-rate-drawer'
import MyCombobox from '@/components/my-combobox';
import { CurrencyList, UniversityList } from '@/data';

const AmountOptions = ['24,000 USD'];

export default function PaymentCalculator() {
  const [fromCountry, setFromCountry] = useState('China')
  const [toCountry, setToCountry] = useState('United States')
  const [university, setUniversity] = useState('Emory University')
  const [amount, setAmount] = useState('24,000 USD')
  const univercities = useMemo(() => {
    return uniq(UniversityList.filter(item => item.country === toCountry)
      .map(item => item.name));
  }, [toCountry]);

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
        <MyCombobox
          options={AmountOptions}
          onChange={setAmount}
          value={amount}
        />
      </div>

      <div className="pt-4 space-y-2">
        <p>Best price paying with Intuipay</p>
        <p className="text-3xl font-bold">175,432.18 CNY</p>
        <p>Will take only <strong>~20-60 mins</strong></p>
      </div>

      <CompareRateDrawer />
    </div>
  )
}
