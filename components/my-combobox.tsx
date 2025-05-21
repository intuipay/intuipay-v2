'use client';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { useMemo, useState } from 'react';
import { CheckIcon, ChevronDownIcon, CircleXIcon } from 'lucide-react';

type Props = {
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function MyCombobox({
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
          className="w-full border rounded-lg h-14 font-semibold px-4"
          aria-label="Select country"
          value={selected}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-4">
          <ChevronDownIcon className="size-4 text-gray-400 group-data-hover:fill-white" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom"
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
