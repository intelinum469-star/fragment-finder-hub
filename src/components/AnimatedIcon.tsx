import React from 'react';
import { motion } from 'motion/react';

interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  children, 
  className = '',
  delay = 0,
  yOffset = 20
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.2, 
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      }}
    >
      {children}
    </motion.span>
  );
};
