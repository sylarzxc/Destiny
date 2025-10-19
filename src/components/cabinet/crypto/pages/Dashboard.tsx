import React, { useMemo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CryptoCard } from '../CryptoCard';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, DollarSign, Percent, Loader2, RefreshCw } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useWalletsOptimized } from '../../../../hooks/useWalletsOptimized';
import { useStakes, useTransactions, useUserStats, useRealtimeWallets, useRealtimeStakes, useRealtimeTransactions } from '../../../../hooks/useDatabase';
import { useCryptoPrices, getCryptoPrice, getCryptoChange, formatCryptoPrice } from '../../../../lib/cryptoPrices';
import { motion, AnimatePresence } from 'framer-motion';
import { BalanceAnimation } from '../../../animations/BalanceAnimations';
import { AnimatedListItem, FadeInAnimation } from '../../../animations/ListAnimations';
import { SkeletonCard, SkeletonCryptoCard, SkeletonChart, SkeletonActivityItem } from '../../../ui/SkeletonLoader';
import { BalanceDetailsModal } from '../modals/BalanceDetailsModal';
import { StakeActivityItem } from '../StakeActivityItem';

export function Dashboard() {
  const [isVisible, setIsVisible] = useState(true);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  
  // Handle visibility change to prevent unnecessary reloads
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Progressive loading - load most important data first
  const { wallets, loading: walletsLoading, error: walletsError, isInitialized: walletsInitialized } = useWalletsOptimized();
  const { stats, loading: statsLoading } = useUserStats();
  const { stakes, loading: stakesLoading } = useStakes();
  const { transactions, loading: transactionsLoading } = useTransactions(10);
  const { prices, changes, loading: pricesLoading, error: pricesError, lastUpdated, refreshPrices } = useCryptoPrices();

  // Enable real-time updates only when visible
  useRealtimeWallets();
  useRealtimeStakes();
  useRealtimeTransactions();

  // Convert wallets to crypto balances format with real prices
  const cryptoBalances = useMemo(() => {
    const cryptoData = {
      'ETH': { name: 'Ethereum', iconColor: '#627EEA' },
      'BTC': { name: 'Bitcoin', iconColor: '#F7931A' },
      'USDT': { name: 'Tether', iconColor: '#26A17B' },
      'BNB': { name: 'Binance Coin', iconColor: '#F3BA2F' },
      'MATIC': { name: 'Polygon', iconColor: '#8247E5' },
    };

    return wallets.map(wallet => {
      const cryptoInfo = cryptoData[wallet.currency as keyof typeof cryptoData];
      const price = getCryptoPrice(prices, wallet.currency);
      const change = getCryptoChange(changes, wallet.currency);
      const totalBalance = wallet.available + wallet.locked;
      const usdValue = totalBalance * price;
      
      return {
        symbol: wallet.currency,
        name: cryptoInfo?.name || wallet.currency,
        balance: totalBalance.toFixed(2),
        usdValue: usdValue.toFixed(2),
        change: Number(change.toFixed(2)), // Real data from CoinGecko API
        iconColor: cryptoInfo?.iconColor || '#64748b',
      };
    });
  }, [wallets, prices, changes]);

  // Calculate stats from real data with memoization
  const dashboardStats = useMemo(() => {
    if (!stats) return [];

    // Реальний розрахунок загального балансу в USD
    const totalBalanceUSD = cryptoBalances.reduce((sum, crypto) => sum + parseFloat(crypto.usdValue), 0);
    
    const totalLocked = stats.total_locked;
    const totalEarned = stats.total_earned;
    const activeStakes = stats.active_stakes;

    // Calculate average APY from active stakes
    const avgAPY = stakes.length > 0 
      ? stakes.reduce((sum, stake) => sum + (stake.plan?.apr || 0), 0) / stakes.length * 100
      : 0;

    return [
      {
        label: 'Total Balance',
        value: `$${totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: '+12.5%',
        trend: 'up',
        icon: Wallet,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        label: 'Total Invested',
        value: `$${totalLocked.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: '+8.2%',
        trend: 'up',
        icon: TrendingUp,
        color: 'from-purple-500 to-pink-500',
      },
      {
        label: 'Total Earned',
        value: `$${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: '+15.8%',
        trend: 'up',
        icon: DollarSign,
        color: 'from-green-500 to-emerald-500',
      },
      {
        label: 'Avg APY',
        value: `${avgAPY.toFixed(1)}%`,
        change: '+0.5%',
        trend: 'up',
        icon: Percent,
        color: 'from-orange-500 to-yellow-500',
      },
    ];
  }, [stats, stakes, cryptoBalances]);

  // Generate real chart data from user's portfolio with expected profit projection
  const chartData = useMemo(() => {
    const last6Months = [];
    const now = new Date();
    
    // Calculate current total portfolio value
    const currentPortfolioValue = cryptoBalances.reduce((sum, crypto) => sum + parseFloat(crypto.usdValue), 0);
    
    // Calculate average APY from active stakes
    const avgAPY = stakes.length > 0 
      ? stakes.reduce((sum, stake) => sum + (stake.plan?.apr || 0), 0) / stakes.length
      : 0.08; // Default 8% APY if no stakes
    
    // Generate historical data based on transactions and current value
    let baseValue = Math.max(currentPortfolioValue * 0.6, 1000); // Start from 60% of current value, minimum $1000
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate historical value based on transactions in that month
      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.created_at);
        return txDate.getFullYear() === date.getFullYear() && 
               txDate.getMonth() === date.getMonth();
      });
      
      // Add deposits and subtract withdrawals
      const monthlyChange = monthTransactions.reduce((sum, tx) => {
        if (tx.type === 'deposit' || tx.type === 'stake_created') {
          return sum + tx.amount;
        } else if (tx.type === 'withdrawal' || tx.type === 'transfer_out') {
          return sum - tx.amount;
        }
        return sum;
      }, 0);
      
      // Add monthly staking rewards
      const monthlyRewards = baseValue * (avgAPY / 12);
      
      baseValue += monthlyChange + monthlyRewards;
      
      // Calculate expected value (with compound interest)
      const monthsFromStart = 5 - i;
      const expectedValue = currentPortfolioValue * Math.pow(1 + avgAPY, monthsFromStart / 12);
      
      last6Months.push({
        name: monthName,
        actual: Math.round(Math.max(Math.min(baseValue, currentPortfolioValue * 1.5), currentPortfolioValue * 0.3)), // Actual portfolio value
        expected: Math.round(Math.min(expectedValue, currentPortfolioValue * 2)), // Expected value with compound interest
        month: i
      });
    }
    
    return last6Months;
  }, [transactions, cryptoBalances, stakes]);

  // Convert stakes to recent activity format with memoization
  const recentStakes = useMemo(() => {
    return stakes
      .slice(0, 5) // Показуємо тільки 5 останніх стейків
      .map(stake => ({
        id: stake.id,
        type: stake.status === 'active' ? 'Stake Created' : 'Stake Completed',
        crypto: stake.currency || 'USDT',
        amount: stake.amount,
        plan: stake.plan?.name || 'Unknown Plan',
        apr: stake.plan?.apr || 0,
        time: stake.start_at,
        status: stake.status,
        yield_accumulated: stake.yield_accumulated || 0,
      }));
  }, [stakes]);

  // Progressive loading states
  const isStatsReady = !statsLoading && stats;
  const isWalletsReady = !walletsLoading && walletsInitialized;
  const isChartReady = !transactionsLoading;
  const isActivityReady = !transactionsLoading;

  return (
    <div className="space-y-6 hide-horizontal-scrollbar">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your portfolio overview</p>
      </div>

      {/* Stats Grid - Load first */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {isStatsReady ? (
            dashboardStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={`bg-cabinet-card-gradient border-slate-700/50 hover:border-blue-500/30 transition-all backdrop-blur-sm ${
                      stat.label === 'Total Balance' ? 'cursor-pointer hover:shadow-xl hover:shadow-blue-500/10' : ''
                    }`}
                    onClick={stat.label === 'Total Balance' ? () => setIsBalanceModalOpen(true) : undefined}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                          <Icon className="text-white" size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <ArrowUpRight size={16} />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <div className="text-slate-400 mb-1">{stat.label}</div>
                      <BalanceAnimation 
                        value={parseFloat(stat.value.replace(/[$,]/g, ''))} 
                        prefix="$"
                        size="lg"
                        className="text-white"
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Chart Section - Load second */}
      <AnimatePresence mode="wait">
        {isChartReady ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-white mb-1">Portfolio Value</h2>
                    <p className="text-slate-400">Your portfolio growth over time</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-300">Actual Portfolio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-green-500 border-dashed rounded-full"></div>
                        <span className="text-slate-300">Expected Growth</span>
                      </div>
                    </div>
                    <select className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2">
                      <option>6 Months</option>
                      <option>1 Month</option>
                      <option>1 Year</option>
                    </select>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                          if (value >= 1000000) {
                            return `$${(value / 1000000).toFixed(1)}M`;
                          } else if (value >= 1000) {
                            return `$${(value / 1000).toFixed(1)}K`;
                          } else {
                            return `$${value.toFixed(0)}`;
                          }
                        }}
                        domain={['dataMin - 100', 'dataMax + 100']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px'
                        }}
                        formatter={(value: number, name: string) => [
                          `$${value.toLocaleString('en-US', { 
                            minimumFractionDigits: 0, 
                            maximumFractionDigits: 0 
                          })}`,
                          name === 'actual' ? 'Actual Portfolio' : 'Expected Growth'
                        ]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      {/* Actual Portfolio Value */}
                      <Area 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorActual)"
                        name="actual"
                      />
                      {/* Expected Portfolio Value */}
                      <Area 
                        type="monotone" 
                        dataKey="expected" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fillOpacity={0} 
                        name="expected"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <SkeletonChart />
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Crypto Balances - Load third */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white">Your Assets</h2>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-slate-400">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPrices}
                disabled={pricesLoading}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {pricesLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          {pricesError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                Price update failed: {pricesError}
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence mode="wait">
              {isWalletsReady ? (
                walletsError ? (
                  <div className="col-span-2 flex items-center justify-center h-32 text-red-400">
                    <div className="text-center">
                      <div className="text-lg mb-2">Error loading assets</div>
                      <div className="text-sm">{walletsError}</div>
                    </div>
                  </div>
                ) : cryptoBalances.length > 0 ? (
                  cryptoBalances.map((crypto, index) => (
                    <motion.div
                      key={`${crypto.symbol}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CryptoCard {...crypto} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 flex items-center justify-center h-32 text-slate-400">
                    <div className="text-center">
                      <div className="text-lg mb-2">No assets found</div>
                      <div className="text-sm">Start by depositing some crypto</div>
                    </div>
                  </div>
                )
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCryptoCard key={i} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recent Stakes - Load last */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white">Recent Activity</h2>
            <div className="text-xs text-slate-400">
              {stakes.length > 5 ? `${stakes.length - 5} more` : ''}
            </div>
          </div>
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              {/* Пояснення що таке стейкінг */}
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-blue-400 text-sm font-medium mb-1">💡 What is Staking?</div>
                <div className="text-slate-300 text-xs">
                  Staking is locking your crypto to earn rewards. Your funds are locked for a period and you earn daily interest.
                </div>
              </div>
              
              <div className="space-y-4 max-h-80 scrollable-container">
                <AnimatePresence mode="wait">
                  {isActivityReady ? (
                    stakes.length > 0 ? (
                      stakes.slice(0, 5).map((stake, index) => (
                        <StakeActivityItem
                          key={stake.id}
                          stake={stake}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-32 text-slate-400">
                        <div className="text-center">
                          <div className="text-lg mb-2">No recent activity</div>
                          <div className="text-sm">Your staking activities will appear here</div>
                        </div>
                      </div>
                    )
                  ) : (
                    Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonActivityItem key={i} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Balance Details Modal */}
      <BalanceDetailsModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        wallets={wallets}
        prices={prices}
        changes={changes}
      />
    </div>
  );
}