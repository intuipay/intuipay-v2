"use client"

import type React from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FlaskConical, Smile, MapPin, Coins, Landmark, X } from "lucide-react"

type FilterDrawerProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const categories = [
  { id: "all-cat", label: "All" },
  { id: "animals", label: "Animals" },
  { id: "art-culture", label: "Art & Culture" },
  { id: "children-youth", label: "Children & Youth" },
  { id: "health-medical", label: "Health & Medical" },
  { id: "education", label: "Education" },
  { id: "environment", label: "Environment" },
]

const donationMethods = [
  { id: "all-dm", label: "All" },
  { id: "crypto", label: "Crypto Only" },
  { id: "cash", label: "Cash Only" },
  { id: "crypto-cash", label: "Crypto / Cash" },
]

const projectTypes = [
  { id: "all-pt", label: "All" },
  { id: "non-profit", label: "Non-Profit / Academic Research" },
  { id: "for-profit", label: "For-Profit Research" },
  { id: "government", label: "Government-Funded Research" },
  { id: "philanthropic", label: "Philanthropic Research" },
]

export function FilterDrawer({ isOpen, onOpenChange }: FilterDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md p-0 flex flex-col"
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevents auto-focus on first element
      >
        <SheetHeader className="px-6 py-4 border-b">
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

        <ScrollArea className="flex-grow px-6 py-4">
          <div className="flex justify-end">
            <Button
              variant="link"
              className="text-sm text-[#2461F2] p-0 h-auto"
              onClick={() => console.log("Clear all filters")} // Implement clear logic
            >
              CLEAR ALL
            </Button>
          </div>
          <div className="space-y-8">
            {/* Category Section */}
            <FilterSection icon={FlaskConical} title="Category">
              <RadioGroup defaultValue="all-cat" className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={cat.id} id={cat.id} />
                    <Label htmlFor={cat.id} className="font-normal">
                      {cat.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FilterSection>

            <Separator />

            {/* Progress Section */}
            <FilterSection icon={Smile} title="Progress">
              <div className="mt-2">
                <Slider
                  defaultValue={[45]}
                  max={100}
                  step={1}
                  className="[&>span:first-child]:h-1 [&>span:first-child]:bg-action-blue [&>span:first-child_span]:bg-action-blue [&>span:first-child_span]:border-action-blue [&>span:first-child_span]:ring-offset-background [&>span:first-child_span]:focus-visible:ring-action-blue/50"
                />
                <div className="flex justify-between text-xs text-neutral-darkgray mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </FilterSection>

            <Separator />

            {/* Location Section */}
            <FilterSection icon={MapPin} title="Location">
              <div className="space-y-3">
                <Select defaultValue="country-all">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="By Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="country-all">All Countries</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="state-all" disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="By State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="state-all">All States</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="city-all" disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="By City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city-all">All Cities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FilterSection>

            <Separator />

            {/* Donation Methods Section */}
            <FilterSection icon={Coins} title="Donation Methods">
              <RadioGroup defaultValue="all-dm" className="space-y-2">
                {donationMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="font-normal">
                      {method.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FilterSection>

            <Separator />

            {/* Project Type Section */}
            <FilterSection icon={Landmark} title="Project Type">
              <RadioGroup defaultValue="all-pt" className="space-y-2">
                {projectTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <Label htmlFor={type.id} className="font-normal">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FilterSection>
          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t">
          <Button type="submit" className="w-full bg-action-blue hover:bg-action-blue/90">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Helper component for filter sections
type FilterSectionProps = {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}

function FilterSection({ icon: Icon, title, children }: FilterSectionProps) {
  return (
    <div>
      <div className="flex items-center mt-13 mb-8">
        <Icon className="h-5 w-5 mr-2 text-neutral-text" />
        <h3 className="text-md font-medium text-neutral-text">{title}</h3>
      </div>
      {children}
    </div>
  )
}
