'use client';

import { motion } from 'framer-motion';
import { sectionMotionVariants, sectionMotionProps } from './motion';
import { AnimatedIncrCounter } from '@/components/animated-incr-counter';

export default function ImpactSection() {
  const { itemVariants } = sectionMotionVariants;

  return (
    <section className="py-12 md:py-16 px-8 max-w-7xl mx-auto">
      <motion.div
        className="flex flex-col items-center gap-8 md:gap-24"
        {...sectionMotionProps}
      >
        <motion.div
          className="flex flex-col items-center gap-6 md:gap-8 w-full"
          variants={itemVariants}
        >
          <div className="text-black text-6xl font-medium font-neue-montreal capitalize text-center">
            Creating Exceptional Impact
          </div>
          <div className="text-black/50 text-sm md:text-base font-normal text-center leading-normal">
            Our mission is to help you reach your mission. Crypto, Stock, and Legacy Giving - now in one enterprise-ready donation platform. Sign up today and raise more money to impact more lives.
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row gap-8 w-full"
          variants={itemVariants}
        >
          <motion.div
            className="flex-1 bg-neutral-100 rounded-[32px] p-6 md:p-12"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="text-black text-6xl font-medium font-neue-montreal capitalize">
                <AnimatedIncrCounter
                  end={70}
                  suffix="%"
                  duration={2000}
                />
              </div>
              <div className="text-black/50 text-sm md:text-base font-normal leading-normal">
                of Forbes' top 100 charities accept crypto donations
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 bg-neutral-100 rounded-[32px] p-6 md:p-12"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="text-black text-6xl font-medium font-neue-montreal capitalize">
                <AnimatedIncrCounter
                  end={600}
                  suffix="Mn"
                  duration={2200}
                />
              </div>
              <div className="text-black/50 text-sm md:text-base font-normal leading-normal">
                crypto users worldwide
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 bg-neutral-100 rounded-[32px] p-6 md:p-12"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="text-black text-6xl font-medium font-neue-montreal capitalize">
                <AnimatedIncrCounter
                  end={2}
                  prefix="$"
                  suffix=".5B"
                  duration={500}
                />
              </div>
              <div className="text-black/50 text-sm md:text-base font-normal leading-normal">
                crypto giving expected in 2025 with growing trends
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
