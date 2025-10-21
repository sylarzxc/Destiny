import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Shield, Zap, TrendingUp, Users, Star, ArrowRight, CheckCircle } from 'lucide-react'

export function HomePage() {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLoginClick = () => {
    setIsMobileMenuOpen(false)
    navigate('/login')
  }

  const handleRegisterClick = () => {
    setIsMobileMenuOpen(false)
    navigate('/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Background Animation */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            linear-gradient(45deg, 
              #0f172a 0%, 
              #1e293b 25%, 
              #0f172a 50%, 
              #1e293b 75%, 
              #0f172a 100%
            )
          `,
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease-in-out infinite'
        }}
      ></div>
      
      {/* Additional overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40"></div>

      {/* Header */}
      <header className="relative z-10 fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile: Centered Logo */}
            <div className="md:hidden flex-1 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
                <span className="text-xl font-bold text-white tracking-wider">DESTINY</span>
              </div>
            </div>

            {/* Desktop: Left Logo */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
              <span className="text-xl font-bold text-white tracking-wider">DESTINY</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={handleLoginClick}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={handleRegisterClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Registration
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              The Future of Crypto Staking
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Earn up to 20% APY on your cryptocurrency with our secure, flexible staking platform. 
              Start with $2000 demo balance and experience professional-grade trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={handleRegisterClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg flex items-center justify-center gap-2"
              >
                Start Earning Now
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={handleLoginClick}
                className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-lg"
              >
                Sign In
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">20%</div>
                <div className="text-gray-400">Max APY</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">5</div>
                <div className="text-gray-400">Cryptocurrencies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">$2000</div>
                <div className="text-gray-400">Demo Balance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Destiny?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional-grade staking platform with enterprise security and real-time analytics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Bank-Grade Security</h3>
              <p className="text-gray-300 mb-6">
                Your funds are protected with enterprise-level security, multi-signature wallets, and 24/7 monitoring.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  SSL Encryption
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Cold Storage
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Insurance Coverage
                </li>
              </ul>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Flexible Staking</h3>
              <p className="text-gray-300 mb-6">
                Choose from flexible daily staking or locked terms with higher yields. Withdraw anytime with flexible plans.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Daily Compounding
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  No Lock Period
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Instant Withdrawals
                </li>
              </ul>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Analytics</h3>
              <p className="text-gray-300 mb-6">
                Track your portfolio performance with live charts, yield calculations, and detailed transaction history.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Live Portfolio Value
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Yield Tracking
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Performance Charts
                </li>
              </ul>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-green-400/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Referral Rewards</h3>
              <p className="text-gray-300 mb-6">
                Earn bonuses by referring friends. Get $200 USDT bonus for each successful referral who joins the platform.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  $200 Referral Bonus
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Unique Referral Code
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Instant Rewards
                </li>
              </ul>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Star size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Multi-Currency</h3>
              <p className="text-gray-300 mb-6">
                Stake multiple cryptocurrencies including ETH, BTC, USDT, BNB, and MATIC with competitive APY rates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  ETH, BTC, USDT
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  BNB, MATIC
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Competitive Rates
                </li>
              </ul>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-indigo-400/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Demo Mode</h3>
              <p className="text-gray-300 mb-6">
                Start with $2000 demo balance to test all features risk-free. No real money required to get started.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  $2000 Demo Balance
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Risk-Free Testing
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Full Platform Access
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Staking Plans Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Staking Plans & APY
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the perfect staking plan for your investment strategy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Flexible Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-8 text-center hover:border-green-400/50 transition-all duration-300"
            >
              <div className="text-4xl font-bold text-green-400 mb-2">20%</div>
              <div className="text-xl font-semibold text-white mb-2">Flexible Daily</div>
              <div className="text-gray-300 mb-6">Withdraw anytime</div>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Daily compounding
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  No lock period
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-green-400" />
                  Instant withdrawals
                </li>
              </ul>
              <button 
                onClick={handleRegisterClick}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                Start Staking
              </button>
            </motion.div>

            {/* 30 Days */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-8 text-center hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">5%</div>
              <div className="text-xl font-semibold text-white mb-2">Locked 30 Days</div>
              <div className="text-gray-300 mb-6">30-day lock period</div>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-blue-400" />
                  Fixed term
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-blue-400" />
                  Guaranteed returns
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-blue-400" />
                  Auto-compound
                </li>
              </ul>
              <button 
                onClick={handleRegisterClick}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
              >
                Start Staking
              </button>
            </motion.div>

            {/* 90 Days */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 text-center hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">12%</div>
              <div className="text-xl font-semibold text-white mb-2">Locked 90 Days</div>
              <div className="text-gray-300 mb-6">90-day lock period</div>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-purple-400" />
                  Higher returns
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-purple-400" />
                  Quarterly payout
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-purple-400" />
                  Priority support
                </li>
              </ul>
              <button 
                onClick={handleRegisterClick}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Start Staking
              </button>
            </motion.div>

            {/* 180 Days */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-8 text-center hover:border-orange-400/50 transition-all duration-300"
            >
              <div className="text-4xl font-bold text-orange-400 mb-2">20%</div>
              <div className="text-xl font-semibold text-white mb-2">Locked 180 Days</div>
              <div className="text-gray-300 mb-6">180-day lock period</div>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-orange-400" />
                  Maximum returns
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-orange-400" />
                  VIP benefits
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-orange-400" />
                  Premium support
                </li>
              </ul>
              <button 
                onClick={handleRegisterClick}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300"
              >
                Start Staking
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied users earning passive income with Destiny
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "Destiny has been a game-changer for my crypto portfolio. The 20% APY on flexible staking is incredible, and I love being able to withdraw anytime."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div>
                  <div className="text-white font-semibold">John Smith</div>
                  <div className="text-gray-400 text-sm">Crypto Investor</div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "The referral system is amazing! I've earned over $2000 in bonuses just by sharing my referral code with friends. The platform is so easy to use."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MJ</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Maria Johnson</div>
                  <div className="text-gray-400 text-sm">Referral Master</div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "The security and user interface are top-notch. I feel confident staking my crypto here, and the real-time analytics help me track my earnings perfectly."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">DW</span>
                </div>
                <div>
                  <div className="text-white font-semibold">David Wilson</div>
                  <div className="text-gray-400 text-sm">Security Expert</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users earning passive income with our secure staking platform. 
              Start with $2000 demo balance - no risk, all reward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleRegisterClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={handleLoginClick}
                className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-lg"
              >
                Sign In
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              No credit card required • Start earning immediately • 24/7 support
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}

// Mobile Menu Component
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onLoginClick: () => void
  onRegisterClick: () => void
}

function MobileMenu({ isOpen, onClose, onLoginClick, onRegisterClick }: MobileMenuProps) {
  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="fixed inset-0 z-50"
    >
      {/* Premium Backdrop with animated gradient */}
      <motion.div
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 }
        }}
        className="fixed inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-blue-900/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Full Screen Premium Menu */}
      <motion.div
        variants={{
          open: { x: 0, opacity: 1 },
          closed: { x: "100%", opacity: 0 }
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Premium Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 shadow-lg shadow-blue-500/30"></div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  DESTINY
                </h1>
                <p className="text-sm text-gray-400">Premium Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Premium Navigation */}
          <div className="flex-1 flex flex-col justify-center px-8 py-12">
            <div className="space-y-8">
              {/* Login Button */}
              <motion.button 
                onClick={onLoginClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 p-6 hover:border-blue-400/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-white">Sign In</h3>
                      <p className="text-gray-400 text-sm">Access your account</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                    <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.button>

              {/* Registration Button */}
              <motion.button 
                onClick={onRegisterClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 p-6 hover:border-purple-400/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-white">Create Account</h3>
                      <p className="text-gray-400 text-sm">Join our platform</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-300">
                    <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.button>

              {/* Docs Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 p-6 hover:border-cyan-400/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-white">Documentation</h3>
                      <p className="text-gray-400 text-sm">Learn more about Destiny</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
                    <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="p-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">Experience the future of digital finance</p>
              <div className="flex justify-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
