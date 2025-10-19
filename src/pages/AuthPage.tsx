import React, { useState } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm'

type AuthMode = 'login' | 'register' | 'reset'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')

  const handleSuccess = () => {
    // Redirect to dashboard or home page
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center relative overflow-hidden">
      {/* Cosmic Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('/assets/cosmic-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Static stars */}
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {mode === 'login' && (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setMode('register')}
            onSwitchToReset={() => setMode('reset')}
          />
        )}
        
        {mode === 'register' && (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
        
        {mode === 'reset' && (
          <ResetPasswordForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  )
}
