import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { AnimatedValue } from "./AnimatedValue";

export function HeroSectionV2() {
  return (
    <section className="relative min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#030213] to-[#0D0D1A]"></div>
      
      {/* Cosmic Background Image - Larger planet */}
      <div className="absolute inset-0 opacity-70" style={{
        backgroundImage: `url('/assets/cosmic-bg.png')`,
        backgroundSize: '120%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}></div>
      
      {/* Static Background - No gyro effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030213]/30 via-[#0a0520]/20 to-[#030213]/30">
        {/* Static stars - no animation */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 items-start md:items-center min-h-0 md:min-h-[80vh]">
          {/* Mobile Layout - Centered Content */}
          <div className="lg:hidden flex flex-col items-center text-center py-8">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl mb-6 font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Stake and earn
              </span>
            </motion.h1>
            
            <div className="mb-12">
              <AnimatedValue 
                value={2450103} 
                prefix="$" 
                delay={800}
                className="mb-3"
              />
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-xs text-gray-400 tracking-widest uppercase"
              >
                Total Value Locked
              </motion.p>
            </div>
          </div>

          {/* Desktop Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block text-left relative z-10"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl lg:text-6xl mb-6 font-bold leading-tight relative z-10"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Stake and earn
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed"
            >
              Earn rewards by staking your assets with Destiny. Our next-generation DeFi platform helps you grow your portfolio while retaining full control of your funds.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-5 text-lg rounded-xl shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_35px_rgba(230,126,34,0.4)] relative overflow-hidden group">
                <span className="relative z-10">Get started</span>
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Shine effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Desktop Right Content - Investment Space */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex flex-col justify-end items-end h-full z-10"
          >
            <div className="text-right mb-8">
              <div className="mt-6">
                <AnimatedValue 
                  value={2450103} 
                  prefix="$" 
                  delay={800}
                  className="mb-3"
                />
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-sm text-gray-400 tracking-widest uppercase"
                >
                  Total Value Locked
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Smooth transition gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#030213]/30 to-[#030213] pointer-events-none"></div>
    </section>
  );
}
