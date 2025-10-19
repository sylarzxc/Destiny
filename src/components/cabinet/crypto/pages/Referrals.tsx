import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Users, DollarSign, TrendingUp, Check, Share2, Mail, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useReferrals, useReferralCode, useTransactions, useUserStats } from '../../../../hooks/useDatabase';

export function Referrals() {
  const { referrals, loading: referralsLoading } = useReferrals();
  const { referralCode, useReferralCode: useReferralCodeAction, loading: referralCodeLoading } = useReferralCode();
  const { transactions, loading: transactionsLoading } = useTransactions(50);
  const { stats, loading: statsLoading } = useUserStats();

  const [copied, setCopied] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const [isUsingReferral, setIsUsingReferral] = useState(false);

  const loading = referralsLoading || referralCodeLoading || transactionsLoading || statsLoading;

  // Generate referral link
  const referralLink = useMemo(() => {
    if (!referralCode) return '';
    return `${window.location.origin}/register?ref=${referralCode}`;
  }, [referralCode]);

  // Calculate referral stats from real data
  const referralStats = useMemo(() => {
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(ref => ref.bonus_paid).length;
    
    // Calculate total earned from referral transactions
    const referralEarnings = transactions
      .filter(tx => tx.meta?.type === 'referral_bonus')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return [
      { 
        label: 'Total Referrals', 
        value: totalReferrals.toString(), 
        icon: Users, 
        color: 'from-blue-500 to-cyan-500' 
      },
      { 
        label: 'Total Earned', 
        value: `$${referralEarnings.toFixed(2)}`, 
        icon: DollarSign, 
        color: 'from-green-500 to-emerald-500' 
      },
      { 
        label: 'Active Referrals', 
        value: activeReferrals.toString(), 
        icon: TrendingUp, 
        color: 'from-purple-500 to-pink-500' 
      },
      { 
        label: 'Commission Rate', 
        value: '10%', 
        icon: TrendingUp, 
        color: 'from-orange-500 to-yellow-500' 
      },
    ];
  }, [referrals, transactions]);

  // Get referral earnings history
  const earningsHistory = useMemo(() => {
    return transactions
      .filter(tx => tx.meta?.type === 'referral_bonus')
      .slice(0, 10)
      .map(tx => ({
        date: new Date(tx.created_at).toLocaleDateString(),
        from: tx.meta?.referred_user || 'Unknown',
        amount: `$${tx.amount.toFixed(2)}`,
        type: 'Referral Bonus'
      }));
  }, [transactions]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseReferralCode = async () => {
    if (!referralInput.trim()) {
      toast.error('Please enter a referral code');
      return;
    }

    try {
      setIsUsingReferral(true);
      
      await useReferralCodeAction({
        referral_code: referralInput.trim()
      });

      toast.success('Referral Code Applied!', {
        description: 'You have received a bonus for using the referral code'
      });

      setReferralInput('');
      
    } catch (error) {
      console.error('Error using referral code:', error);
      toast.error('Failed to Apply Referral Code', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsUsingReferral(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Destiny Platform',
          text: 'Join me on Destiny Platform and start earning with crypto staking!',
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        handleCopy(referralLink);
      }
    } else {
      handleCopy(referralLink);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading referral data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Referral Program</h1>
        <p className="text-slate-400">Invite friends and earn 10% commission on their staking rewards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {referralStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="text-slate-400 mb-1">{stat.label}</div>
                  <div className="text-white">{stat.value}</div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Referral Link Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Share Link Card */}
          <Card className="bg-referral-gradient border-blue-500/30 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Share2 className="text-blue-400" size={20} />
                <h2 className="text-white">Your Referral Link</h2>
              </div>

              <div className="space-y-3">
                <div className="bg-cabinet-card border border-slate-700 rounded-lg p-4 flex items-center justify-between">
                  <code className="text-blue-400 break-all flex-1">{referralLink}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(referralLink)}
                    className="text-slate-400 hover:text-white ml-2"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </Button>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 mb-2">Referral Code</div>
                  <div className="flex items-center justify-between">
                    <code className="text-white">{referralCode || 'Generating...'}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(referralCode || '')}
                      className="text-slate-400 hover:text-white"
                      disabled={!referralCode}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleShare}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  disabled={!referralLink}
                >
                  <Share2 size={18} className="mr-2" />
                  Share Link
                </Button>
                <Button 
                  onClick={() => handleCopy(referralLink)}
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  disabled={!referralLink}
                >
                  <Mail size={18} className="mr-2" />
                  Invite via Email
                </Button>
              </div>
            </div>
          </Card>

          {/* Use Referral Code */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-white mb-4">Use Referral Code</h2>
              <div className="flex gap-2">
                <Input
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                  placeholder="Enter referral code"
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                />
                <Button 
                  onClick={handleUseReferralCode}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  disabled={isUsingReferral}
                >
                  {isUsingReferral ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Apply Code
                </Button>
              </div>
            </div>
          </Card>

          {/* Your Referrals */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-white mb-4">Your Referrals</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 pb-3">User</th>
                      <th className="text-left text-slate-400 pb-3">Joined</th>
                      <th className="text-left text-slate-400 pb-3">Status</th>
                      <th className="text-left text-slate-400 pb-3">Stakes</th>
                      <th className="text-left text-slate-400 pb-3">Your Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="w-8 h-8 text-slate-500" />
                            <span>No referrals yet</span>
                            <span className="text-sm text-slate-500">Share your referral link to start earning!</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      referrals.map((ref, index) => (
                        <motion.tr 
                          key={ref.id} 
                          className="border-b border-slate-800"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td className="py-4 text-white">User #{ref.referred_id.slice(-6)}</td>
                          <td className="py-4 text-slate-400">{new Date(ref.created_at).toLocaleDateString()}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              ref.bonus_paid 
                                ? 'bg-green-500/10 text-green-400' 
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {ref.bonus_paid ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-4 text-slate-300">-</td>
                          <td className="py-4 text-green-400">
                            {ref.bonus_paid ? '$10.00' : 'Pending'}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* How it Works */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-white mb-4">How it Works</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">1</span>
                  <div className="text-slate-300">
                    Share your unique referral link with friends
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">2</span>
                  <div className="text-slate-300">
                    They sign up and start staking
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">3</span>
                  <div className="text-slate-300">
                    You earn 10% of their staking rewards forever
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">4</span>
                  <div className="text-slate-300">
                    Withdraw your earnings anytime
                  </div>
                </li>
              </ol>
            </div>
          </Card>

          {/* Recent Earnings */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-white mb-4">Recent Earnings</h3>
              <div className="space-y-3">
                {earningsHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-slate-400">No earnings yet</span>
                    <p className="text-slate-500 text-sm mt-1">Start referring users to earn commissions!</p>
                  </div>
                ) : (
                  earningsHistory.map((earning, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-slate-900/50 rounded-lg p-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-slate-400 text-sm">{earning.from}</span>
                        <span className="text-green-400">{earning.amount}</span>
                      </div>
                      <div className="text-slate-500 text-xs">{earning.date}</div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
