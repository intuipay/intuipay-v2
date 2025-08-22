'use client';

import { CodeIcon, CoinsIcon, GlobeIcon, ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import { motion } from 'framer-motion';
import { sectionMotionVariants, sectionMotionProps } from './motion';
import Link from 'next/link'

export default function WidgetSection() {
  const { itemVariants } = sectionMotionVariants;

  return (
    <section className="py-12 md:py-20 lg:py-30 px-8 xl:max-w-6xl 2xl:max-w-8xl 2xl:px-22 mx-auto">
      <motion.div
        className="flex flex-col gap-8 md:gap-16"
        {...sectionMotionProps}
      >
        {/* Main Content Row */}
        <motion.div
          className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center"
          variants={itemVariants}
        >
          {/* Widget Demo - First on mobile, Right on desktop */}
          <motion.div
            className="order-1 lg:order-2 flex-1 bg-lime-50 rounded-[32px] flex items-center justify-center py-32 px-4 lg:px-8"
            variants={itemVariants}
          >
            <div className="w-full h-80 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden">
              <video
                src="/images/mockup_light.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* Text Content - Second on mobile, Left on desktop */}
          <motion.div
            className="order-2 lg:order-1 flex-1 flex flex-col justify-between items-start self-stretch gap-8"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="text-blue-600 text-base font-medium font-neue-montreal capitalize tracking-wide">
                Accept Crypto with Ease
              </div>
              <div className="text-black text-3xl md:text-6xl font-medium font-neue-montreal capitalize">
                Plug-and-Play Donation Widget
              </div>
              <div className="text-black/50 text-base font-normal leading-normal">
                Seamlessly embed crypto giving into your website in minutes — no developers required.
              </div>
            </div>

            <Link href="/knowledge" className="flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 border border-black/70 rounded-full w-fit">
              <span className="text-black/70 text-base md:text-xl font-semibold leading-tight md:leading-normal">
                See how it works
              </span>
              <ArrowUpRightIcon size={24} className="text-black/70" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Divider Line */}
        <motion.div
          className="w-full h-px bg-gray-200"
          variants={itemVariants}
        ></motion.div>

        {/* Features Row */}
        <motion.div
          className="flex flex-col md:flex-row gap-8 md:gap-24"
          variants={itemVariants}
        >
          <motion.div
            className="flex-1 flex flex-col gap-4 md:gap-6"
            variants={itemVariants}
          >
            <CodeIcon size={32} className="text-black/70" />
            <div className="text-black/70 text-sm text-base font-normal leading-6">
              Simple HTML iframe embedding set-up
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex flex-col gap-4 md:gap-6"
            variants={itemVariants}
          >
            <CoinsIcon size={32} className="text-black/70" />
            <div className="text-black/70 text-sm text-base font-normal leading-6">
              30+ cryptocurrencies accepted
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex flex-col gap-4 md:gap-6"
            variants={itemVariants}
          >
            <GlobeIcon size={32} className="text-black/70" />
            <div className="text-black/70 text-sm text-base font-normal leading-6">
              Automatic conversion to local fiat currencies
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
