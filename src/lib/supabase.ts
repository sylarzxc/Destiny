import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on Supabase schema
export type Profile = {
  id: string
  email: string | null
  display_name: string | null
  role: string
  created_at: string
  referral_code?: string
}

export type Wallet = {
  user_id: string
  currency: string
  available: number
  locked: number
  updated_at: string
}

export type Plan = {
  id: number
  name: string
  days: number
  apr: number
  type: 'locked' | 'flexible'
}

export type Stake = {
  id: number
  user_id: string
  plan_id: number | null
  amount: number
  start_at: string
  end_at: string | null
  status: 'active' | 'completed' | 'cancelled'
  yield_accumulated: number
  currency: string
  flex_days: number | null
}

export type Transaction = {
  id: number
  user_id: string
  type: 'deposit' | 'withdraw' | 'stake_create' | 'stake_yield'
  amount: number
  created_at: string
  meta: Record<string, any>
}

// Auth types
export type AuthUser = {
  id: string
  email?: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
}

export type AuthSession = {
  user: AuthUser
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
}
