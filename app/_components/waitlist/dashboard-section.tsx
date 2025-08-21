'use client';

import Link from 'next/link'
import { MoneyIcon, ReceiptIcon, FilesIcon, ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import { AnimatedCounter } from '@/components/animated-counter';
import { motion } from 'framer-motion';
import { sectionMotionVariants, sectionMotionProps } from './motion';
import { Href } from '@react-types/shared';

export default function DashboardSection() {
  const { itemVariants } = sectionMotionVariants;

  return (
    <section className="py-12 md:py-20 lg:py-30 px-8 xl:max-w-6xl 2xl:max-w-8xl 2xl:px-22 mx-auto">
      <motion.div
        className="flex flex-col gap-8 md:gap-16"
        {...sectionMotionProps}
      >
        {/* Main Content Row */}
        <motion.div
          className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-center"
          variants={itemVariants}
        >
          {/* Dashboard Demo - First on mobile, Right on desktop */}
          <motion.div
            className="order-1 lg:order-2 flex-1 bg-purple-100 rounded-[32px] flex items-center justify-center pl-4 lg:pl-8 pr-0 py-0"
            variants={itemVariants}
          >
            <div className="w-full flex flex-col gap-4 py-12 lg:py-32 lg:gap-8">
              {/* Main Balance Card */}
              <div className="bg-white rounded-l-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] px-4 lg:px-8 py-3 lg:py-6">
                <div className="w-full flex flex-col gap-2 lg:gap-3">
                  <div className="text-black text-xs lg:text-sm font-semibold leading-5">
                    Balance
                  </div>
                  <div className="text-black text-3xl font-semibold leading-10">
                    <AnimatedCounter
                      end={12345}
                      prefix="$"
                      suffix=".00"
                    />
                  </div>
                  <div className="text-black/60 text-xs lg:text-sm font-semibold leading-5">
                    The next withdraw period: 07/05/2024
                  </div>
                </div>
              </div>

              {/* Stats Cards Row */}
              <div className="flex flex-row gap-4 lg:gap-8">
                {/* Total received card */}
                <div className="flex-1 bg-white rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] p-3 lg:p-6">
                  <div className="flex flex-col gap-2 lg:gap-4">
                    <div className="text-black text-2xl font-semibold leading-loose">
                      <AnimatedCounter
                        end={1234}
                        prefix="$"
                        suffix=".00"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="text-black/70 text-xs lg:text-sm font-semibold leading-5">
                        Total received this month
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processing received card */}
                <div className="flex-1 bg-white rounded-l-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] p-3 lg:p-6">
                  <div className="flex flex-col gap-2 lg:gap-4">
                    <div className="text-black text-2xl font-semibold leading-loose">
                      <AnimatedCounter
                        end={1234}
                        prefix="$"
                        suffix=".00"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="text-black/70 text-xs lg:text-sm font-semibold leading-5">
                        Processing received
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content - Second on mobile, Left on desktop */}
          <motion.div
            className="order-2 lg:order-1 flex-1 flex flex-col justify-between items-start self-stretch"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="text-blue-600 text-base font-medium font-neue-montreal capitalize tracking-wide">
                Control, Track, Report
              </div>
              <div className="text-black text-3xl md:text-6xl font-medium font-neue-montreal capitalize">
                All-in-One Dashboard For Your Crypto Giving
              </div>
              <div className="text-black/50 text-base font-normal leading-normal">
                Manage fundings, compliance, and reporting — all from a single place, designed for institutional needs.
              </div>
            </div>

            <Link
              href={process.env.NEXT_PUBLIC_DASHBOARD_URL as Href}
              className="flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 border border-black/70 rounded-full w-fit"
            >
              <span className="text-black/70 text-base md:text-xl font-semibold leading-tight md:leading-normal">
                Create account
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
            <MoneyIcon size={32} className="text-black/70" />
            <div className="text-black/70 text-sm text-base font-normal leading-6">
              Monitor real-time fundings and currency breakdowns
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex flex-col gap-4 md:gap-6"
            variants={itemVariants}
          >
            <ReceiptIcon size={32} className="text-black/70" />
            <div className="text-black/70 text-sm text-base font-normal leading-6">
              Manage receipts, project listings, and donor data
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex flex-col gap-4 md:gap-6"
            variants={itemVariants}
          >
            <FilesIcon size={32} className="text-black/70" />
            <div className="text-black/70 text-sm text-base font-normal leading-6">
              Download reports for finance and tax teams
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
