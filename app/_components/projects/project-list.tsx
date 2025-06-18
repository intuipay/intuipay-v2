'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, CheckIcon } from 'lucide-react'
import { FilterDrawer } from '@/components/filter-drawer'
import { ProjectInfo, ProjectFilter } from '@/types'
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import { ProjectCategories, ProjectDonationMethods, ProjectTypes } from '@/data'


type ProjectListProps = {
  data: ProjectInfo[];
  page: number;
  pageSize: number;
  total: number;
}

const SortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-raised', label: 'Most Raised' },
  { value: 'ending-soon', label: 'Ending Soon' },
]

export default function ProjectList({ data, page, pageSize, total }: ProjectListProps) {
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(SortOptions[ 0 ].value);
  const [filter, setFilter] = useState<ProjectFilter>({
    category: ProjectCategories.All,
    progress: 0,
    location: '',
    donationMethods: ProjectDonationMethods.All,
    projectType: ProjectTypes.All,
  });

  function updateSearchAndSort(search: string, orderBy: string, orderDir: string, filter: ProjectFilter) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('search', search);
    searchParams.set('order_by', orderBy);
    searchParams.set('order_dir', orderDir);
    if (filter.category) {
      searchParams.set('category', filter.category.toString());
    }
    if (filter.progress) {
      searchParams.set('progress', filter.progress.toString());
    }
    if (filter.location) {
      searchParams.set('location', filter.location);
    }
    if (filter.donationMethods) {
      searchParams.set('donation_methods', filter.donationMethods.toString());
    }
    if (filter.projectType) {
      searchParams.set('project_type', filter.projectType.toString());
    }
    if (filter.excludes) {
      searchParams.set('excludes', filter.excludes.toString());
    }
    router.push(`${location.pathname}?${searchParams.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuery(search);
  }

  useEffect(() => {
    switch (sortBy) {
      case 'newest': updateSearchAndSort(query, 'id', 'desc', filter); break;
      case 'oldest': updateSearchAndSort(query, 'id', 'asc', filter); break;
      case 'most-raised': updateSearchAndSort(query, 'goal_amount', 'desc', filter); break;
      case 'ending-soon': updateSearchAndSort(query, 'end_date', 'asc', filter); break;
    }
  }, [sortBy, query, filter]);

  useEffect(() => {
    if (!search) {
      setQuery('');
    }
  }, [search]);

  return <>
    {/* Hero Section */}
    <section className="flex flex-col-reverse gap-16 items-stretch lg:flex-row w-full lg:py-21 bg-gradient-to-b from-intuipay-lighterblue/20 via-neutral-white to-neutral-white mb-20">
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center md:text-left">
          Fuel Trusted University-Backed Research
        </h1>
        <p className="text-base font-medium text-neutral-darkgray text-black/50">
          All projects on Intuipay are verified academic research initiatives from accredited universities and institutions, ensuring every donation supports real, impactful science.
        </p>
        <div className="flex w-full mt-auto gap-12">
          <form className="flex-grow relative drop-shadow-custom1" onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search"
              className="rounded-full focus:ring-0 focus:border-neutral-mediumgray border border-black/20 text-base bg-neutral-lightgray w-full h-15 ps-6 pe-15"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-action-blue hover:bg-action-blue/90 w-15 h-15 px-5 bg-primary rounded-full absolute right-0 top-0"
            >
              <Search className="h-5 w-5 text-primary-foreground" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <Button
            variant="outline"
            className="flex-none px-9 h-15 text-sm md:text-xl flex items-center rounded-full"
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            Filter
            <SlidersHorizontal className="ml-2 h-4 w-4" />
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
    <div className="flex flex-col items-center gap-6 lg:flex-row sm:justify-between mb-6 md:mb-8">
      <h2 className="text-lg font-medium sm:text-3xl">
        Explore {total} Projects
      </h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4">
            <span className="text-black/50 whitespace-nowrap">Sort by</span>
            <Button variant="outline" className="sm:w-40 h-11 border-neutral-mediumgray text-base rounded-full">
              <ArrowUpDown className="me-2 h-4 w-4" />
              {SortOptions.find((option) => option.value === sortBy)?.label}
              <ChevronDown className="ms-2 h-4 w-4" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="sm:w-40"
          align="end"
        >
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={setSortBy}
          >
            {SortOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                className="h-8 flex items-center ps-8 pe-4 relative"
                value={option.value}
              >
                {sortBy === option.value && <CheckIcon className="h-4 w-4 absolute left-2" />}
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 md:gap-8">
      {data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>

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
          Create project
        </Button>
      </section>
    </div>
    <FilterDrawer
      isOpen={isFilterDrawerOpen}
      onOpenChange={setIsFilterDrawerOpen}
      filter={filter}
      setFilter={setFilter}
    />
  </>
}
