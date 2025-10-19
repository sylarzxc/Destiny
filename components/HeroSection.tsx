import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030213] via-[#0a0520] to-[#030213]">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
        
        {/* Planet */}
        <div
          className="absolute top-[10%] right-[5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle at 30% 30%, #9333ea, #4c1d95, #1e1b4b)",
            boxShadow: "0 0 100px rgba(147, 51, 234, 0.3)",
          }}
        >
          {/* Planet rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[40%]">
            <div className="absolute inset-0 border-t-4 border-b-4 border-cyan-400/30 rounded-full transform -rotate-12"></div>
          </div>
        </div>

        {/* Light streams */}
        <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-transparent blur-3xl transform rotate-45"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-purple-600/20 to-transparent blur-2xl transform -rotate-12"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Stake and earn
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
              Earn rewards by staking your assets with Destiny. Our next-Rb generation DeFi platform helps you grow your portfolio while retaining full control of your funds.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50">
              Get started
            </Button>
          </motion.div>

          {/* Right Content - Investment Space */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                THE INVESTMENT SPACE
              </h2>
              <p className="text-gray-400 text-sm tracking-widest">invest • earn • enjoy</p>
              <div className="mt-8">
                <div className="text-5xl md:text-6xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  $2,450,103
                </div>
                <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">Total Value Locked</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
