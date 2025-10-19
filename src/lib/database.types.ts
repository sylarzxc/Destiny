// =============================================================
// Destiny Platform Database Types
// Professional Supabase Cabinet Implementation
// =============================================================

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: 'user' | 'admin';
  referral_code: string | null;
  created_at: string;
}

export interface Wallet {
  user_id: string;
  currency: string;
  available: number;
  locked: number;
  updated_at: string;
}

export interface Stake {
  id: number;
  user_id: string;
  plan_id: number;
  amount: number;
  start_at: string;
  end_at: string | null;
  status: 'active' | 'completed' | 'cancelled';
  yield_accumulated: number;
  currency: string;
  flex_days: number | null;
}

export interface Plan {
  id: number;
  name: string;
  days: number;
  apr: number;
  type: 'locked' | 'flexible';
  currency: string;
}

export interface Transaction {
  id: number;
  user_id: string;
  type: 'deposit' | 'withdraw' | 'stake_create' | 'stake_yield' | 'transfer_in' | 'transfer_out';
  amount: number;
  currency: string;
  created_at: string;
  from_user_id: string | null;
  to_user_id: string | null;
  stake_id: number | null;
  meta: Record<string, any>;
}

export interface Referral {
  id: number;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  created_at: string;
  bonus_paid: boolean;
}

export interface AdminLog {
  id: number;
  admin_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  meta: Record<string, any> | null;
  created_at: string;
}

export interface Setting {
  key: string;
  value: Record<string, any>;
}

// =============================================================
// Extended Types for UI Components
// =============================================================

export interface WalletWithTotal extends Wallet {
  total: number;
}

export interface StakeWithPlan extends Stake {
  plan: Plan;
  days_left?: number;
  estimated_yield?: number;
}

export interface TransactionWithDetails extends Transaction {
  from_user?: Profile;
  to_user?: Profile;
  stake?: Stake;
}

export interface ReferralWithDetails extends Referral {
  referrer: Profile;
  referred: Profile;
}

// =============================================================
// API Response Types
// =============================================================

export interface AdminUserDetail {
  profile: Profile;
  wallets: WalletWithTotal[];
  stakes: StakeWithPlan[];
  recent_transactions: TransactionWithDetails[];
  pending_requests: TransactionWithDetails[];
}

export interface AdminDashboardOverview {
  total_users: number;
  total_wallet_available: number;
  total_wallet_locked: number;
  pending_requests: number;
  active_stakes: number;
  expiring_24h: number;
  total_active_deposit: number;
  total_referrals: number;
}

export interface AdminUserList {
  id: string;
  email: string;
  display_name: string;
  role: string;
  referral_code: string;
  created_at: string;
  total_available: number;
  total_locked: number;
  active_stakes: number;
  pending_deposits: number;
  pending_withdraws: number;
  next_maturity: string | null;
  last_transaction: string | null;
  last_sign_in_at: string | null;
}

export interface AdminStakeList {
  id: number;
  user_id: string;
  email: string;
  display_name: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  start_at: string;
  end_at: string | null;
  seconds_left: number;
  apr: number;
  plan_days: number;
  plan_type: string;
}

export interface AdminPendingTransaction {
  id: number;
  created_at: string;
  user_id: string;
  email: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
}

// =============================================================
// Function Parameter Types
// =============================================================

export interface OpenStakeParams {
  plan_id: number;
  amount: number;
  currency?: string;
  flex_days?: number;
}

export interface WithdrawStakeParams {
  stake_id: number;
}

export interface TransferFundsParams {
  to_user_email: string;
  amount: number;
  currency?: string;
  note?: string;
}

export interface UseReferralCodeParams {
  referral_code: string;
}

export interface AdminCreditWalletParams {
  user_id: string;
  currency: string;
  amount: number;
  note?: string;
}

export interface AdminDebitWalletParams {
  user_id: string;
  currency: string;
  amount: number;
  note?: string;
}

export interface AdminSetRoleParams {
  user_id: string;
  role: 'user' | 'admin';
}

export interface AdminForceCloseStakeParams {
  stake_id: number;
  note?: string;
  bonus?: number;
}

// =============================================================
// Error Types
// =============================================================

export interface DatabaseError {
  code: string;
  message: string;
  details?: string;
  hint?: string;
}

export interface ApiError {
  error: string;
  message: string;
  status?: number;
}

// =============================================================
// Utility Types
// =============================================================

export type Currency = 'ETH' | 'BTC' | 'USDT' | 'BNB' | 'MATIC';

export type TransactionType = Transaction['type'];

export type StakeStatus = Stake['status'];

export type PlanType = Plan['type'];

export type UserRole = Profile['role'];

// =============================================================
// Form Data Types
// =============================================================

export interface CreateStakeForm {
  plan_id: number;
  amount: string;
  currency: Currency;
}

export interface TransferForm {
  recipient_email: string;
  amount: string;
  currency: Currency;
  note?: string;
}

export interface ReferralForm {
  referral_code: string;
}

export interface AdminCreditForm {
  user_email: string;
  currency: Currency;
  amount: string;
  note?: string;
}

export interface AdminPlanForm {
  name: string;
  days: number;
  apr: number;
  type: PlanType;
  currency: Currency;
}

// =============================================================
// Statistics Types
// =============================================================

export interface UserStats {
  total_balance: number;
  total_locked: number;
  active_stakes: number;
  total_earned: number;
  referral_count: number;
}

export interface PlatformStats {
  total_users: number;
  total_tvl: number;
  active_stakes: number;
  daily_volume: number;
  total_referrals: number;
}

// =============================================================
// Notification Types
// =============================================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// =============================================================
// Chart Data Types
// =============================================================

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PortfolioChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

export interface StakingChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}
