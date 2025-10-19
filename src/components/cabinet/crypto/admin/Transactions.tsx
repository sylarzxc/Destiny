import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye } from 'lucide-react';

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    { 
      id: 'TX#123456',
      user: 'User #12345',
      type: 'Stake',
      crypto: 'ETH',
      amount: '5.0',
      usdValue: '$9,500',
      status: 'Completed',
      date: '2024-02-15 14:30:25',
      hash: '0x7a8f9c2b1d4e6f8a...'
    },
    { 
      id: 'TX#123457',
      user: 'User #67890',
      type: 'Withdraw',
      crypto: 'USDT',
      amount: '1000',
      usdValue: '$1,000',
      status: 'Pending',
      date: '2024-02-15 14:25:10',
      hash: '0x3b5c7d9e1f2a4c6b...'
    },
    { 
      id: 'TX#123458',
      user: 'User #54321',
      type: 'Deposit',
      crypto: 'BNB',
      amount: '2.5',
      usdValue: '$750',
      status: 'Completed',
      date: '2024-02-15 14:15:42',
      hash: '0x9d8c7b6a5e4f3g2h...'
    },
    { 
      id: 'TX#123459',
      user: 'User #98765',
      type: 'Reward Claim',
      crypto: 'ETH',
      amount: '0.234',
      usdValue: '$445',
      status: 'Completed',
      date: '2024-02-15 14:00:18',
      hash: '0x1h2g3f4e5d6c7b8a...'
    },
    { 
      id: 'TX#123460',
      user: 'User #13579',
      type: 'Stake',
      crypto: 'MATIC',
      amount: '500',
      usdValue: '$450',
      status: 'Failed',
      date: '2024-02-15 13:45:55',
      hash: '0x8a9b7c6d5e4f3g2h...'
    },
  ];

  const stats = [
    { label: 'Total Transactions', value: '45,234', change: '+12.5%' },
    { label: 'Total Volume', value: '$125.4M', change: '+18.2%' },
    { label: 'Pending', value: '234', change: '-5.3%' },
    { label: 'Failed Today', value: '12', change: '+2.1%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Transactions</h1>
        <p className="text-purple-400">Monitor all platform transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="text-purple-400 mb-1">{stat.label}</div>
              <div className="text-white mb-1">{stat.value}</div>
              <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Transactions Table */}
      <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-purple-900/30 border-purple-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-800/50">
                <Filter size={18} className="mr-2" />
                Filters
              </Button>
              <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-800/50">
                <Download size={18} className="mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-700/30">
                  <th className="text-left text-purple-400 pb-3 px-4">TX ID</th>
                  <th className="text-left text-purple-400 pb-3">User</th>
                  <th className="text-left text-purple-400 pb-3">Type</th>
                  <th className="text-left text-purple-400 pb-3">Asset</th>
                  <th className="text-left text-purple-400 pb-3">Amount</th>
                  <th className="text-left text-purple-400 pb-3">USD Value</th>
                  <th className="text-left text-purple-400 pb-3">Status</th>
                  <th className="text-left text-purple-400 pb-3">Date</th>
                  <th className="text-left text-purple-400 pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-4 px-4 text-purple-300 font-mono text-sm">{tx.id}</td>
                    <td className="py-4 text-white">{tx.user}</td>
                    <td className="py-4 text-purple-300">{tx.type}</td>
                    <td className="py-4 text-white">{tx.crypto}</td>
                    <td className="py-4 text-purple-300">{tx.amount}</td>
                    <td className="py-4 text-green-400">{tx.usdValue}</td>
                    <td className="py-4">
                      <Badge className={
                        tx.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/50' :
                        tx.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/50' :
                        'bg-red-500/10 text-red-400 border-red-500/50'
                      }>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-purple-400 text-sm">{tx.date}</td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                        <Eye size={16} />
                      </Button>
                    </td>
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
