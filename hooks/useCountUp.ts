import { useState, useEffect } from 'react';

interface UseCountUpProps {
  end: number;
  duration?: number;
  start?: number;
  delay?: number;
}

export const useCountUp = ({ end, duration = 2000, start = 0, delay = 0 }: UseCountUpProps) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      const startTime = Date.now();
      
      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentCount = start + (end - start) * easeOutCubic;
        
        setCount(Math.floor(currentCount));
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(updateCount);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, start, delay]);

  return { count, isAnimating };
};
