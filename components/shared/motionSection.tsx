'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type MotionType = 'fade' | 'slide-up' | 'slide-left' | 'zoom' | 'flip' | 'none';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variantType?: MotionType;
};

const variantsMap: Record<Exclude<MotionType, 'none'>, any> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-up': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  flip: {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
  },
};

export default function MotionSection({
  children,
  className,
  delay = 0,
  duration = 0.5,
  variantType = 'slide-up',
}: Props) {
  if (variantType === 'none') return <>{children}</>;

  const variants = variantsMap[variantType];

  return (
    <motion.div
      className={className}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
