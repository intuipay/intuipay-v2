'use client';

import { motion } from 'framer-motion';
import { sectionMotionVariants, sectionMotionProps } from './motion';

export default function TestimonialSection() {
  const { itemVariants } = sectionMotionVariants;

  return (
    <section className="py-12 md:py-16 px-8 xl:px-0 max-w-7xl mx-auto">
      <motion.div
        className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-start"
        {...sectionMotionProps}
      >
        <motion.div
          className="flex-1 text-black text-6xl font-medium font-neue-montreal capitalize leading-normal"
          variants={itemVariants}
        >
          Testimonial
        </motion.div>
        <motion.div
          className="flex-1 flex flex-col gap-12 lg:gap-24 items-start justify-center"
          variants={itemVariants}
        >
          {/* First Testimonial */}
          <motion.div
            className="flex flex-col gap-4 lg:gap-8 w-full"
            variants={itemVariants}
          >
            <div className="text-black/70 text-sm lg:text-base font-normal leading-normal w-full">
              "Intuipay has been great. The website is easy to navigate and almost everything is automated. Whenever we have a question, the team is always quick to get back to us. We can incorporate Intuipay's features into our website and customize it to our brand standards."
            </div>
            <div className="text-black/70 text-lg lg:text-xl font-semibold leading-normal w-full">
              Name / logo
            </div>
          </motion.div>

          {/* Second Testimonial */}
          <motion.div
            className="flex flex-col gap-4 lg:gap-8 w-full"
            variants={itemVariants}
          >
            <div className="text-black/70 text-sm lg:text-base font-normal leading-normal w-full">
              "Intuipay has been great. The website is easy to navigate and almost everything is automated. Whenever we have a question, the team is always quick to get back to us. We can incorporate Engiven's features into our website and customize it to our brand standards."
            </div>
            <div className="text-black/70 text-lg lg:text-xl font-semibold leading-normal w-full">
              Name / logo
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
