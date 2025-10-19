import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock, DollarSign, Percent, TrendingUp } from 'lucide-react';
import type { StakeWithPlan } from '../../../hooks/useDatabase';

interface StakeActivityItemProps {
  stake: StakeWithPlan;
  index: number;
}

export function StakeActivityItem({ stake, index }: StakeActivityItemProps) {
  const isCompleted = stake.status === 'completed';
  const isCancelled = stake.status === 'cancelled';
  const isFlexible = stake.plan?.type === 'flexible';

  const icon = isCompleted || isCancelled ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />;
  const iconColorClass = isCompleted 
    ? 'bg-green-500/10 text-green-400' 
    : isCancelled 
    ? 'bg-red-500/10 text-red-400' 
    : 'bg-blue-500/10 text-blue-400';
  
  const amountColorClass = isCompleted || isCancelled ? 'text-green-400' : 'text-blue-400';

  const stakeType = isCompleted 
    ? 'Stake Completed' 
    : isCancelled 
    ? 'Stake Cancelled' 
    : 'Stake Created';
  
  const displayAmount = isCompleted 
    ? (stake.amount + (stake.yield_accumulated || 0)).toFixed(2) 
    : stake.amount.toFixed(2);

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return 'Unknown';
    }
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getDaysLeft = () => {
    if (isCompleted || isCancelled) return null;
    
    if (isFlexible) return null; // Flexible stakes don't have fixed duration
    
    // If we have end_at date, use it directly
    if (stake.end_at) {
      const endDate = new Date(stake.end_at);
      
      // Check if date is valid
      if (isNaN(endDate.getTime())) {
        console.warn('Invalid end_at date:', stake.end_at);
        return null;
      }
      
      const now = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, daysLeft);
    }
    
    // Otherwise calculate from start date and plan duration
    const startDate = new Date(stake.start_at);
    
    // Check if start date is valid
    if (isNaN(startDate.getTime())) {
      console.warn('Invalid start_at date:', stake.start_at);
      return null;
    }
    
    const totalDays = stake.plan?.days || 0;
    
    if (totalDays === 0) return null;
    
    const endDate = new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysLeft);
  };

  const daysLeft = getDaysLeft();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center justify-between pb-4 border-b border-slate-700/50 last:border-0 last:pb-0 hover:bg-slate-800/30 rounded-lg p-3 -m-3 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClass}`}>
          {icon}
        </div>
        <div>
          <div className="text-white font-medium">{stakeType}</div>
          <div className="text-slate-500 text-sm flex items-center gap-2">
            <span>{stake.plan?.name || 'Unknown Plan'}</span>
            <span className="text-slate-600">•</span>
            <span>{stake.currency}</span>
            {stake.plan?.apr && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-green-400 flex items-center gap-1">
                  <Percent size={12} />
                  {(stake.plan.apr * 100).toFixed(1)}%
                </span>
              </>
            )}
            {!isFlexible && stake.plan?.days && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400">{stake.plan.days}d</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className={`${amountColorClass} font-medium flex items-center gap-1`}>
          {isCompleted ? '+' : ''}{displayAmount} {stake.currency}
          {isCompleted && stake.yield_accumulated && stake.yield_accumulated > 0 && (
            <DollarSign size={14} className="text-green-400" />
          )}
        </div>
        <div className="text-slate-500 text-sm flex items-center gap-2">
          {daysLeft !== null ? (
            <>
              <Clock size={12} />
              <span>{daysLeft === 0 ? 'Expired' : `${daysLeft}d left`}</span>
            </>
          ) : isFlexible ? (
            <span className="text-blue-400">Flexible</span>
          ) : (
            <span>{formatTimeAgo(stake.start_at)}</span>
          )}
        </div>
        
        {/* Status Badge */}
        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
          stake.status === 'active' 
            ? 'bg-green-500/20 text-green-400' 
            : stake.status === 'completed'
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {stake.status.charAt(0).toUpperCase() + stake.status.slice(1)}
        </div>
      </div>
    </motion.div>
  );
}

