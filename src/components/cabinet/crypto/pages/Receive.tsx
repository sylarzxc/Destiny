import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, QrCode, Check, Download } from 'lucide-react';
import { CryptoCard } from '../CryptoCard';
import { toast } from 'sonner';

export function Receive() {
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [copied, setCopied] = useState(false);

  const depositAddress = 'TKCTG_1t5n_AcArmB3_1PQ_JuE3C';
  const noteText = '* Route transaction note)\n* Minimum deposit 1 USDT\n* To make Deposit you have to collect...';

  const networks = [
    { id: 'TRC20', name: 'TRC20 (Tron)', fee: 'Low' },
    { id: 'ERC20', name: 'ERC20 (Ethereum)', fee: 'High' },
    { id: 'BEP20', name: 'BEP20 (BSC)', fee: 'Low' },
  ];

  const cryptoBalances = [
    { symbol: 'ETH', name: 'Ethereum', balance: '10.00', usdValue: '19,000', iconColor: '#627EEA' },
    { symbol: 'BNB', name: 'Binance', balance: '$0.00', usdValue: '0.00000', iconColor: '#F3BA2F' },
    { symbol: 'ADA', name: 'Cardano', balance: '$0.00', usdValue: '0.0ADA', iconColor: '#0033AD' },
    { symbol: 'USDT', name: 'Tether', balance: '12.00', usdValue: '12.06/USDT', iconColor: '#26A17B' },
    { symbol: 'DOGE', name: 'Dogecoin', balance: '0.00', usdValue: '0.00Doge', iconColor: '#C3A634' },
    { symbol: 'DGT', name: 'Digit', balance: '0.00', usdValue: '0.03DGT', iconColor: '#E91E63' },
    { symbol: 'XRP', name: 'Ripple', balance: '0.00', usdValue: '0.00XRP', iconColor: '#23292F' },
    { symbol: 'MATIC', name: 'Polygon', balance: '$0.00', usdValue: '0.00MATIC', iconColor: '#8247E5' },
    { symbol: 'AVAX', name: 'Avalanche', balance: '$0.00', usdValue: '0.00AVAX', iconColor: '#E84142' },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Receive Balance</h1>
        <p className="text-slate-400">Deposit cryptocurrency to your wallet</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Receive Form */}
        <div className="lg:col-span-2">
          <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              {/* Asset Selection */}
              <div className="space-y-2">
                <Label className="text-slate-300">Asset</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="USDT" className="text-white">USDT - Tether</SelectItem>
                    <SelectItem value="ETH" className="text-white">ETH - Ethereum</SelectItem>
                    <SelectItem value="BNB" className="text-white">BNB - Binance Coin</SelectItem>
                    <SelectItem value="BTC" className="text-white">BTC - Bitcoin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Network Selection */}
              <div className="space-y-2">
                <Label className="text-slate-300">Network</Label>
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {networks.map((network) => (
                      <SelectItem key={network.id} value={network.id} className="text-white">
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{network.name}</span>
                          <span className={network.fee === 'Low' ? 'text-green-400' : 'text-orange-400'}>
                            {network.fee} fee
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deposit Amount (Optional) */}
              <div className="space-y-2">
                <Label className="text-slate-300">Amount (Optional)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="bg-slate-900/50 border-slate-700 text-white pr-20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {selectedCrypto}
                  </div>
                </div>
              </div>

              {/* Deposit Address */}
              <div className="space-y-2">
                <Label className="text-slate-300">Deposit Address</Label>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <code className="text-blue-400 break-all">{depositAddress}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(depositAddress)}
                      className="text-slate-400 hover:text-white"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </Button>
                  </div>
                  
                  {/* QR Code Placeholder */}
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <div className="w-48 h-48 bg-slate-200 flex items-center justify-center">
                      <QrCode size={48} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-slate-300 whitespace-pre-line">{noteText}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleCopy(depositAddress)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Copy size={18} className="mr-2" />
                  {copied ? 'Copied!' : "I've sent the funds"}
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Download size={18} className="mr-2" />
                  Save QR
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Balance Section */}
        <div>
          <h2 className="text-white mb-4">Balance</h2>
          <div className="space-y-3">
            {cryptoBalances.slice(0, 6).map((crypto, index) => (
              <CryptoCard key={index} {...crypto} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Deposits */}
      <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
        <div className="p-6">
          <h2 className="text-white mb-4">Recent Deposits</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 pb-3">Asset</th>
                  <th className="text-left text-slate-400 pb-3">Amount</th>
                  <th className="text-left text-slate-400 pb-3">Network</th>
                  <th className="text-left text-slate-400 pb-3">Status</th>
                  <th className="text-left text-slate-400 pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asset: 'USDT', amount: '500.00', network: 'TRC20', status: 'Completed', time: '2 hours ago' },
                  { asset: 'ETH', amount: '0.5', network: 'ERC20', status: 'Pending', time: '5 hours ago' },
                  { asset: 'BNB', amount: '2.5', network: 'BEP20', status: 'Completed', time: '1 day ago' },
                ].map((deposit, index) => (
                  <tr key={index} className="border-b border-slate-800">
                    <td className="py-4 text-white">{deposit.asset}</td>
                    <td className="py-4 text-slate-300">{deposit.amount}</td>
                    <td className="py-4 text-slate-400">{deposit.network}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        deposit.status === 'Completed' 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400">{deposit.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
