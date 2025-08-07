import {
  TwitterLogoIcon,
  FacebookLogoIcon,
  PinterestLogoIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react/ssr';
import { Profile } from '@/types';

interface AboutTabProps {
  profile: Profile;
}

export default function AboutTab({ profile }: AboutTabProps) {
  // Parse social links from JSON string
  let socialLinks: Record<string, string> = {};
  try {
    socialLinks = profile.social_links ? JSON.parse(profile.social_links) : {};
  } catch (error) {
    console.warn('Failed to parse social links:', error);
  }
  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Basic info</h2>
        <dl className="space-y-6">
          <div>
            <dt className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</dt>
            <dd className="text-sm sm:text-base font-semibold text-gray-900">
              {profile.location || 'Not specified'}
            </dd>
          </div>
          <div>
            <dt className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Time Zone</dt>
            <dd className="text-sm sm:text-base font-semibold text-gray-900">
              {profile.timezone || 'Not specified'}
            </dd>
          </div>
          <div>
            <dt className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Privacy</dt>
            <dd className="text-sm sm:text-base font-semibold text-gray-900">Only show my name and avatar</dd>
          </div>
        </dl>
      </div>

      {/* Detailed Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Detailed info</h2>
        <dl className="space-y-6">
          <div>
            <dt className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Bio</dt>
            <dd className="text-sm sm:text-base text-gray-900 leading-relaxed">
              {profile.bio || 'No bio available'}
            </dd>
          </div>
          <div>
            <dt className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Social Media</dt>
            <dd className="flex flex-wrap gap-3">
              {/* Twitter */}
              {socialLinks.twitter ? (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                  title="Twitter"
                  aria-label="Visit Twitter profile"
                >
                  <TwitterLogoIcon size={20} />
                </a>
              ) : (
                <div className="p-2 text-gray-300" title="Twitter not connected">
                  <TwitterLogoIcon size={20} />
                </div>
              )}

              {/* Facebook */}
              {socialLinks.facebook ? (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                  title="Facebook"
                  aria-label="Visit Facebook profile"
                >
                  <FacebookLogoIcon size={20} />
                </a>
              ) : (
                <div className="p-2 text-gray-300" title="Facebook not connected">
                  <FacebookLogoIcon size={20} />
                </div>
              )}

              {/* Pinterest */}
              {socialLinks.pinterest ? (
                <a
                  href={socialLinks.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                  title="Pinterest"
                  aria-label="Visit Pinterest profile"
                >
                  <PinterestLogoIcon size={20} />
                </a>
              ) : (
                <div className="p-2 text-gray-300" title="Pinterest not connected">
                  <PinterestLogoIcon size={20} />
                </div>
              )}

              {/* LinkedIn */}
              {socialLinks.linkedin ? (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                  title="LinkedIn"
                  aria-label="Visit LinkedIn profile"
                >
                  <LinkedinLogoIcon size={20} />
                </a>
              ) : (
                <div className="p-2 text-gray-300" title="LinkedIn not connected">
                  <LinkedinLogoIcon size={20} />
                </div>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
