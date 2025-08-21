import { ArrowUpRightIcon, HandHeartIcon, LockIcon, RocketLaunchIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export default function SupportFeatures() {
  return (
    <section className="bg-background-gray py-20">
      <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          <RocketLaunchIcon size={48} />
          <h3 className="text-2xl font-semibold">Getting started</h3>
          <Link
            className="block text-sm font-semibold text-secondary"
            href="#"
          >
            What you need to get started
          </Link>
          <Link
            className="flex items-center py-2 gap-2.5 group"
            href="#"
          >
            <span className="font-semibold leading-normal underline group-hover:no-underline">View all</span>
            <ArrowUpRightIcon size={24} />
          </Link>
        </div>
        <div className="space-y-6">
          <LockIcon size={48} />
          <h3 className="text-2xl font-semibold">Account and login</h3>
          <Link
            className="block text-sm font-semibold text-secondary"
            href="#"
          >
            What you need to get started
          </Link>
          <Link
            className="flex items-center py-2 gap-2.5 group"
            href="#"
          >
            <span className="font-semibold leading-normal underline group-hover:no-underline">View all</span>
            <ArrowUpRightIcon size={24} />
          </Link>
        </div>
        <div className="space-y-6">
          <HandHeartIcon size={48} />
          <h3 className="text-2xl font-semibold">Donation</h3>
          <Link
            className="block text-sm font-semibold text-secondary"
            href="#"
          >
            What you need to get started
          </Link>
          <Link
            className="flex items-center py-2 gap-2.5 group"
            href="#"
          >
            <span className="font-semibold leading-normal underline group-hover:no-underline">View all</span>
            <ArrowUpRightIcon size={24} />
          </Link>
        </div>
      </div>
    </section>
  );
}
