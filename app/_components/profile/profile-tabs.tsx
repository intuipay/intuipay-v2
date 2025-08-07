'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AboutTab from './about-tab';
import BackedTab from './backed-tab';
import RaisedTab from './raised-tab';
import { CoinVerticalIcon, ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import { Profile, ProjectInfo } from '@/types';

interface ProfileTabsProps {
  profile: Profile;
  myBacked?: ProjectInfo[];
  myProjects?: ProjectInfo[];
}

export default function ProfileTabs({ profile, myBacked, myProjects }: ProfileTabsProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="about" className="w-full">
        {/* Tab List with Creator Dashboard Link */}
        <div className="flex items-center justify-between mb-12">
          <TabsList className="bg-transparent p-0 h-auto gap-5">
            <TabsTrigger
              value="about"
              className="px-6 py-3 font-semibold text-sm leading-5 border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-[#2461f2] data-[state=active]:border-[#2461f2] data-[state=active]:shadow-none hover:text-[#2461f2] rounded-none"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="backed"
              className="px-6 py-3 font-medium text-sm leading-5 border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-[#2461f2] data-[state=active]:border-[#2461f2] data-[state=active]:shadow-none hover:text-[#2461f2] rounded-none"
            >
              Backed
            </TabsTrigger>
            <TabsTrigger
              value="raised"
              className="px-6 py-3 font-medium text-sm leading-5 border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-[#2461f2] data-[state=active]:border-[#2461f2] data-[state=active]:shadow-none hover:text-[#2461f2] rounded-none"
            >
              Raised
            </TabsTrigger>
          </TabsList>

          {/* Creator Dashboard Link */}
          <div className="flex items-center gap-4 px-3 py-2">
            <div className="flex items-center gap-2">
              <CoinVerticalIcon size={20} className="text-blue-600" />
              <span className="font-medium text-sm leading-5 text-blue-600">
                Creator Dashboard
              </span>
            </div>
            <ArrowUpRightIcon size={20} className="text-blue-600" />
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="about" className="mt-0">
          <AboutTab profile={profile} />
        </TabsContent>
        <TabsContent value="backed" className="mt-0">
          <BackedTab projects={myBacked} />
        </TabsContent>
        <TabsContent value="raised" className="mt-0">
          <RaisedTab projects={myProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

