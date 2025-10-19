import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedListItemProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  delay?: number;
}

export function AnimatedListItem({ 
  children, 
  index = 0, 
  className = "",
  delay = 0 
}: AnimatedListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay: delay + (index * 0.1),
        ease: "easeOut"
      }}
      layout
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
}

export function AnimatedList({ children, className = "" }: AnimatedListProps) {
  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {children.map((child, index) => (
          <AnimatedListItem key={index} index={index}>
            {child}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface PulseAnimationProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function PulseAnimation({ 
  children, 
  isActive = false, 
  className = "" 
}: PulseAnimationProps) {
  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0 0 rgba(59, 130, 246, 0)",
          "0 0 0 10px rgba(59, 130, 246, 0.1)",
          "0 0 0 0 rgba(59, 130, 246, 0)"
        ]
      } : {}}
      transition={{ 
        duration: 1.5, 
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ShakeAnimationProps {
  children: React.ReactNode;
  shouldShake?: boolean;
  className?: string;
}

export function ShakeAnimation({ 
  children, 
  shouldShake = false, 
  className = "" 
}: ShakeAnimationProps) {
  return (
    <motion.div
      animate={shouldShake ? {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FadeInAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeInAnimation({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = "" 
}: FadeInAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SlideInAnimationProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideInAnimation({ 
  children, 
  direction = 'left',
  delay = 0, 
  duration = 0.5,
  className = "" 
}: SlideInAnimationProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: -100, y: 0 };
      case 'right':
        return { x: 100, y: 0 };
      case 'up':
        return { x: 0, y: -100 };
      case 'down':
        return { x: 0, y: 100 };
      default:
        return { x: -100, y: 0 };
    }
  };

  return (
    <motion.div
      initial={{ ...getInitialPosition(), opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
