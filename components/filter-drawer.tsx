'use client'

import type React from 'react'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Flask, Smiley, MapPin, Coin, Bank } from '@phosphor-icons/react';
import { ProjectCategories, ProjectDonationMethods, ProjectTypes } from '@/data'
import { ProjectFilter } from '@/types'
import { useCallback } from 'react'
import { debounce } from 'lodash-es'

type FilterDrawerProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  filter: ProjectFilter
  setFilter: (filter: ProjectFilter) => void
}

export function FilterDrawer({ isOpen, onOpenChange, filter, setFilter }: FilterDrawerProps) {
  function doClearAll() {
    setFilter({
      category: ProjectCategories.All,
      progressMin: 0,
      progressMax: 100,
      location: '',
      donationMethods: ProjectDonationMethods.All,
      projectType: ProjectTypes.All,
    });
  }
  // use debounce to set progress
  const debouncedSetProgress = useCallback(
    debounce((value: number[]) => {
      setFilter({ ...filter, progressMin: value[ 0 ], progressMax: value[ 1 ] });
    }, 1500),
    [filter, setFilter]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full md:max-w-md p-0 flex flex-col"
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevents auto-focus on first element
      >
        <SheetHeader className="px-6 py-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-semibold">Filter</SheetTitle>
            <div className="flex items-center space-x-4">
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-grow px-6 py-8">
          <div className="flex justify-end pt-3">
            <Button
              variant="link"
              className="text-sm text-primary p-0 h-auto"
              onClick={doClearAll}
              type="button"
            >
              CLEAR ALL
            </Button>
          </div>
          <div className="space-y-3">
            {/* Category Section */}
            <FilterSection
              className="border-b py-5"
              icon={Flask}
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
              className="border-b py-5" icon={Smiley} title="Progress">
              <div className="mt-2">
                <Slider
                  thumbs={2}
                  value={[filter.progressMin, filter.progressMax]}
                  max={100}
                  step={1}
                  className="[&>span:first-child]:h-1 [&>span:first-child]:bg-action-blue [&>span:first-child_span]:bg-action-blue [&>span:first-child_span]:border-action-blue [&>span:first-child_span]:ring-offset-background [&>span:first-child_span]:focus-visible:ring-action-blue/50"
                  minStepsBetweenThumbs={1}
                  onValueChange={(value) => debouncedSetProgress(value)}
                />
              </div>
            </FilterSection>

            {/* Location Section */}
            <FilterSection
              className="border-b py-5"
              icon={MapPin}
              title="Location"
            >
              <div className="space-y-3">
                <Select
                  value={filter.location}
                  onValueChange={(value) => setFilter({ ...filter, location: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="By Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="country-all">All Countries</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  defaultValue="state-all"
                  disabled
                  value={filter.location}
                  onValueChange={(value) => setFilter({ ...filter, location: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="By State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="state-all">All States</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  defaultValue="city-all"
                  disabled
                  value={filter.location}
                  onValueChange={(value) => setFilter({ ...filter, location: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="By City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city-all">All Cities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FilterSection>

            {/* Donation Methods Section */}
            <FilterSection
              className="border-b py-5"
              icon={Coin}
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
              className="border-b py-5"
              icon={Bank}
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
          </div>
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
      <div className="flex items-center mb-8">
        <Icon className="h-5 w-5 mr-2 text-neutral-text" />
        <h3 className="text-md font-medium text-neutral-text">{title}</h3>
      </div>
      {children}
    </div>
  )
}
