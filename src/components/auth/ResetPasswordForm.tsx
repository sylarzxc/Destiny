import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { motion } from 'framer-motion'

interface ResetPasswordFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function ResetPasswordForm({ onSuccess, onSwitchToLogin }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

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
    setSuccess('')
    setLoading(true)

    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      await resetPassword(email)
      setSuccess('Password reset link sent to your email!')
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please try again.')
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
      <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              <span className="text-purple-400">Reset</span>{' '}
              <span className="text-blue-400">Password</span>
            </h2>
            <p className="text-gray-400 text-sm">Enter your email to receive reset instructions</p>
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

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm text-center"
            >
              {success}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 ${
                  emailError ? 'border-red-500/50' : 'border-white/20'
                }`}
                required
              />
              {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
            </div>

            {/* Reset Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}