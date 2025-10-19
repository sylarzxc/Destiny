import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send as SendIcon, AlertTriangle, Users, History, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useWallets, useWalletActions, useTransactions } from '../../../../hooks/useDatabase';
import type { Currency } from '../../../../lib/database.types';

export function Send() {
  const { wallets, loading: walletsLoading } = useWallets();
  const { transferFunds, loading: transferLoading } = useWalletActions();
  const { transactions, loading: transactionsLoading } = useTransactions(20);

  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<Currency>('USDT');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);

  const loading = walletsLoading || transactionsLoading;

  // Get user's wallet balance for selected crypto
  const walletBalance = useMemo(() => {
    const wallet = wallets.find(w => w.currency === selectedCrypto);
    return wallet?.available || 0;
  }, [wallets, selectedCrypto]);

  // Get recent transfer transactions
  const transferTransactions = useMemo(() => {
    return transactions.filter(tx => 
      tx.type === 'transfer_out' || tx.type === 'transfer_in'
    ).slice(0, 10);
  }, [transactions]);

  // Get unique recipients from transfer history
  const recentRecipients = useMemo(() => {
    const recipients = new Map();
    
    transferTransactions.forEach(tx => {
      if (tx.type === 'transfer_out' && tx.to_user) {
        const email = tx.to_user.email || 'Unknown';
        const lastSent = new Date(tx.created_at).toLocaleDateString();
        
        if (!recipients.has(email)) {
          recipients.set(email, {
            email,
            lastSent,
            count: 1
          });
        } else {
          recipients.get(email).count++;
        }
      }
    });

    return Array.from(recipients.values()).slice(0, 5);
  }, [transferTransactions]);

  // Validate transfer
  const validateTransfer = () => {
    if (!recipientEmail || !amount) {
      return 'Please fill all required fields';
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return 'Please enter a valid amount';
    }

    if (numAmount > walletBalance) {
      return `Insufficient balance. Available: ${walletBalance.toFixed(2)} ${selectedCrypto}`;
    }

    if (numAmount < 0.01) {
      return 'Minimum transfer amount is 0.01';
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(recipientEmail)) {
      return 'Please enter a valid email address';
    }

    return null;
  };

  const handleSend = async () => {
    const validationError = validateTransfer();
    if (validationError) {
      toast.error('Invalid Transfer', {
        description: validationError
      });
      return;
    }

    try {
      setIsSending(true);
      
      const transactionId = await transferFunds({
        to_user_email: recipientEmail,
        amount: parseFloat(amount),
        currency: selectedCrypto,
        note: note || undefined
      });

      toast.success('Transfer Successful!', {
        description: `Sent ${amount} ${selectedCrypto} to ${recipientEmail}`
      });

      // Reset form
      setRecipientEmail('');
      setAmount('');
      setNote('');
      
    } catch (error) {
      console.error('Error transferring funds:', error);
      toast.error('Transfer Failed', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading transfer options...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Send Cryptocurrency</h1>
        <p className="text-slate-400">Transfer your assets to another wallet</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-700/50">
                <SendIcon className="text-blue-400" size={20} />
                <h2 className="text-white">Transfer Details</h2>
              </div>

              {/* Select Asset */}
              <div className="space-y-2">
                <Label className="text-slate-300">Select Asset</Label>
                <Select value={selectedCrypto} onValueChange={(value) => {
                  setSelectedCrypto(value as Currency);
                  setAmount(''); // Reset amount when crypto changes
                }}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.currency} value={wallet.currency} className="text-white">
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{wallet.currency}</span>
                          <span className="text-blue-400">{wallet.available.toFixed(2)} available</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-slate-500">
                  Available: {walletBalance.toFixed(2)} {selectedCrypto}
                </p>
              </div>

              {/* Recipient Email */}
              <div className="space-y-2">
                <Label className="text-slate-300">Recipient Email</Label>
                <Input
                  type="email"
                  placeholder="Enter recipient's email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
                <p className="text-slate-500 text-sm">
                  Enter the email address of the user you want to send funds to
                </p>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-slate-300">Amount</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white pr-32"
                    step="0.01"
                    min="0.01"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      onClick={() => setAmount(walletBalance.toString())}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      MAX
                    </button>
                    <span className="text-slate-400">{selectedCrypto}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">
                  Minimum: 0.01 {selectedCrypto}
                </p>
              </div>

              {/* Note (Optional) */}
              <div className="space-y-2">
                <Label className="text-slate-300">Note (Optional)</Label>
                <Input
                  placeholder="Add a note for this transfer"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              {/* Transaction Summary */}
              {amount && (
                <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-slate-300">
                    <span>Amount:</span>
                    <span className="text-white">{amount} {selectedCrypto}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Recipient:</span>
                    <span className="text-white">{recipientEmail || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Network Fee:</span>
                    <span className="text-green-400">Free (Internal Transfer)</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between">
                    <span className="text-slate-300">Total Amount:</span>
                    <span className="text-white">{amount} {selectedCrypto}</span>
                  </div>
                </div>
              )}

              <Alert className="bg-orange-500/10 border-orange-500/30 text-orange-200">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <AlertDescription>
                  Double-check the recipient email. Transfers are instant and cannot be reversed.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleSend}
                disabled={isSending || !recipientEmail || !amount}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </div>
                ) : (
                  `Send ${selectedCrypto}`
                )}
              </Button>
            </div>
          </Card>

          {/* Transaction History */}
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="text-purple-400" size={20} />
                <h2 className="text-white">Recent Transfers</h2>
              </div>
              <div className="space-y-4">
                {transferTransactions.length > 0 ? (
                  transferTransactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between pb-4 border-b border-slate-700/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'transfer_out' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                        }`}>
                          <SendIcon size={18} />
                        </div>
                        <div>
                          <div className="text-white">
                            {tx.type === 'transfer_out' ? 'Sent' : 'Received'} {tx.currency}
                          </div>
                          <div className="text-slate-500">
                            {tx.type === 'transfer_out' 
                              ? `To: ${tx.to_user?.email || 'Unknown'}`
                              : `From: ${tx.from_user?.email || 'Unknown'}`
                            }
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`${tx.type === 'transfer_out' ? 'text-red-400' : 'text-green-400'}`}>
                          {tx.type === 'transfer_out' ? '-' : '+'}{tx.amount.toFixed(2)} {tx.currency}
                        </div>
                        <div className="text-slate-500 text-sm">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <CheckCircle size={48} className="mx-auto mb-3 text-slate-600" />
                    <p>No transfer history</p>
                    <p className="text-sm">Your transfers will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Recipients */}
        <div className="space-y-6">
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-blue-400" size={20} />
                <h3 className="text-white">Recent Recipients</h3>
              </div>
              <div className="space-y-3">
                {recentRecipients.length > 0 ? (
                  recentRecipients.map((recipient, index) => (
                    <motion.button
                      key={recipient.email}
                      onClick={() => setRecipientEmail(recipient.email)}
                      className="w-full bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-left transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-white mb-1">{recipient.email}</div>
                      <div className="text-slate-500 text-xs">
                        Last sent: {recipient.lastSent} • {recipient.count} transfer{recipient.count > 1 ? 's' : ''}
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Users size={48} className="mx-auto mb-3 text-slate-600" />
                    <p>No recent recipients</p>
                    <p className="text-sm">Send funds to see them here</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-info-block border-blue-500/30 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-white mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Always verify the recipient address</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Start with a small test transaction</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Network fees vary by blockchain</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Transactions are irreversible</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
