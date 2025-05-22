'use client';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { useMemo, useState } from 'react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CircleXIcon } from 'lucide-react';
import { clsx } from 'clsx';

type Props = {
  className?: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function MyCombobox({
  className = 'rounded-lg',
  value,
  options,
  onChange,
}: Props) {
  const [selected, setSelected] = useState<string>(value || options[ 0 ] || '');
  const [query, setQuery] = useState<string>('');
  const filteredOptions = useMemo(() => {
    return query === ''
      ? options
      : options.filter((item) => {
        return item.toLowerCase().includes(query.toLowerCase());
      });
  }, [query]);

  function doUpdate(value: string) {
    setSelected(value);
    onChange(value);
  }

  return (
    <Combobox
      value={selected}
      onChange={doUpdate}
      onClose={() => setQuery('')}
    >
      <div className="relative">
        <ComboboxInput
          className={clsx('w-full border h-14 font-semibold px-4', className)}
          aria-label="Select country"
          value={selected}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-4">
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
        {filteredOptions.map(option => (
          <ComboboxOption
            className="flex items-center gap-3 hover:bg-blue-50 px-4 h-12 cursor-pointer"
            key={option}
            value={option}
          >
            {option === selected ? <CheckIcon className="size-5" /> : <span className="block size-5" /> }
            {option}
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
