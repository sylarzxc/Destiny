import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LoginForm } from '../components/auth/LoginForm'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleSuccess = () => {
    // Redirect to kabinet or the page they were trying to access
    const from = location.state?.from?.pathname || '/kabinet'
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Self-animating gradient background */}
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
      
      {/* Additional dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToRegister={() => navigate('/register')}
          onSwitchToReset={() => navigate('/reset-password')}
        />
      </div>
      
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
