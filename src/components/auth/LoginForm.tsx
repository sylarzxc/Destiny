import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { motion } from 'framer-motion'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
  onSwitchToReset?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister, onSwitchToReset }: LoginFormProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Load saved email on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('destiny_saved_email')
    const savedRememberMe = localStorage.getItem('destiny_remember_me') === 'true'
    
    if (savedEmail) {
      setEmail(savedEmail)
    }
    if (savedRememberMe) {
      setRememberMe(true)
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    return emailRegex.test(email)
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!password) {
      setError('Password is required')
      setLoading(false)
      return
    }

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message || 'Login failed')
      // Shake animation for error
      const form = document.querySelector('.auth-form')
      if (form) {
        form.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(6px)' },
          { transform: 'translateX(0)' }
        ], { duration: 300, iterations: 1 })
      }
    } else {
      // Save user data if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('destiny_saved_email', email)
        localStorage.setItem('destiny_remember_me', 'true')
      } else {
        // Still save email for convenience, but don't set remember me
        localStorage.setItem('destiny_saved_email', email)
        localStorage.removeItem('destiny_remember_me')
      }
      
      onSuccess?.()
    }

    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="auth-form w-full max-w-md mx-auto"
    >
      <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl shadow-blue-900/20">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl animate-pulse"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">D</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-400">Sign in to your Destiny account</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="Enter your email"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  emailError ? 'border-red-500 ring-2 ring-red-500/20' : ''
                }`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
            {emailError && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {emailError}
              </motion.p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Remember Me checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-slate-300 text-sm">Remember me</span>
            </label>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </div>
              )}
            </Button>
          </motion.div>
        </form>

        <div className="mt-8 text-center space-y-4">
          <button
            onClick={onSwitchToReset}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center justify-center gap-1 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Forgot your password?
          </button>
          
          <div className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  )
}
