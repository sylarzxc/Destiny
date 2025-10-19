// =============================================================
// Destiny Platform React Hooks
// Professional Supabase Cabinet Implementation
// =============================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type {
  Wallet,
  WalletWithTotal,
  Stake,
  StakeWithPlan,
  Transaction,
  TransactionWithDetails,
  Referral,
  ReferralWithDetails,
  Plan,
  OpenStakeParams,
  WithdrawStakeParams,
  TransferFundsParams,
  UseReferralCodeParams,
  UserStats,
  PlatformStats,
  AdminUserDetail,
  AdminDashboardOverview,
  AdminUserList,
  AdminStakeList,
  AdminPendingTransaction,
  AdminCreditWalletParams,
  AdminDebitWalletParams,
  AdminSetRoleParams,
  AdminForceCloseStakeParams,
  AdminPlanForm,
  DatabaseError,
  ApiError
} from '../lib/database.types';

// =============================================================
// Wallet Hooks
// =============================================================

export function useWallets() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletWithTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('currency');

      if (error) throw error;

      const walletsWithTotal = data?.map(wallet => ({
        ...wallet,
        total: wallet.available + wallet.locked
      })) || [];

      setWallets(walletsWithTotal);
    } catch (err) {
      console.error('Error fetching wallets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return {
    wallets,
    loading,
    error,
    refetch: fetchWallets
  };
}

export function useWalletActions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStake = useCallback(async (params: OpenStakeParams) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('open_stake', {
        p_plan_id: params.plan_id.toString(),
        p_amount: params.amount,
        p_currency: params.currency || 'USDT',
        p_flex_days: params.flex_days || null
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error creating stake:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create stake';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const withdrawStake = useCallback(async (params: WithdrawStakeParams) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('withdraw_stake', {
        p_stake_id: params.stake_id
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error withdrawing stake:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw stake';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const transferFunds = useCallback(async (params: TransferFundsParams) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('transfer_funds', {
        p_to_user_email: params.to_user_email,
        p_amount: params.amount,
        p_currency: params.currency || 'USDT',
        p_note: params.note || null
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error transferring funds:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to transfer funds';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    createStake,
    withdrawStake,
    transferFunds,
    loading,
    error
  };
}

// =============================================================
// Stake Hooks
// =============================================================

export function useStakes() {
  const { user } = useAuth();
  const [stakes, setStakes] = useState<StakeWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStakes = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('stakes')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('user_id', user.id)
        .order('start_at', { ascending: false });

      if (error) throw error;

      const stakesWithPlan = data?.map(stake => {
        const daysLeft = stake.end_at 
          ? Math.max(0, Math.ceil((new Date(stake.end_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          : null;

        const estimatedYield = stake.plan?.type === 'locked' 
          ? stake.yield_accumulated 
          : stake.amount * (stake.plan?.apr || 0) / 365 * (stake.plan?.days || 1);

        return {
          ...stake,
          plan: stake.plan as Plan,
          days_left: daysLeft,
          estimated_yield: estimatedYield
        };
      }) || [];

      setStakes(stakesWithPlan);
    } catch (err) {
      console.error('Error fetching stakes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stakes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStakes();
  }, [fetchStakes]);

  return {
    stakes,
    loading,
    error,
    refetch: fetchStakes
  };
}

export function useStakeActions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelStake = useCallback(async (stakeId: number) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('withdraw_stake', {
        p_stake_id: stakeId
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error cancelling stake:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel stake';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const completeStake = useCallback(async (stakeId: number) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('withdraw_stake', {
        p_stake_id: stakeId
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error completing stake:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete stake';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    cancelStake,
    completeStake,
    loading,
    error
  };
}

// =============================================================
// Transaction Hooks
// =============================================================

export function useTransactions(limit: number = 50) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          from_user:profiles!transactions_from_user_id_fkey(*),
          to_user:profiles!transactions_to_user_id_fkey(*),
          stake:stakes(*)
        `)
        .or(`user_id.eq.${user.id},from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions
  };
}

// =============================================================
// Referral Hooks
// =============================================================

export function useReferrals() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<ReferralWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:profiles!referrals_referrer_id_fkey(*),
          referred:profiles!referrals_referred_id_fkey(*)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReferrals(data || []);
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  return {
    referrals,
    loading,
    error,
    refetch: fetchReferrals
  };
}

export function useReferralCode() {
  const { profile } = useAuth();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.referral_code) {
      setReferralCode(profile.referral_code);
      setLoading(false);
    }
  }, [profile]);

  const useReferralCodeAction = useCallback(async (params: UseReferralCodeParams) => {
    if (!profile) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('use_referral_code', {
        p_referral_code: params.referral_code
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error using referral code:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to use referral code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  return {
    referralCode,
    useReferralCode: useReferralCodeAction,
    loading,
    error
  };
}

// =============================================================
// Plans Hooks
// =============================================================

export function usePlans(currency?: string) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('plans')
        .select('*')
        .order('currency, days');

      if (currency) {
        query = query.eq('currency', currency);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPlans(data || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans
  };
}

// =============================================================
// Statistics Hooks
// =============================================================

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);

      // Use Promise.all for parallel requests to speed up loading
      const [walletsResult, stakesResult, referralsResult] = await Promise.all([
        supabase
          .from('wallets')
          .select('available, locked')
          .eq('user_id', user.id),
        supabase
          .from('stakes')
          .select('status, yield_accumulated')
          .eq('user_id', user.id),
        supabase
          .from('referrals')
          .select('id')
          .eq('referrer_id', user.id)
      ]);

      const { data: wallets, error: walletsError } = walletsResult;
      const { data: stakes, error: stakesError } = stakesResult;
      const { data: referrals, error: referralsError } = referralsResult;

      if (walletsError) throw walletsError;
      if (stakesError) throw stakesError;
      if (referralsError) throw referralsError;

      // Memoized calculations
      const totalBalance = wallets?.reduce((sum, wallet) => sum + wallet.available, 0) || 0;
      const totalLocked = wallets?.reduce((sum, wallet) => sum + wallet.locked, 0) || 0;
      const activeStakes = stakes?.filter(stake => stake.status === 'active').length || 0;
      const totalEarned = stakes?.reduce((sum, stake) => sum + (stake.yield_accumulated || 0), 0) || 0;
      const referralCount = referrals?.length || 0;

      setStats({
        total_balance: totalBalance,
        total_locked: totalLocked,
        active_stakes: activeStakes,
        total_earned: totalEarned,
        referral_count: referralCount
      });
      setIsInitialized(true);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoized stats to prevent unnecessary re-renders
  const memoizedStats = useMemo(() => stats, [stats]);

  return {
    stats: memoizedStats,
    loading,
    error,
    isInitialized,
    refetch: fetchStats
  };
}

// =============================================================
// Admin Hooks
// =============================================================

export function useAdminDashboard() {
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('admin_dashboard_overview');

      if (error) throw error;

      setOverview(data?.[0] || null);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch admin dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    overview,
    loading,
    error,
    refetch: fetchOverview
  };
}

