'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/ssr'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Profile } from '@/types'
import { AvatarUpload } from '@/components/ui/avatar-upload'

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile
  onProfileUpdate?: () => void
}

export function EditProfileDialog({ open, onOpenChange, profile, onProfileUpdate }: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    location: profile.location || '',
    timeZone: profile.timezone || '',
    bio: profile.bio || '',
    website: '',
    number: profile.number || '',
    displayImage: profile.display_image || '',
    socialLinks: (() => {
      try {
        return profile.social_links ? JSON.parse(profile.social_links) : {}
      } catch {
        return {}
      }
    })(),
    privacyOnly: false,
  })
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialLinkChange = (platform: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url
      }
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          location: formData.location,
          timezone: formData.timeZone,
          bio: formData.bio,
          number: formData.number,
          display_image: formData.displayImage,
          social_links: JSON.stringify(formData.socialLinks),
        }),
      })

      const result = await response.json() as { code: number; message?: string; data?: any }

      if (!response.ok || result.code !== 0) {
        throw new Error(result.message || 'Failed to update profile')
      }

      console.log('Profile updated successfully:', result)
      onOpenChange(false)
      
      // 调用回调函数刷新页面数据
      if (onProfileUpdate) {
        onProfileUpdate()
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
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
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {/* Profile Image */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-500">Profile image</label>
            <div className="relative">
              <AvatarUpload
                value={formData.displayImage}
                isUploading={isUploadingAvatar}
                setIsUploading={setIsUploadingAvatar}
                size={80}
                onUploaded={(url) => {
                  setFormData(prev => ({ ...prev, displayImage: url }))
                }}
                placeholder={
                  <span className="text-white text-xl font-semibold">
                    {formData.firstName?.[0] || ''}{formData.lastName?.[0] || ''}
                  </span>
                }
              />
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white text-[10px]">上传中...</div>
              )}
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

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500">Social Media Links</h3>
            
            {/* Twitter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-blue-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Twitter</span>
              </div>
              <div className="w-[420px]">
                <input
                  type="text"
                  value={formData.socialLinks.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-blue-600">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Facebook</span>
              </div>
              <div className="w-[420px]">
                <input
                  type="text"
                  value={formData.socialLinks.facebook || ''}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-blue-700">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">LinkedIn</span>
              </div>
              <div className="w-[420px]">
                <input
                  type="text"
                  value={formData.socialLinks.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
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
            disabled={isLoading}
            className="px-8 py-2 bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
