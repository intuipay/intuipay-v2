import { Profile } from '@/types'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { SocialMedias } from '@/data/social-medias'

interface AboutTabProps {
  profile: Profile;
}

export default function AboutTab({ profile }: AboutTabProps) {
  // 解析社交链接
  const socialLinks: Record<string, string> = (() => {
    try { return profile.social_links ? JSON.parse(profile.social_links) : {} } catch { return {} }
  })()

  // 提供一个伪表单上下文（只读展示，用于复用 Form 生态样式，未真正提交）
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardTitle className="mb-6 text-lg sm:text-xl font-semibold">Basic info</CardTitle>
        <CardContent className="p-0">
          <div className="grid gap-6">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">{profile.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Time Zone</p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">{profile.timezone || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Privacy</p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">Only show my name and avatar</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardTitle className="mb-6 text-lg sm:text-xl font-semibold">Detailed info</CardTitle>
        <CardContent className="p-0 space-y-6">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Bio</p>
            <p className="text-sm sm:text-base text-gray-900 leading-relaxed whitespace-pre-line">{profile.bio || 'No bio available'}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Social Media</p>
            <div className="flex flex-wrap gap-3">
              {SocialMedias.map(sm => {
                const key = sm.label.toLowerCase()
                const url = socialLinks[ key ]
                const Icon = sm.icon as any
                const common = 'p-2 transition-colors'
                if (url) {
                  return (
                    <a
                      key={sm.label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={common + ' text-gray-900 hover:text-blue-600'}
                      title={sm.label}
                      aria-label={`Visit ${sm.label} profile`}
                    >
                      <Icon size={20} />
                    </a>
                  )
                }
                return (
                  <div
                    key={sm.label}
                    className={common + ' text-gray-300 cursor-not-allowed'}
                    title={`${sm.label} not connected`}
                  >
                    <Icon size={20} />
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