export function useAdminUsers(search?: string, limit: number = 50, offset: number = 0) {
  const [users, setUsers] = useState<AdminUserList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('admin_list_users', {
        p_limit: limit,
        p_offset: offset,
        p_search: search || null
      });

      if (error) throw error;

      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch admin users');
    } finally {
      setLoading(false);
    }
  }, [search, limit, offset]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers
  };
}

export function useAdminActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const creditWallet = useCallback(async (params: AdminCreditWalletParams) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('admin_credit_wallet', {
        p_user_id: params.user_id,
        p_currency: params.currency,
        p_amount: params.amount,
        p_note: params.note || null
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error crediting wallet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to credit wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const debitWallet = useCallback(async (params: AdminDebitWalletParams) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('admin_debit_wallet', {
        p_user_id: params.user_id,
        p_currency: params.currency,
        p_amount: params.amount,
        p_note: params.note || null
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error debiting wallet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to debit wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const setUserRole = useCallback(async (params: AdminSetRoleParams) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('admin_set_role', {
        p_user_id: params.user_id,
        p_role: params.role
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error setting user role:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to set user role';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const forceCloseStake = useCallback(async (params: AdminForceCloseStakeParams) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('admin_force_close_stake', {
        p_stake_id: params.stake_id,
        p_note: params.note || null,
        p_bonus: params.bonus || null
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error force closing stake:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to force close stake';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    creditWallet,
    debitWallet,
    setUserRole,
    forceCloseStake,
    loading,
    error
  };
}

// =============================================================
// Real-time Subscriptions
// =============================================================

export function useRealtimeWallets() {
  const { user } = useAuth();
  const { refetch } = useWallets();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('wallets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);
}

export function useRealtimeTransactions() {
  const { user } = useAuth();
  const { refetch } = useTransactions();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);
}

export function useRealtimeStakes() {
  const { user } = useAuth();
  const { refetch } = useStakes();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('stakes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stakes',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);
}

// Re-export types for external use
export type { StakeWithPlan };
