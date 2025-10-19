import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type AuthUser, type Profile } from '../lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      // Додамо таймаут для запиту (зменшено до 10 секунд для кращого UX)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error fetching profile:', error)
        // Якщо профіль не існує, створимо базовий профіль
        if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
          console.log('Profile not found, creating basic profile...')
          // Спробуємо створити профіль
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user?.email || null,
              display_name: null,
              role: 'user',
              referral_code: null,
              created_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError)
            setProfile({
              id: userId,
              email: user?.email || null,
              display_name: null,
              role: 'user',
              referral_code: null,
              created_at: new Date().toISOString()
            })
          } else {
            setProfile(newProfile)
          }
        } else {
          setProfile(null)
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      
      // Якщо це помилка таймауту або проблеми з мережею, створимо локальний профіль
      if (error instanceof Error && (
        error.message.includes('timeout') || 
        error.message.includes('fetch') ||
        error.message.includes('network')
      )) {
        console.log('Network issue detected, creating local profile...')
        setProfile({
          id: userId,
          email: user?.email || null,
          display_name: null,
          role: 'user',
          referral_code: null,
          created_at: new Date().toISOString()
        })
      } else {
        setProfile(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    // Handle referral code from localStorage
    const pendingReferral = localStorage.getItem('destiny_pending_referral')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          referral_code: pendingReferral,
        },
      },
    })

    if (pendingReferral) {
      localStorage.removeItem('destiny_pending_referral')
    }

    return { error }
  }

  const signOut = async () => {
    try {
      // Спочатку очистимо локальний стан
      setUser(null)
      setProfile(null)
      setLoading(false)
      
      // Потім вийдемо з Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Error signing out:', error)
      // Навіть якщо є помилка, стан вже очищений
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
