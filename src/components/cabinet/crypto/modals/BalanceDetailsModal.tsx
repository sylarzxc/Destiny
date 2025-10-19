import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCryptoPrice, getCryptoPrice, getCryptoChange } from '../../../../lib/cryptoPrices';
import type { Wallet } from '../../../../lib/database.types';
import type { CryptoPriceMap, CryptoChangeMap } from '../../../../lib/cryptoPrices';

interface BalanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
  prices: CryptoPriceMap;
  changes: CryptoChangeMap;
}

export function BalanceDetailsModal({ isOpen, onClose, wallets, prices, changes }: BalanceDetailsModalProps) {
  const walletDetails = useMemo(() => {
    return wallets.map(wallet => {
      const price = getCryptoPrice(prices, wallet.currency);
      const totalBalance = wallet.available + wallet.locked;
      const usdValue = totalBalance * price;
      const availableUsd = wallet.available * price;
      const lockedUsd = wallet.locked * price;
      
      return {
        ...wallet,
        usdValue,
        availableUsd,
        lockedUsd,
        price,
        totalBalance,
      };
    }).sort((a, b) => b.usdValue - a.usdValue); // Sort by USD value descending
  }, [wallets, prices]);

  const totalPortfolioValue = useMemo(() => {
    return walletDetails.reduce((sum, wallet) => sum + wallet.usdValue, 0);
  }, [walletDetails]);

  const handleSendClick = (currency: string) => {
    // Navigate to send page with pre-selected currency
    console.log('Navigate to send page for:', currency);
    // You can implement navigation logic here
  };

  const handleStakeClick = (currency: string) => {
    // Navigate to stake page with pre-selected currency
    console.log('Navigate to stake page for:', currency);
    // You can implement navigation logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-cabinet-card-gradient border-slate-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Total Balance Details</DialogTitle>
          <DialogDescription className="text-slate-400">
            Overview of your cryptocurrency holdings and quick actions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Total Portfolio Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
          >
            <div className="text-3xl font-bold text-white mb-2">
              {formatCryptoPrice(totalPortfolioValue)}
            </div>
            <div className="text-slate-400">Total Portfolio Value</div>
          </motion.div>

          {/* Wallet Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-4">Asset Breakdown</h3>
            {walletDetails.length > 0 ? (
              walletDetails.map((wallet, index) => {
                const percentage = totalPortfolioValue > 0 ? (wallet.usdValue / totalPortfolioValue) * 100 : 0;
                
                return (
                  <motion.div
                    key={wallet.currency}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700 p-4 hover:border-blue-500/50 transition-all">
                      <div className="flex items-center justify-between">
                        {/* Asset Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {wallet.currency.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-white">{wallet.currency}</div>
                              <div className="text-sm text-slate-400">
                                {percentage.toFixed(2)}% of portfolio
                              </div>
                            </div>
                          </div>
                          
                          {/* Balance Breakdown */}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-slate-400">Available</div>
                              <div className="text-white font-medium">
                                {wallet.available.toFixed(2)} {wallet.currency}
                              </div>
                              <div className="text-green-400">
                                {formatCryptoPrice(wallet.availableUsd)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400">Locked</div>
                              <div className="text-white font-medium">
                                {wallet.locked.toFixed(2)} {wallet.currency}
                              </div>
                              <div className="text-orange-400">
                                {formatCryptoPrice(wallet.lockedUsd)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400">Total</div>
                              <div className="text-white font-medium">
                                {wallet.totalBalance.toFixed(2)} {wallet.currency}
                              </div>
                              <div className="text-blue-400 font-semibold">
                                {formatCryptoPrice(wallet.usdValue)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendClick(wallet.currency)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStakeClick(wallet.currency)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Stake
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center text-slate-400 py-8">
                <div className="text-lg mb-2">No assets found</div>
                <div className="text-sm">Start by depositing some cryptocurrency</div>
              </div>
            )}
          </div>

          {/* Portfolio Summary */}
          {walletDetails.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {formatCryptoPrice(walletDetails.reduce((sum, w) => sum + w.availableUsd, 0))}
                </div>
                <div className="text-slate-400 text-sm">Available Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {formatCryptoPrice(walletDetails.reduce((sum, w) => sum + w.lockedUsd, 0))}
                </div>
                <div className="text-slate-400 text-sm">Locked in Stakes</div>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
