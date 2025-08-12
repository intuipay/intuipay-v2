'use client'

import { useState } from 'react'
import RichTextEditor from '@/components/rich-text-editor'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/ssr'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Profile } from '@/types'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { SocialMedias } from '@/data/social-medias'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile
  onProfileUpdate?: () => void
}

const socialLinksSchema = z.object({
  website: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  discord: z.string().optional(),
  telegram: z.string().optional(),
  instagram: z.string().optional(),
  reddit: z.string().optional(),
  youtube: z.string().optional(),
})

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  location: z.string().optional(),
  timeZone: z.string().optional(),
  bio: z.string().optional(),
  number: z.string().optional(),
  displayImage: z.string().optional(),
  privacyOnly: z.boolean().optional(),
  socialLinks: socialLinksSchema,
})

type ProfileFormValues = z.infer<typeof formSchema>

export function EditProfileDialog({ open, onOpenChange, profile, onProfileUpdate }: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const parsedLinks = (() => {
    try { return profile.social_links ? JSON.parse(profile.social_links) : {} } catch { return {} }
  })()

  const defaultValues: ProfileFormValues = {
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    location: profile.location || '',
    timeZone: profile.timezone || '',
    bio: profile.bio || '',
    number: profile.number || '',
    displayImage: profile.display_image || '',
    privacyOnly: false,
    socialLinks: {
      website: parsedLinks.website || '',
      facebook: parsedLinks.facebook || '',
      twitter: parsedLinks.twitter || '',
      linkedin: parsedLinks.linkedin || '',
      github: parsedLinks.github || '',
      discord: parsedLinks.discord || '',
      telegram: parsedLinks.telegram || '',
      instagram: parsedLinks.instagram || '',
      reddit: parsedLinks.reddit || '',
      youtube: parsedLinks.youtube || '',
    },
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const firstName = form.watch('firstName') || ''
  const lastName = form.watch('lastName') || ''
  const displayImageVal = form.watch('displayImage') || ''

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: values.firstName,
            last_name: values.lastName,
            location: values.location,
            timezone: values.timeZone,
            bio: values.bio,
            number: values.number,
            display_image: values.displayImage,
            social_links: JSON.stringify(values.socialLinks),
        }),
      })
      const result = await response.json() as { code: number; message?: string; data?: any }
      if (!response.ok || result.code !== 0) {
        throw new Error(result.message || 'Failed to update profile')
      }
      onOpenChange(false)
      if (onProfileUpdate) onProfileUpdate()
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                value={displayImageVal}
                isUploading={isUploadingAvatar}
                setIsUploading={setIsUploadingAvatar}
                size={80}
                onUploaded={(url) => {
                  form.setValue('displayImage', url, { shouldDirty: true })
                }}
                placeholder={
                  <span className="text-white text-xl font-semibold">
                    {firstName?.[ 0 ] || ''}{lastName?.[ 0 ] || ''}
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
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-500">First Name</FormLabel>
                  <FormControl>
                    <Input {...field} hasRing className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-500">Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} hasRing className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-500">Location</FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon size={16} className="text-gray-400 ml-4" />
                  </div>
                  <FormControl>
                    <Input {...field} hasRing className="w-full pl-12" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Zone */}
          <FormField
            control={form.control}
            name="timeZone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-500">Time Zone</FormLabel>
                <FormControl>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    {...field}
                  >
                    <option value="(GMT-12:00) International Date Line West">(GMT-12:00) International Date Line West</option>
                    <option value="(GMT-11:00) Midway Island, Samoa">(GMT-11:00) Midway Island, Samoa</option>
                    <option value="(GMT-10:00) Hawaii">(GMT-10:00) Hawaii</option>
                    <option value="(GMT-09:00) Alaska">(GMT-09:00) Alaska</option>
                    <option value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</option>
                    <option value="(GMT-07:00) Mountain Time">(GMT-07:00) Mountain Time</option>
                    <option value="(GMT-06:00) Central Time">(GMT-06:00) Central Time</option>
                    <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                    <option value="(GMT-04:00) Atlantic Time">(GMT-04:00) Atlantic Time</option>
                    <option value="(GMT-03:00) Brazil, Argentina">(GMT-03:00) Brazil, Argentina</option>
                    <option value="(GMT-02:00) Mid-Atlantic">(GMT-02:00) Mid-Atlantic</option>
                    <option value="(GMT-01:00) Azores">(GMT-01:00) Azores</option>
                    <option value="(GMT+00:00) Greenwich Mean Time">(GMT+00:00) Greenwich Mean Time</option>
                    <option value="(GMT+01:00) Central European Time">(GMT+01:00) Central European Time</option>
                    <option value="(GMT+02:00) Eastern European Time">(GMT+02:00) Eastern European Time</option>
                    <option value="(GMT+03:00) Moscow Time">(GMT+03:00) Moscow Time</option>
                    <option value="(GMT+04:00) Gulf Standard Time">(GMT+04:00) Gulf Standard Time</option>
                    <option value="(GMT+05:00) Pakistan Standard Time">(GMT+05:00) Pakistan Standard Time</option>
                    <option value="(GMT+05:30) India Standard Time">(GMT+05:30) India Standard Time</option>
                    <option value="(GMT+06:00) Bangladesh Standard Time">(GMT+06:00) Bangladesh Standard Time</option>
                    <option value="(GMT+07:00) Thailand, Vietnam">(GMT+07:00) Thailand, Vietnam</option>
                    <option value="(GMT+08:00) China Standard Time">(GMT+08:00) China Standard Time</option>
                    <option value="(GMT+09:00) Japan Standard Time">(GMT+09:00) Japan Standard Time</option>
                    <option value="(GMT+09:30) Australian Central Standard Time">(GMT+09:30) Australian Central Standard Time</option>
                    <option value="(GMT+10:00) Australian Eastern Standard Time">(GMT+10:00) Australian Eastern Standard Time</option>
                    <option value="(GMT+11:00) Solomon Islands">(GMT+11:00) Solomon Islands</option>
                    <option value="(GMT+12:00) New Zealand Standard Time">(GMT+12:00) New Zealand Standard Time</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Privacy */}
          <FormField
            control={form.control}
            name="privacyOnly"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-gray-500">Privacy</FormLabel>
                <FormControl>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy-only"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio - Rich Text */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-500">Bio</FormLabel>
                <FormControl>
                  <RichTextEditor
                    initialValue={field.value}
                    onChange={field.onChange}
                    height="200px"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Social Media Links */}
          <div className="space-y-4">
            {SocialMedias.map(sm => {
              const key = sm.label.toLowerCase() as keyof ProfileFormValues['socialLinks']
              return (
                <FormField
                  key={sm.label}
                  control={form.control}
                  name={`socialLinks.${key}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4">
                      <FormLabel className="flex items-center gap-2 min-w-28 text-sm font-medium text-gray-900">
                        <sm.icon className="w-5 h-5 text-gray-600" />{sm.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          hasRing
                          placeholder={key === 'website' ? 'https://' : `https://${key}.com/username`}
                          className="w-[420px] text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            })}
          </div>
        </div>
        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isLoading} className="px-8 py-2 rounded-full flex items-center gap-2">
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
