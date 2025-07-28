import {
  TwitterLogoIcon,
  FacebookLogoIcon,
  PinterestLogoIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react/ssr';

export default function AboutTab() {
  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Basic info</h2>
        <dl className="space-y-6">
          <div>
            <dt className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</dt>
            <dd className="text-sm sm:text-base font-semibold text-gray-900">Shanghai, China</dd>
          </div>
          <div>
            <dt className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Time Zone</dt>
            <dd className="text-sm sm:text-base font-semibold text-gray-900">(GMT-10:00) Hawaii</dd>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </dd>
          </div>
          <div>
            <dt className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Social Media</dt>
            <dd className="flex flex-wrap gap-3">
              {/* Active Social Icons */}
              <a
                href="#"
                className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                title="Twitter"
                aria-label="Visit Twitter profile"
              >
                <TwitterLogoIcon size={20} />
              </a>
              <a
                href="#"
                className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                title="Facebook"
                aria-label="Visit Facebook profile"
              >
                <FacebookLogoIcon size={20} />
              </a>
              <a
                href="#"
                className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                title="Pinterest"
                aria-label="Visit Pinterest profile"
              >
                <PinterestLogoIcon size={20} />
              </a>
              <a
                href="#"
                className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                title="LinkedIn"
                aria-label="Visit LinkedIn profile"
              >
                <LinkedinLogoIcon size={20} />
              </a>

              {/* Inactive/Placeholder Social Icons */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-2 text-gray-300"
                  title="Not connected"
                  aria-label="Social media not connected"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
