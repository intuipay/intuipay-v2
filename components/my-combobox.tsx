'use client';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { CaretDown, CaretUp, XCircle } from "@phosphor-icons/react";
import { clsx } from 'clsx';
import Image from 'next/image';
import { DropdownItemProps } from '@/types';

type Props = {
  className?: string;
  hasIcon?: boolean;
  iconPath?: string;
  iconExtension?: string;
  onChange: (value: string) => void;
  options: DropdownItemProps[];
  symbolKey?: string;
  value?: string;
  valueKey?: 'country' | 'code' | 'name';
}

export default function MyCombobox({
  className = 'rounded-lg',
  hasIcon = true,
  iconPath = 'country',
  iconExtension = 'svg',
  onChange,
  options,
  symbolKey = '',
  value,
  valueKey = 'country',
}: Props) {
  const [selected, setSelected] = useState<DropdownItemProps>(options.find(item => item[ valueKey ] === value) || options[ 0 ]);
  const [query, setQuery] = useState<string>('');
  const filteredOptions = useMemo(() => {
    return query === ''
      ? options
      : options.filter((item) => {
        return item[ valueKey ].toLowerCase().includes(query.toLowerCase());
      });
  }, [query, options, valueKey]);

  function doUpdate(value: DropdownItemProps) {
    if (!value) return;

    setSelected(value);
    onChange(value[ valueKey ]);
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
          ? <div className="absolute size-6 rounded-full bg-primary top-4 left-4" />
          : <Image
              src={`/images/${iconPath}/${selected.icon}.${iconExtension}`}
              width={24}
              height={24}
              className="size-6 absolute top-4 left-4"
              alt={selected.country}
              loading="lazy"
            />
        )}
        <ComboboxInput
          className={clsx('w-full ps-12 pe-4 border h-14 font-semibold', className)}
          aria-label="Select country"
          displayValue={(item: DropdownItemProps) => `${symbolKey ? `${item[ symbolKey ]} ` : ''}${item[ valueKey ]}`}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-4">
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
        {filteredOptions.map(option => (
          <ComboboxOption
            className={clsx(
              'flex items-center gap-3 px-4 h-12 cursor-pointer',
              value === option[ valueKey ] ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-blue-50',
            )}
            key={option[ valueKey ]}
            value={option}
          >
            <div className="flex items-center gap-3">
              {hasIcon && <Image
                src={`/images/${iconPath}/${option.icon}.${iconExtension}`}
                width={24}
                height={24}
                className="w-6 h-6 block"
                alt={option[ valueKey ]}
                loading="lazy"
              />}
              {symbolKey && <span className="text-gray-500">{option[ symbolKey ]}</span>}
              {option[ valueKey ]}
            </div>
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
