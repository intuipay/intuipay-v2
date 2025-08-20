'use client'

import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MagnifyingGlass, Faders, ArrowUp, CaretDown, Check } from '@phosphor-icons/react';
import { FilterDrawer } from '@/components/filter-drawer'
import { ProjectFilter } from '@/types'
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@radix-ui/react-dropdown-menu'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProjectCategories, ProjectDonationMethods, ProjectTypes } from '@/data'
import Link from 'next/link'

type ProjectHomepageProps = PropsWithChildren & {
  initialSearch?: string;
  initialOrderBy?: string;
  initialOrderDir?: string;
  initialCategory?: string;
  initialProgress?: string;
  initialLocation?: string;
  initialDonationMethods?: string;
  initialProjectType?: string;
  initialExcludes?: string;
};

const SortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-raised', label: 'Most Raised' },
  { value: 'ending-soon', label: 'Ending Soon' },
]

export default function ProjectHomepage({
  children,
  initialSearch = '',
  initialOrderBy = 'id',
  initialOrderDir = 'desc',
  initialCategory,
  initialProgress,
  initialLocation = '',
  initialDonationMethods,
  initialProjectType,
  initialExcludes = ''
}: ProjectHomepageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [searchQueryInput, setSearchQueryInput] = useState(initialSearch);
  const [currentSortBy, setCurrentSortBy] = useState(() => {
    const orderBy = initialOrderBy;
    const orderDir = initialOrderDir;
    if (orderBy === 'id' && orderDir === 'desc') return 'newest';
    if (orderBy === 'id' && orderDir === 'asc') return 'oldest';
    if (orderBy === 'goal_amount' && orderDir === 'desc') return 'most-raised';
    if (orderBy === 'end_date' && orderDir === 'asc') return 'ending-soon';
    return 'newest';
  });

  const [activeFilters, setActiveFilters] = useState<ProjectFilter>(() => ({
    category: initialCategory ? parseInt(initialCategory) as ProjectCategories : ProjectCategories.All,
    progressMin: initialProgress ? parseInt(initialProgress) : 0,
    progressMax: initialProgress ? parseInt(initialProgress) : 100,
    location: initialLocation,
    donationMethods: initialDonationMethods ? parseInt(initialDonationMethods) as ProjectDonationMethods : ProjectDonationMethods.All,
    projectType: initialProjectType ? parseInt(initialProjectType) as ProjectTypes : ProjectTypes.All,
    excludes: initialExcludes.split(',').filter(Boolean),
  }));

  function updateUrlWithFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('search', searchQueryInput);

    let orderBy = 'id';
    let orderDir = 'desc';
    switch (currentSortBy) {
      case 'newest': orderBy = 'id'; orderDir = 'desc'; break;
      case 'oldest': orderBy = 'id'; orderDir = 'asc'; break;
      case 'most-raised': orderBy = 'goal_amount'; orderDir = 'desc'; break;
      case 'ending-soon': orderBy = 'end_date'; orderDir = 'asc'; break;
    }
    params.set('order_by', orderBy);
    params.set('order_dir', orderDir);

    if (activeFilters.category !== undefined && activeFilters.category !== ProjectCategories.All) {
      params.set('category', activeFilters.category.toString());
    } else {
      params.delete('category');
    }
    if (activeFilters.progressMin) {
      params.set('progress_min', activeFilters.progressMin.toString());
    } else {
      params.delete('progress_min');
    }
    if (activeFilters.progressMax) {
      params.set('progress_max', activeFilters.progressMax.toString());
    } else {
      params.delete('progress_max');
    }
    if (activeFilters.location) {
      params.set('location', activeFilters.location);
    } else {
      params.delete('location');
    }
    if (activeFilters.donationMethods !== undefined && activeFilters.donationMethods !== ProjectDonationMethods.All) {
      params.set('donation_methods', activeFilters.donationMethods.toString());
    } else {
      params.delete('donation_methods');
    }
    if (activeFilters.projectType !== undefined && activeFilters.projectType !== ProjectTypes.All) {
      params.set('project_type', activeFilters.projectType.toString());
    } else {
      params.delete('project_type');
    }
    if (activeFilters.excludes && activeFilters.excludes.length > 0) {
      params.set('excludes', activeFilters.excludes.join(','));
    } else {
      params.delete('excludes');
    }
    router.push(`${location.pathname}?${params.toString()}`, { scroll: false });
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateUrlWithFilters();
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateUrlWithFilters();
  }, [currentSortBy, activeFilters]);

  return <>
    <section className="flex flex-col-reverse gap-16 items-center lg:items-stretch lg:flex-row w-full lg:py-21 bg-gradient-to-b from-intuipay-lighterblue/20 via-neutral-white to-neutral-white mb-20">
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center lg:text-left">
          Fuel Trusted University-Backed Research
        </h1>
        <p className="text-base font-medium text-neutral-darkgray text-black/50">
          All projects on Intuipay are verified academic research initiatives from accredited universities and institutions, ensuring every donation supports real, impactful science.
        </p>
        <div className="flex w-full mt-auto gap-4 lg:gap-12">
          <form className="flex-grow relative drop-shadow-custom1" onSubmit={handleSearchSubmit}>
            <Input
              type="search"
              placeholder="Search"
              className="rounded-full focus:ring-0 focus:border-neutral-mediumgray border border-black/20 text-base bg-neutral-lightgray w-full h-11 lg:h-15 ps-6 pe-15"
              value={searchQueryInput}
              onChange={(e) => setSearchQueryInput(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-action-blue hover:bg-action-blue/90 w-11 h-11 lg:w-15 lg:h-15 bg-primary rounded-full absolute right-0 top-0"
            >
              <MagnifyingGlass className="w-6 h-6 lg:w-8 lg:h-8" color="white" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <Button
            variant="outline"
            className="flex-none px-8 h-11 lg:h-15 text-sm md:text-base flex items-center rounded-full"
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            Filter
            <Faders size={16} weight="regular" className="ml-2" />
          </Button>
        </div>
      </div>
      <Image
        className="w-80"
        src="/images/diamond.svg"
        alt="Stylized image of hands exchanging coins over a digital interface"
        priority
        width={320}
        height={292}
      />
    </section>
    <div className="flex flex-col items-start md:items-center gap-6 md:flex-row justify-between mb-6 md:mb-8">
      <h2 className="text-lg font-medium sm:text-3xl">
        Explore Projects
      </h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-normal">
            <span className="text-black/50 whitespace-nowrap">Sort by</span>
            <Button variant="outline" className="sm:w-40 h-11 border-neutral-mediumgray text-base rounded-full px-6">
              <ArrowUp size={16} weight="regular" className="me-2" />
              {SortOptions.find((option) => option.value === currentSortBy)?.label}
              <CaretDown size={16} weight="regular" className="ms-2 text-icon-gray" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="sm:w-40"
          align="end"
        >
          <DropdownMenuRadioGroup
            value={currentSortBy}
            onValueChange={setCurrentSortBy}
          >
            {SortOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                className="h-8 flex items-center ps-8 pe-4 relative"
                value={option.value}
              >
                {currentSortBy === option.value && <Check size={16} weight="regular" className="absolute left-2" />}
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {children}

    <div className="flex justify-evenly lg:justify-between items-center flex-col lg:flex-row w-full h-full bg-background-gray my-20 py-16 px-12 sm:px-8 lg:px-11">
      <Image
        src="/images/laptop.svg"
        alt="laptop"
        priority
        width={372}
        height={272}
        className="lg:mb-0 mb-10"
      />
      <section className="lg:ml-16">
        <h2 className="font-bold mb-4 sm:text-4xl text-3xl">Have A Project That Needs Support?</h2>
        <p className="mb-8 font-normal text-black/50">We&apos;re building a platform to support groundbreaking, university-affiliated research. If you&apos;re leading a verified academic or institutional project, you can share it here and start receiving donations.</p>
        <Button className="w-60 h-14 border-neutral-mediumgray text-base rounded-full text-white font-semibold">
          <Link target="_blank" href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/project/new`}>
            Create project
          </Link>
        </Button>
      </section>
    </div>
    <FilterDrawer
      isOpen={isFilterDrawerOpen}
      onOpenChange={setIsFilterDrawerOpen}
      filter={activeFilters}
      setFilter={setActiveFilters}
    />
  </>
}
