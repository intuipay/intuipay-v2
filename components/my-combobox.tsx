'use client';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CircleXIcon } from 'lucide-react';
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
              ? <ChevronUpIcon className="size-4 text-gray-400" />
              : <ChevronDownIcon className="size-4 text-gray-400" />
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
              'flex items-center gap-3 px-4 h-12 cursor-pointer',
              value === option[ valueKey ] ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-blue-50',
            )}
            disabled={disabled}
            key={index}
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
          </ComboboxOption>
        ))}
        {!filteredOptions.length && <div className="flex items-center gap-3 px-4 h-12">
          <CircleXIcon className="size-5" />
          No results found
        </div>}
      </ComboboxOptions>
    </Combobox>
  )
}
