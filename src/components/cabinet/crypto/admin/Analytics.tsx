import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { Line, LineChart, Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

export function Analytics() {
  const revenueData = [
    { month: 'Jan', revenue: 850000, expenses: 320000 },
    { month: 'Feb', revenue: 920000, expenses: 340000 },
    { month: 'Mar', revenue: 1050000, expenses: 380000 },
    { month: 'Apr', revenue: 980000, expenses: 360000 },
    { month: 'May', revenue: 1150000, expenses: 390000 },
    { month: 'Jun', revenue: 1200000, expenses: 420000 },
  ];

  const userActivityData = [
    { day: 'Mon', active: 8200, new: 150 },
    { day: 'Tue', active: 8500, new: 180 },
    { day: 'Wed', active: 9100, new: 210 },
    { day: 'Thu', active: 8800, new: 170 },
    { day: 'Fri', active: 9500, new: 240 },
    { day: 'Sat', active: 7800, new: 120 },
    { day: 'Sun', active: 7200, new: 90 },
  ];

  const assetDistribution = [
    { name: 'ETH', value: 18500000, color: '#627EEA' },
    { name: 'USDT', value: 12300000, color: '#26A17B' },
    { name: 'BNB', value: 8700000, color: '#F3BA2F' },
    { name: 'MATIC', value: 5700000, color: '#8247E5' },
  ];

  const metrics = [
    { label: 'Revenue Growth', value: '+24.5%', trend: 'up', icon: TrendingUp },
    { label: 'User Retention', value: '87.3%', trend: 'up', icon: Users },
    { label: 'Avg. Stake Size', value: '$3,892', trend: 'up', icon: DollarSign },
    { label: 'Churn Rate', value: '2.1%', trend: 'down', icon: TrendingDown },
  ];

  const topPerformers = [
    { metric: 'Highest Staking Pool', value: 'ETH Staking', amount: '$18.5M TVL' },
    { metric: 'Most Active Day', value: 'Friday', amount: '9,500 users' },
    { metric: 'Best Conversion', value: 'Referral Program', amount: '34% rate' },
    { metric: 'Top Revenue Source', value: 'Staking Fees', amount: '$890K/month' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Analytics & Insights</h1>
        <p className="text-purple-400">Deep dive into platform performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-600/20">
                    <Icon className={metric.trend === 'up' ? 'text-green-400' : 'text-red-400'} size={24} />
                  </div>
                </div>
                <div className="text-purple-400 mb-1">{metric.label}</div>
                <div className="text-white">{metric.value}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-white mb-4">Revenue vs Expenses</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" stroke="#9333EA" />
                  <YAxis stroke="#9333EA" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2E1065', 
                      border: '1px solid #6B21A8',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* User Activity */}
        <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-white mb-4">Daily User Activity</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <XAxis dataKey="day" stroke="#9333EA" />
                  <YAxis stroke="#9333EA" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2E1065', 
                      border: '1px solid #6B21A8',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="active" fill="#A855F7" radius={[8, 8, 0, 0]} name="Active Users" />
                  <Bar dataKey="new" fill="#EC4899" radius={[8, 8, 0, 0]} name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Asset Distribution */}
        <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-white mb-4">TVL Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2E1065', 
                      border: '1px solid #6B21A8',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="lg:col-span-2 bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-white mb-4">Top Performers</h2>
            <div className="space-y-4">
              {topPerformers.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                  <div>
                    <div className="text-purple-400 text-sm mb-1">{item.metric}</div>
                    <div className="text-white">{item.value}</div>
                  </div>
                  <div className="text-green-400">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-white mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-400 text-sm">Visits</span>
                  <span className="text-white text-sm">100%</span>
                </div>
                <div className="w-full bg-purple-900/30 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-400 text-sm">Sign Ups</span>
                  <span className="text-white text-sm">45%</span>
                </div>
                <div className="w-full bg-purple-900/30 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-400 text-sm">First Stake</span>
                  <span className="text-white text-sm">28%</span>
                </div>
                <div className="w-full bg-purple-900/30 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-white mb-4">Geographic Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-300">United States</span>
                <span className="text-white">32%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Europe</span>
                <span className="text-white">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Asia</span>
                <span className="text-white">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Other</span>
                <span className="text-white">15%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-white mb-4">Platform Health</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-400 text-sm">Uptime</span>
                  <span className="text-green-400 text-sm">99.9%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-400 text-sm">API Response</span>
                  <span className="text-green-400 text-sm">125ms</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-400 text-sm">Error Rate</span>
                  <span className="text-green-400 text-sm">0.02%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-400 text-sm">Satisfaction</span>
                  <span className="text-green-400 text-sm">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
