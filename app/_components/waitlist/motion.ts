// Common motion variants for waitlist sections
export const sectionMotionVariants = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  
  itemVariants: {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }
};

// Common motion props for section containers
export const sectionMotionProps = {
  variants: sectionMotionVariants.containerVariants,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.1 }
};
