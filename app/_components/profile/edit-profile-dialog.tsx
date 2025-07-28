'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/ssr'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    firstName: 'Zoe',
    lastName: 'Zhang',
    location: 'Shanghai, China',
    timeZone: '(GMT-10:00) Hawaii',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    website: '',
    privacyOnly: true,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [ field ]: value
    }))
  }

  const handleSave = () => {
    // TODO: 实现保存逻辑
    console.log('Saving profile data:', formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Basic info
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-500">
              Profile image
            </label>
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">Z</span>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-semibold text-gray-500">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-semibold text-gray-500">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-semibold text-gray-500">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon size={16} className="text-gray-400" />
              </div>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Time Zone */}
          <div className="space-y-2">
            <label htmlFor="timeZone" className="text-sm font-semibold text-gray-500">
              Time Zone
            </label>
            <select
              id="timeZone"
              value={formData.timeZone}
              onChange={(e) => handleInputChange('timeZone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="(GMT-10:00) Hawaii">(GMT-10:00) Hawaii</option>
              <option value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</option>
              <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
              <option value="(GMT+08:00) China Standard Time">(GMT+08:00) China Standard Time</option>
            </select>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-500">
              Privacy
            </label>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy-only"
                checked={formData.privacyOnly}
                onChange={(e) => handleInputChange('privacyOnly', e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 bg-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="privacy-only"
                  className="text-sm font-semibold text-gray-900 cursor-pointer"
                >
                  Only show my name and avatar
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Uncheck this box to also show your biography, social medias, and projects you've backed.
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-semibold text-gray-500">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Website */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-gray-600">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.032 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Website</span>
              </div>
              <div className="w-[420px]">
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-blue-400 hover:bg-blue-500 text-white font-medium text-sm rounded-full transition-colors"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
