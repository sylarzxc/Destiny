import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RegisterForm } from '../components/auth/RegisterForm'

export function RegisterPage() {
  const navigate = useNavigate()
  
  const handleSuccess = () => {
    // Redirect to kabinet after successful registration
    navigate('/kabinet', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Self-animating gradient background */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            linear-gradient(45deg, 
              #0f172a 0%, 
              #1e1b4b 25%, 
              #0f172a 50%, 
              #1e1b4b 75%, 
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
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <RegisterForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => navigate('/login')}
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
