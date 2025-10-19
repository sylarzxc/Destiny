import React from 'react'
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm'

export function ResetPasswordPage() {
  const handleSuccess = () => {
    // Stay on page to show success message
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D1A] via-[#1a0d2e] to-[#0D0D1A] flex items-center justify-center relative overflow-hidden">
      {/* Cosmic Background */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url('/assets/cosmic-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
      
      {/* Animated stars */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <ResetPasswordForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => window.location.href = '/login'}
        />
      </div>
    </div>
  )
}
