import { Profile } from '@/types'
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
      <div className="bg-white box-border flex flex-col gap-8 items-start justify-start p-6 relative rounded-lg border border-black/10">
        <div className="box-border flex items-center justify-start p-0 relative shrink-0 w-full">
          <div className="font-semibold relative shrink-0 text-black text-[20px] leading-6">
            Basic info
          </div>
        </div>
        <div className="box-border flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="box-border flex flex-col font-semibold gap-2 items-start justify-start p-0 relative shrink-0 text-[14px] w-full">
            <div className="relative shrink-0 text-black/50 w-full">
              <p className="block leading-5">Location</p>
            </div>
            <div className="relative shrink-0 text-black w-full">
              <p className="block leading-5">{profile.location || 'Not specified'}</p>
            </div>
          </div>
          <div className="box-border flex flex-col font-semibold gap-2 items-start justify-start p-0 relative shrink-0 text-[14px] w-full">
            <div className="relative shrink-0 text-black/50 w-full">
              <p className="block leading-5">Time Zone</p>
            </div>
            <div className="relative shrink-0 text-black w-full">
              <p className="block leading-5">{profile.timezone || '(GMT-10:00) Hawaii'}</p>
            </div>
          </div>
          <div className="box-border flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="font-semibold relative shrink-0 text-[14px] text-black/50">
              <p className="block leading-5">Privacy</p>
            </div>
            <div className="box-border flex gap-3 items-center justify-start p-0 relative shrink-0">
              <div className="font-semibold relative shrink-0 text-black text-[14px]">
                <p className="block leading-5">{profile.privacy_level && Number(profile.privacy_level) === 1 ? 'Only show my name and avatar' : 'Show all my profile info'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white box-border flex flex-col gap-8 items-start justify-start p-6 relative rounded-lg border border-black/10">
        <div className="box-border flex items-center justify-start p-0 relative shrink-0 w-full">
          <div className="font-semibold relative shrink-0 text-black text-[20px] leading-6">
            Detailed info
          </div>
        </div>
        <div className="box-border flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="box-border flex flex-col font-semibold gap-2 items-start justify-start p-0 relative shrink-0 text-[14px] w-full">
            <div className="relative shrink-0 text-black/50 w-full">
              <p className="block leading-5">Bio</p>
            </div>
            <div className="relative shrink-0 text-black w-full">
              <p className="block leading-5">{profile.bio || 'No bio available'}</p>
            </div>
          </div>
          <div className="box-border flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="font-semibold relative shrink-0 text-[14px] text-black/50">
              <p className="block leading-5">Social Media</p>
            </div>
            <div className="box-border flex gap-3 items-center justify-start p-0 relative shrink-0">
              <div className="flex items-center gap-2">
                {SocialMedias
                  .sort((a, b) => {
                    const keyA = a.label.toLowerCase()
                    const keyB = b.label.toLowerCase()
                    const urlA = socialLinks[ keyA ]
                    const urlB = socialLinks[ keyB ]

                    // 有链接的排在前面，没有链接的排在后面
                    if (urlA && !urlB) return -1
                    if (!urlA && urlB) return 1
                    return 0
                  })
                  .map(sm => {
                    const key = sm.label.toLowerCase()
                    const url = socialLinks[ key ]
                    const Icon = sm.icon as any

                    if (url) {
                      return (
                        <a
                          key={sm.label}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black hover:text-blue-600 transition-colors"
                          title={sm.label}
                          aria-label={`Visit ${sm.label} profile`}
                        >
                          <Icon size={20} weight="fill" />
                        </a>
                      )
                    }
                    return (
                      <div
                        key={sm.label}
                        className="text-black/20 cursor-not-allowed"
                        title={`${sm.label} not connected`}
                      >
                        <Icon size={20} weight="regular" />
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
