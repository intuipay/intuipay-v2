'use client'

import type React from 'react'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CircleNotchIcon, XIcon, FlaskIcon, MapPinIcon, CoinIcon, BankIcon } from '@phosphor-icons/react';
import { ProjectCategories, ProjectDonationMethods, ProjectTypes } from '@/data'
import { Country, ICountry, State, IState } from 'country-state-city';
import { useEffect, useState, useCallback } from 'react'
import { ProjectFilter } from '@/types'
import { debounce } from 'lodash-es'
import { Input } from '@/components/ui/input'

type FilterDrawerProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  filter: ProjectFilter
  setFilter: (filter: ProjectFilter) => void
}

export function FilterDrawer({ isOpen, onOpenChange, filter, setFilter }: FilterDrawerProps) {
  const [countries, setCountries] = useState<Partial<ICountry>[]>([]);
  const [states, setStates] = useState<Partial<IState>[]>([]);

  const [country, setCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [city, setCity] = useState<string>('');

  function doClearAll() {
    setCountry('');
    setSelectedState('');
    setCity('');
    setFilter({
      category: ProjectCategories.All,
      location: '',
      donationMethods: ProjectDonationMethods.All,
      projectType: ProjectTypes.All,
      progressMin: 0,
      progressMax: 100,
    });
  }
  function handleCountryChange(country: string) {
    setCountry(country);
    setSelectedState('');
    setCity('');
    updateFilter({
      ...filter,
      location: getLocation({ newCountry: country }),
    });
    const countryCode = countries.find(c => c.name === country)?.isoCode;
    const filteredStates = State.getStatesOfCountry(countryCode);
    setStates(filteredStates);
  }
  function handleProgressChange(value: number[]) {
    updateFilter({ ...filter, progressMin: value[ 0 ], progressMax: value[ 1 ] });
  }
  function handleStateChange(state: string) {
    setSelectedState(state);
    updateFilter({
      ...filter,
      location: getLocation({ newState: state }),
    });
  }
  function handleCityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const city = e.target.value;
    setCity(city);
    updateFilter({
      ...filter,
      location: getLocation({ newCity: city }),
    });
  }

  function getLocation({
    newCountry = country,
    newState = selectedState,
    newCity = city,
  }: {
    newCountry?: string;
    newState?: string;
    newCity?: string;
  }) {
    return `${newCountry}${newState ? '__' + newState : ''}${newCity ? '__' + newCity : ''}%`
  }
  const updateFilter = useCallback(
    debounce((filter: ProjectFilter) => {
      setFilter(filter);
    }, 1500),
    [setFilter]
  );

  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full md:max-w-md py-7.5 px-8 sm:px-12 flex flex-col gap-8"
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevents auto-focus on first element
      >
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-semibold">Filter</SheetTitle>
            <div className="flex items-center">
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <XIcon className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-grow">
          <div className="flex justify-end mb-8">
            <Button
              variant="link"
              className="text-base font-medium text-primary p-0 h-auto"
              onClick={doClearAll}
              type="button"
            >
              CLEAR ALL
            </Button>
          </div>

          {/* Category Section */}
          <FilterSection
            className="border-b py-5 mb-8"
            icon={FlaskIcon}
            title="Category"
          >
            <RadioGroup
              defaultValue="all-cat"
              className="space-y-4 max-h-50 overflow-y-auto"
              value={filter.category.toString()}
              onValueChange={(value) => setFilter({ ...filter, category: Number(value) })}
            >
              {Object.entries(ProjectCategories).map(([label, id]) => (
                !isNaN(Number(id)) && (
                  <div key={id} className="flex items-center space-x-2">
                    <RadioGroupItem value={id.toString()} id={`category-${id}`} />
                    <Label htmlFor={`category-${id}`} className="font-normal">
                      {label}
                    </Label>
                  </div>
                )
              ))}
            </RadioGroup>
          </FilterSection>

          {/* Progress Section */}
          <FilterSection
            className="border-b pt-5 pb-10 mb-8"
            icon={CircleNotchIcon}
            title="Progress"
          >
            <div className="mt-14">
              <Slider
                thumbs={2}
                value={[filter.progressMin, filter.progressMax]}
                max={100}
                step={1}
                className="[&>span:first-child]:h-1 [&>span:first-child]:bg-action-blue [&>span:first-child_span]:bg-action-blue [&>span:first-child_span]:border-action-blue [&>span:first-child_span]:ring-offset-background [&>span:first-child_span]:focus-visible:ring-action-blue/50"
                minStepsBetweenThumbs={1}
                onValueChange={handleProgressChange}
              />
            </div>
          </FilterSection>

          {/* Location Section */}
          <FilterSection
            className="border-b py-5 mb-8"
            icon={MapPinIcon}
            title="Location"
          >
            <div className="space-y-4">
              <Select
                value={country}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="By Country" />
                </SelectTrigger>
                <SelectContent>
                  {
                    countries.map(country => (
                      <SelectItem key={country.name!} value={country.name!}>{country.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <Select
                disabled={!country}
                value={selectedState}
                onValueChange={handleStateChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="By State" />
                </SelectTrigger>
                <SelectContent>
                  {
                    states.map(state => (
                      <SelectItem key={`${state.name!}-${state.isoCode}`} value={state.name!}>{state.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <Input
                className="h-10"
                type="text"
                placeholder="City"
                value={city}
                onChange={handleCityChange}
              />
            </div>
          </FilterSection>

          {/* Donation Methods Section */}
          <FilterSection
            className="border-b py-5 mb-8"
            icon={CoinIcon}
            title="Donation Methods"
          >
            <RadioGroup
              defaultValue="all-dm"
              className="space-y-4"
              value={filter.donationMethods.toString()}
              onValueChange={(value) => setFilter({ ...filter, donationMethods: value })}
            >
              {Object.entries(ProjectDonationMethods).map(([label, id]) => (
                !isNaN(Number(id)) && (
                  <div key={id} className="flex items-center space-x-2">
                    <RadioGroupItem value={id.toString()} id={`donation-method-${id}`} />
                    <Label htmlFor={`donation-method-${id}`} className="font-normal">
                      {label}
                    </Label>
                  </div>
                )
              ))}
            </RadioGroup>
          </FilterSection>

          {/* Project Type Section */}
          <FilterSection
            className="py-5"
            icon={BankIcon}
            title="Project Type"
          >
            <RadioGroup
              defaultValue="all-pt"
              className="space-y-4"
              value={filter.projectType.toString()}
              onValueChange={(value) => setFilter({ ...filter, projectType: value })}
            >
              {Object.entries(ProjectTypes).map(([label, id]) => (
                !isNaN(Number(id)) && (
                  <div key={id} className="flex items-center space-x-2">
                    <RadioGroupItem value={id.toString()} id={`project-type-${id}`} />
                    <Label htmlFor={`project-type-${id}`} className="font-normal">
                      {label}
                    </Label>
                  </div>
                )
              ))}
            </RadioGroup>
          </FilterSection>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Helper component for filter sections
type FilterSectionProps = {
  icon: React.ElementType
  title: string
  children: React.ReactNode
  className?: string
}

function FilterSection({ icon: Icon, title, children, className }: FilterSectionProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-8">
        <Icon className="size-6 text-neutral-text" weight="fill" />
        <h3 className="text-md font-medium text-neutral-text">{title}</h3>
      </div>
      {children}
    </div>
  )
}
