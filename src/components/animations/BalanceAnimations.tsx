import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountUp } from '../../../hooks/useCountUp';

interface BalanceAnimationProps {
  value: number;
  previousValue?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  showChange?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BalanceAnimation({ 
  value, 
  previousValue = 0,
  prefix = "$", 
  suffix = "", 
  className = "",
  showChange = true,
  size = 'md'
}: BalanceAnimationProps) {
  const [isNewTransaction, setIsNewTransaction] = useState(false);
  const { count, isAnimating } = useCountUp({ 
    end: value, 
    duration: 1500, 
    delay: 0 
  });

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const change = value - previousValue;
  const isPositive = change > 0;
  const isNegative = change < 0;

  useEffect(() => {
    if (previousValue !== 0 && previousValue !== value) {
      setIsNewTransaction(true);
      const timer = setTimeout(() => setIsNewTransaction(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  return (
    <motion.div
      className={`relative ${className}`}
      layout
    >
      {/* Pulse effect for new transactions */}
      <AnimatePresence>
        {isNewTransaction && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.1, opacity: 0 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-lg blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Main balance */}
      <motion.div
        className={`relative z-10 font-bold ${sizeClasses[size]} ${
          isAnimating ? 'text-green-400' : 'text-white'
        }`}
        animate={isAnimating ? { 
          textShadow: [
            "0 0 10px rgba(34, 197, 94, 0.5)",
            "0 0 20px rgba(16, 185, 129, 0.8)",
            "0 0 10px rgba(34, 197, 94, 0.5)"
          ]
        } : {}}
        transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
      >
        {prefix}{formatNumber(count)}{suffix}
      </motion.div>

      {/* Change indicator */}
      <AnimatePresence>
        {showChange && change !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`absolute -top-6 right-0 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}
          >
            {isPositive ? '+' : ''}{formatNumber(change)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles for new transactions */}
      <AnimatePresence>
        {isNewTransaction && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  isPositive ? 'bg-green-400' : 'bg-red-400'
                }`}
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  x: `${50 + (Math.random() - 0.5) * 100}%`, 
                  y: `${50 + (Math.random() - 0.5) * 100}%`, 
                  opacity: [1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface TransactionAnimationProps {
  type: 'deposit' | 'withdraw' | 'stake_create' | 'stake_yield' | 'transfer_in' | 'transfer_out';
  amount: number;
  currency: string;
  timestamp: string;
}

export function TransactionAnimation({ type, amount, currency, timestamp }: TransactionAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeConfig = () => {
    switch (type) {
      case 'deposit':
      case 'transfer_in':
      case 'stake_yield':
        return {
          icon: '↗',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/50'
        };
      case 'withdraw':
      case 'transfer_out':
        return {
          icon: '↙',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/50'
        };
      case 'stake_create':
        return {
          icon: '🔒',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/50'
        };
      default:
        return {
          icon: '💰',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/50'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg border backdrop-blur-sm ${config.bgColor} ${config.borderColor}`}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl"
            >
              {config.icon}
            </motion.div>
            <div>
              <div className={`font-semibold ${config.color}`}>
                {type === 'deposit' ? 'Deposit' :
                 type === 'withdraw' ? 'Withdrawal' :
                 type === 'stake_create' ? 'Stake Created' :
                 type === 'stake_yield' ? 'Yield Earned' :
                 type === 'transfer_in' ? 'Received' :
                 type === 'transfer_out' ? 'Sent' : 'Transaction'}
              </div>
              <div className="text-white text-sm">
                {amount.toLocaleString()} {currency}
              </div>
              <div className="text-gray-400 text-xs">
                {new Date(timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
