import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { motion } from 'framer-motion'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Progressive hints state
  const [emailError, setEmailError] = useState('')
  const [displayNameError, setDisplayNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [repeatPasswordError, setRepeatPasswordError] = useState('')

  // Handle referral code from URL params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const refCode = params.get('ref')
      if (refCode) {
        localStorage.setItem('destiny_pending_referral', refCode)
      }
    } catch (err) {
      console.warn('Referral param capture failed', err)
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]{8,64}$/
    return passwordRegex.test(password)
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleDisplayNameBlur = () => {
    if (displayName && displayName.length < 2) {
      setDisplayNameError('Display name must be at least 2 characters')
    } else {
      setDisplayNameError('')
    }
  }

  const handlePasswordBlur = () => {
    if (password && !validatePassword(password)) {
      setPasswordError('Password must contain letters, numbers and be 8-64 characters')
    } else {
      setPasswordError('')
    }
  }

  const handleRepeatPasswordBlur = () => {
    if (repeatPassword && repeatPassword !== password) {
      setRepeatPasswordError('Passwords do not match')
    } else {
      setRepeatPasswordError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate all fields
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (displayName.length < 2) {
      setDisplayNameError('Display name must be at least 2 characters')
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must contain letters, numbers and be 8-64 characters')
      setLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setRepeatPasswordError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await signUp(email, password, displayName)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl shadow-purple-900/20">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-3xl animate-pulse"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">D</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Create</span>{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Account</span>
            </h2>
            <p className="text-slate-400 text-sm">Join Destiny platform today</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  autoComplete="email"
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 ${
                    emailError ? 'border-red-500/50' : 'border-slate-600'
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
                  className="text-red-400 text-xs flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {emailError}
                </motion.p>
              )}
            </div>

            {/* Display Name Field */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Display Name</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Choose a display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onBlur={handleDisplayNameBlur}
                  autoComplete="username"
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 ${
                    displayNameError ? 'border-red-500/50' : 'border-slate-600'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              {displayNameError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {displayNameError}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 ${
                    passwordError ? 'border-red-500/50' : 'border-slate-600'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              {passwordError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordError}
                </motion.p>
              )}
            </div>

            {/* Repeat Password Field */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Repeat your password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  onBlur={handleRepeatPasswordBlur}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 ${
                    repeatPasswordError ? 'border-red-500/50' : 'border-slate-600'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              {repeatPasswordError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {repeatPasswordError}
                </motion.p>
              )}
            </div>

            {/* Sign Up Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Account
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Links */}
          <div className="mt-8 text-center">
            <div className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}