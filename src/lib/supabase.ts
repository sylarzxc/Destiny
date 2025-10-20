import { createClient } from '@supabase/supabase-js'

// Declare Vite environment variables
declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL: string
      VITE_SUPABASE_ANON_KEY: string
    }
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')

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

export type StakeWithPlan = Stake & {
  plan?: Plan
}

export type TransferFundsParams = {
  to_user_email: string
  amount: number
  currency: string
  note?: string
}

export type OpenStakeParams = {
  plan_id: string
  amount: number
  currency: string
  flex_days?: number
}

export type WithdrawStakeParams = {
  stake_id: number
}

export type UseReferralCodeParams = {
  referral_code: string
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
