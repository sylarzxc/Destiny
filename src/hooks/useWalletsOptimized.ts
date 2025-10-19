import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Wallet = Database['public']['Tables']['wallets']['Row'];
type WalletWithTotal = Wallet & { total: number };

export function useWalletsOptimized() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletWithTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchWallets = useCallback(async () => {
    if (!user) return;

    try {
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
      setIsInitialized(true);
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

  // Memoized filtered wallets
  const walletsWithBalance = useMemo(() => 
    wallets.filter(wallet => wallet.available > 0 || wallet.locked > 0),
    [wallets]
  );

  return {
    wallets: walletsWithBalance,
    allWallets: wallets,
    loading,
    error,
    isInitialized,
    refetch: fetchWallets
  };
}
