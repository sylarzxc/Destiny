import { motion } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";

interface AnimatedValueProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
}

export function AnimatedValue({ 
  value, 
  prefix = "$", 
  suffix = "", 
  className = "",
  delay = 0 
}: AnimatedValueProps) {
  const { count, isAnimating } = useCountUp({ 
    end: value, 
    duration: 2500, 
    delay 
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl scale-110"></div>
      
      {/* Main text */}
      <motion.div
        animate={isAnimating ? { 
          textShadow: [
            "0 0 20px rgba(34, 211, 238, 0.5)",
            "0 0 40px rgba(59, 130, 246, 0.8)",
            "0 0 20px rgba(34, 211, 238, 0.5)"
          ]
        } : {}}
        transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
        className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent"
      >
        {prefix}{formatNumber(count)}{suffix}
      </motion.div>
      
      {/* Animated particles */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{ 
                x: "50%", 
                y: "50%", 
                opacity: 0 
              }}
              animate={{ 
                x: `${50 + (Math.random() - 0.5) * 200}%`, 
                y: `${50 + (Math.random() - 0.5) * 200}%`, 
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
