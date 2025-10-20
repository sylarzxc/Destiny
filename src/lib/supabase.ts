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

// Try to get from environment variables first
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('Environment check:')
console.log('- VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')

// Additional debugging for Vercel
if (supabaseUrl) {
  console.log('Supabase URL value:', supabaseUrl)
  console.log('URL starts with https:', supabaseUrl.startsWith('https://'))
  console.log('URL ends with .supabase.co:', supabaseUrl.endsWith('.supabase.co'))
}

// Check if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 SUPABASE NOT CONFIGURED!')
  console.error('')
  console.error('To fix this:')
  console.error('1. Create a file named ".env.local" in your version 0.3 folder')
  console.error('2. Add these lines to the file:')
  console.error('   VITE_SUPABASE_URL=https://your-project-id.supabase.co')
  console.error('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.error('')
  console.error('3. Get your credentials from: https://supabase.com')
  console.error('   - Go to your project → Settings → API')
  console.error('   - Copy Project URL and anon/public key')
  console.error('')
  console.error('4. Restart your server after adding the file')
  console.error('')
  
  // Don't create client with invalid credentials
  throw new Error('Supabase configuration missing. Please set up environment variables.')
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
