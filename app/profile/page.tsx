'use client'

import { SiteHeader } from '@/components/site-header'
import { PencilSimpleIcon } from '@phosphor-icons/react/ssr';
import ProfileTabs from '@/app/_components/profile/profile-tabs';
import { EditProfileDialog } from '@/app/_components/profile/edit-profile-dialog';
import { useState } from 'react';

export default function Page() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 xl:max-w-6xl 2xl:max-w-8xl">
          {/* User Profile Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-blue-600 rounded-full shadow-lg border-4 border-white flex-shrink-0" />

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 truncate">Zoe Zhang</h1>
                <p className="text-sm text-gray-600 mb-2 sm:mb-0">Backed 44 projects · Joined Mar 2010</p>
              </div>

              {/* Edit Button */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setIsEditDialogOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-full transition-colors flex items-center justify-center gap-2 hover:bg-gray-50 border border-gray-200"
                >
                  <span className="text-sm font-medium text-gray-900">Edit</span>
                  <PencilSimpleIcon size={16} className="text-gray-900" />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation with DaisyUI */}
          <ProfileTabs />
        </div>

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      </main>
    </>
  )
}
