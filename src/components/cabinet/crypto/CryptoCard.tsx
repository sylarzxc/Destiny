import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CryptoCardProps {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  change?: number;
  iconColor: string;
  icon?: string;
}

export function CryptoCard({ symbol, name, balance, usdValue, change, iconColor, icon }: CryptoCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <Card className="bg-cabinet-card-gradient border-slate-700/50 hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: iconColor }}
            >
              {icon || symbol.charAt(0)}
            </div>
            <div>
              <div className="text-white">{symbol}</div>
              <div className="text-slate-500">{balance}</div>
            </div>
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(change).toFixed(2)}%</span>
            </div>
          )}
        </div>
        <div className="text-slate-400">${usdValue}</div>
      </div>
    </Card>
  );
}
