import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lock, TrendingUp, Clock, Loader2, CheckCircle, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useWallets, useWalletActions, usePlans, useStakes } from '../../../../hooks/useDatabase';
import type { Currency } from '../../../../lib/database.types';

export function Deposit() {
  const { wallets, loading: walletsLoading } = useWallets();
  const { createStake, loading: stakeLoading } = useWalletActions();
  const { plans, loading: plansLoading } = usePlans();
  const { stakes, loading: stakesLoading } = useStakes();

  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<Currency>('USDT');
  const [selectedTerm, setSelectedTerm] = useState<number>(30);
  const [stakingType, setStakingType] = useState<'locked' | 'flexible'>('locked');
  const [isCreating, setIsCreating] = useState(false);

  const loading = walletsLoading || plansLoading || stakesLoading;

  // Create fixed staking plans (30-90-180 days for locked, no term for flexible)
  const availablePlans = useMemo(() => {
    if (stakingType === 'flexible') {
      // For flexible staking, no term selection needed
      return [{
        id: 1,
        days: 0, // No fixed term for flexible
        apr: 0.08, // 8% APR for flexible
        type: 'flexible',
        currency: selectedCrypto,
        name: 'Flexible Staking'
      }];
    }
    
    // For locked staking, show term options
    const baseAPR = 0.12; // 12% base for locked
    
    return [
      {
        id: 1,
        days: 30,
        apr: baseAPR,
        type: 'locked',
        currency: selectedCrypto,
        name: 'Locked 30 Days'
      },
      {
        id: 2,
        days: 90,
        apr: baseAPR + 0.03, // +3% for longer term
        type: 'locked',
        currency: selectedCrypto,
        name: 'Locked 90 Days'
      },
      {
        id: 3,
        days: 180,
        apr: baseAPR + 0.06, // +6% for longest term
        type: 'locked',
        currency: selectedCrypto,
        name: 'Locked 180 Days'
      }
    ];
  }, [stakingType, selectedCrypto]);

  // Get user's wallet balance for selected crypto
  const walletBalance = useMemo(() => {
    const wallet = wallets.find(w => w.currency === selectedCrypto);
    return wallet?.available || 0;
  }, [wallets, selectedCrypto]);

  // Get selected plan details based on term
  const selectedPlanDetails = useMemo(() => {
    if (stakingType === 'flexible') {
      // For flexible, always use the first (and only) plan
      return availablePlans[0];
    }
    return availablePlans.find(plan => plan.days === selectedTerm);
  }, [availablePlans, selectedTerm, stakingType]);

  // Calculate estimated rewards
  const calculateRewards = () => {
    if (!amount || !selectedPlanDetails) return { total: 0, daily: 0 };
    const principal = parseFloat(amount);
    const apy = selectedPlanDetails.apr;
    
    if (stakingType === 'flexible') {
      // For flexible staking, calculate daily rewards only (no total term)
      const dailyRewards = principal * (apy / 365);
      return { 
        total: 0, // No total for flexible since no fixed term
        daily: dailyRewards.toFixed(2) 
      };
    }
    
    // For locked staking, calculate both total and daily
    const days = selectedPlanDetails.days;
    const totalRewards = principal * apy * (days / 365);
    const dailyRewards = totalRewards / days;
    return { 
      total: totalRewards.toFixed(2), 
      daily: dailyRewards.toFixed(2) 
    };
  };

  // Validate amount
  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return 'Please enter a valid amount';
    }
    if (numAmount > walletBalance) {
      return `Insufficient balance. Available: ${walletBalance.toFixed(2)} ${selectedCrypto}`;
    }
    if (numAmount < 0.01) {
      return 'Minimum deposit amount is 0.01';
    }
    return null;
  };

  const handleCreateStake = async () => {
    const validationError = validateAmount();
    if (validationError) {
      toast.error('Invalid Amount', {
        description: validationError
      });
      return;
    }

    if (!selectedPlanDetails) {
      toast.error('Please select a staking plan');
      return;
    }

    try {
      setIsCreating(true);
      
      // For now, we'll create a mock stake since we're using fixed plans
      // In a real implementation, you'd need to create these plans in the database first
      const stakeId = await createStake({
        plan_id: selectedPlanDetails.id,
        amount: parseFloat(amount),
        currency: selectedCrypto
      });

      toast.success('Stake Created Successfully!', {
        description: `Your ${amount} ${selectedCrypto} has been staked for ${selectedPlanDetails.days} days`
      });

      // Reset form
      setAmount('');
      
    } catch (error) {
      console.error('Error creating stake:', error);
      toast.error('Failed to Create Stake', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Get active stakes for the selected crypto
  const activeStakes = useMemo(() => {
    return stakes.filter(stake => 
      stake.currency === selectedCrypto && 
      stake.status === 'active'
    );
  }, [stakes, selectedCrypto]);

  // Calculate expected profit for a stake
  const calculateExpectedProfit = (stake: any) => {
    const principal = stake.amount;
    const apr = stake.plan?.apr || 0;
    
    if (stake.type === 'flexible') {
      // For flexible staking, calculate profit based on time since start
      const daysSinceStart = Math.max(0, Math.floor((Date.now() - new Date(stake.start_at).getTime()) / (1000 * 60 * 60 * 24)));
      return principal * apr * (daysSinceStart / 365);
    } else {
      // For locked staking, calculate profit based on elapsed time
      const daysSinceStart = Math.max(0, Math.floor((Date.now() - new Date(stake.start_at).getTime()) / (1000 * 60 * 60 * 24)));
      const totalDays = stake.plan?.days || 0;
      
      if (totalDays === 0) return 0;
      
      const elapsedRatio = Math.min(daysSinceStart / totalDays, 1);
      return principal * apr * elapsedRatio;
    }
  };

  const rewards = calculateRewards();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading staking options...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">Open deposit</h1>
          <p className="text-slate-400">Stake your crypto and earn passive income</p>
        </div>
        <Button 
          variant="outline" 
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Investment Strategies
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Deposit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              {/* Staking Type Toggle */}
              <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
                <button
                  onClick={() => setStakingType('locked')}
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    stakingType === 'locked'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Locked Staking
                </button>
                <button
                  onClick={() => setStakingType('flexible')}
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    stakingType === 'flexible'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Flexible Staking
                </button>
              </div>

              {/* Calculator Section */}
              <div className={`grid gap-4 ${stakingType === 'flexible' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Amount</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="e.g. 2000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Available: {walletBalance.toFixed(2)} {selectedCrypto}
                  </p>
                </div>

                {/* Currency Select */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Currency</Label>
                  <Select value={selectedCrypto} onValueChange={(value) => {
                    setSelectedCrypto(value as Currency);
                  }}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.currency} value={wallet.currency} className="text-white">
                          <div className="flex items-center justify-between w-full gap-4">
                            <span>{wallet.currency}</span>
                            <span className="text-blue-400">{wallet.available.toFixed(2)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Term Select - Only for Locked Staking */}
                {stakingType === 'locked' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Term, days</Label>
                    <Select value={selectedTerm.toString()} onValueChange={(value) => {
                      setSelectedTerm(parseInt(value));
                    }}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {availablePlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.days.toString()} className="text-white">
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>{plan.days} days</span>
                              <span className="text-green-400">{(plan.apr * 100).toFixed(1)}% APR</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Calculator Results */}
              <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                {stakingType === 'locked' && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total to receive:</span>
                    <span className="text-white text-lg font-semibold">
                      {amount ? `${(parseFloat(amount) + (typeof rewards.total === 'string' ? parseFloat(rewards.total) : rewards.total)).toFixed(2)}` : '0'} {selectedCrypto}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Daily income:</span>
                  <span className="text-green-400 text-lg font-semibold">
                    {rewards.daily} {selectedCrypto}
                  </span>
                </div>
                {selectedPlanDetails && (
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>APR Rate:</span>
                      <span className="text-green-400">{(selectedPlanDetails.apr * 100).toFixed(1)}%</span>
                    </div>
                    {stakingType === 'locked' && (
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>Total Rewards:</span>
                        <span className="text-blue-400">+{rewards.total} {selectedCrypto}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              {stakingType === 'flexible' && (
                <div className="text-xs text-slate-500">
                  When closing a flexible deposit, a commission of 5% is charged
                </div>
              )}

              {/* Create Stake Button */}
              <Button 
                onClick={handleCreateStake}
                disabled={isCreating || !selectedPlanDetails || !amount}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Creating Stake...
                  </div>
                ) : (
                  'Open deposit'
                )}
              </Button>
            </div>
          </Card>

          {/* Active Stakes */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white">Your Active Stakes</h2>
                {activeStakes.length > 0 && (
                  <span className="text-xs text-slate-400">
                    {activeStakes.length} stake{activeStakes.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="max-h-96 scrollable-container">
                <div className="space-y-3 pr-2">
                  {activeStakes.length > 0 ? (
                    activeStakes.map((stake, index) => {
                      const progress = stake.end_at 
                        ? Math.max(0, Math.min(100, 
                            ((Date.now() - new Date(stake.start_at).getTime()) / 
                             (new Date(stake.end_at).getTime() - new Date(stake.start_at).getTime())) * 100
                          ))
                        : 0;
                      
                      const daysLeft = stake.end_at 
                        ? Math.max(0, Math.ceil((new Date(stake.end_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                        : null;

                      return (
                        <motion.div
                          key={stake.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-slate-900/50 rounded-lg p-4 space-y-3 hover:bg-slate-900/70 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 flex-shrink-0">
                                {stake.currency}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-white font-medium truncate">
                                  {stake.amount.toFixed(2)} {stake.currency}
                                </div>
                                <div className="text-slate-500 text-sm">
                                  APR: {(stake.plan?.apr * 100 || 0).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-3">
                              <div className="text-green-400 font-medium">
                                +{calculateExpectedProfit(stake).toFixed(2)} {stake.currency}
                              </div>
                              <div className="text-slate-500 text-sm">
                                {daysLeft !== null ? `${daysLeft} days left` : 'Flexible'}
                              </div>
                            </div>
                          </div>
                          {daysLeft !== null && (
                            <div className="w-full bg-slate-800 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <CheckCircle size={48} className="mx-auto mb-3 text-slate-600" />
                      <p className="text-lg font-medium">No active stakes for {selectedCrypto}</p>
                      <p className="text-sm mt-1">Create your first stake above!</p>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* APY Info */}
          <Card className="bg-info-block border-blue-500/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-400" />
                <h3 className="text-white">APY Rates for {selectedCrypto}</h3>
              </div>
              <p className="text-slate-300 mb-4">
                Earn competitive returns on your {selectedCrypto} deposits. The longer you stake, the higher your returns.
              </p>
              <div className="space-y-2">
                {availablePlans.map((plan) => (
                  <div key={plan.id} className="flex justify-between text-sm">
                    <span className="text-slate-400">{plan.days} days:</span>
                    <span className="text-green-400">{(plan.apr * 100).toFixed(1)}% APR</span>
                  </div>
                ))}
                {availablePlans.length === 0 && (
                  <div className="text-slate-500 text-sm text-center py-2">
                    No plans available
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* How it works */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-purple-400" />
                <h3 className="text-white">How it Works</h3>
              </div>
              <ol className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">1</span>
                  <span>Choose your crypto asset</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">2</span>
                  <span>Select deposit amount and period</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">3</span>
                  <span>Confirm and stake your crypto</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">4</span>
                  <span>Earn rewards automatically</span>
                </li>
              </ol>
            </div>
          </Card>

          {/* Alert */}
          <Alert className="bg-orange-500/10 border-orange-500/30 text-orange-200">
            <Clock className="h-4 w-4 text-orange-400" />
            <AlertDescription>
              Early withdrawal before the lock period ends will result in a 5% penalty fee.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}