'use client';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { CaretDown, CaretUp, XCircle } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import Image from 'next/image';
import { DropdownItemProps } from '@/types';

type Props = {
  className?: string;
  disabled?: boolean;
  hasIcon?: boolean;
  iconClass?: string;
  iconPath?: string;
  iconExtension?: string;
  onChange: (value: string) => void;
  options: DropdownItemProps[];
  value?: string;
  showBalance?: boolean;
  balances?: { [key: string]: { balance: string | null; isLoading: boolean; error: string | null } };
}
type ComboboxProps = {
  symbolKey?: keyof DropdownItemProps;
  valueKey?: keyof DropdownItemProps;
  labelKey?: keyof DropdownItemProps;
}

export default function MyCombobox({
  className = 'rounded-lg h-14',
  disabled,
  hasIcon = true,
  iconClass = 'top-4',
  iconPath = 'country',
  iconExtension = 'svg',
  labelKey = 'label',
  onChange,
  options,
  showBalance = false,
  balances = {},
  symbolKey = 'icon',
  value,
  valueKey = 'value',
}: Props & ComboboxProps) {
  const [selected, setSelected] = useState<DropdownItemProps>(options.find(item => item[ valueKey ] === value) || options[ 0 ]);
  const [query, setQuery] = useState<string>('');
  const filteredOptions = useMemo(() => {
    if (query === '') return options;

    const theQuery = query.trim().toLowerCase();
    return options.filter((item) => {
      return (item[ labelKey ] as string).toLowerCase().includes(theQuery);
    });
  }, [labelKey, query, options]);

  function doUpdate(value: DropdownItemProps) {
    if (!value) return;

    setSelected(value);
    onChange(value[ valueKey ] as string);
  }

  useEffect(() => {
    if (options.includes(selected)) return;

    const option = options.find(item => item[ valueKey ] === value);
    if (option) return;

    doUpdate(options[ 0 ]);
  }, [options, selected, value, valueKey]);

  return (
    <Combobox
      value={selected}
      onChange={doUpdate}
      onClose={() => setQuery('')}
    >
      <div className="relative">
        {hasIcon && (query
          ? <div className={clsx('absolute size-6 rounded-full bg-primary left-4', iconClass)} />
          : <Image
              src={`/images/${iconPath}/${selected[ symbolKey ]}.${iconExtension}`}
              width={24}
              height={24}
              className={clsx('size-6 absolute left-4', iconClass)}
              alt={selected[ labelKey ] || ''}
              loading="lazy"
            />
        )}
        <ComboboxInput
          className={clsx('w-full ps-12 pe-4 border font-semibold', className)}
          disabled={disabled}
          aria-label="Select country"
          displayValue={(item: DropdownItemProps) => item[ labelKey ] as string}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton
          className="group absolute inset-y-0 right-0 px-4"
          disabled={disabled}
        >
          {({ open }) => (
            open
              ? <CaretUp size={16} className="text-gray-400" />
              : <CaretDown size={16} className="text-gray-400" />
          )}
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom"
        transition
        className="w-(--input-width) border rounded-lg bg-white space-y-1"
      >
        {filteredOptions.map((option, index) => (
          <ComboboxOption
            className={clsx(
              'flex items-center justify-between px-4 h-12 cursor-pointer',
              value === option[ valueKey ] ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-blue-50',
            )}
            disabled={disabled}
            key={option[ valueKey ]}
            value={option}
          >
            <div className="flex items-center gap-3">
              {hasIcon && <Image
                src={`/images/${iconPath}/${option[ symbolKey ]}.${iconExtension}`}
                width={24}
                height={24}
                className="w-6 h-6 block"
                alt={option[ valueKey ] || ''}
                loading="lazy"
              />}
              {option[ labelKey ]}
            </div>
            {showBalance && (
              <div className="text-sm text-gray-600 font-medium">
                {(() => {
                  const optionValue = option[ valueKey ] as string;
                  const balance = balances[ optionValue ];
                  if (!balance) return null;
                  
                  if (balance.isLoading) {
                    return <span className="text-gray-400">Loading...</span>;
                  }
                  if (balance.error) {
                    return <span className="text-red-400">Error</span>;
                  }
                  if (balance.balance) {
                    const symbol = optionValue.toUpperCase();
                    return (
                      <span className="text-green-600">
                        {parseFloat(balance.balance).toFixed(4)} {symbol}
                      </span>
                    );
                  }
                  return <span className="text-gray-400">0.0000 {optionValue.toUpperCase()}</span>;
                })()}
              </div>
            )}
          </ComboboxOption>
        ))}
        {!filteredOptions.length && <div className="flex items-center gap-3 px-4 h-12">
          <XCircle size={20} />
          No results found
        </div>}
      </ComboboxOptions>
    </Combobox>
  )
}
