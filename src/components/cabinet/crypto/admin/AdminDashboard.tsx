import { Card } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12.5%', trend: 'up', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Value Locked', value: '$45.2M', change: '+18.2%', trend: 'up', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { label: 'Active Stakes', value: '8,234', change: '+8.3%', trend: 'up', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: 'Platform Revenue', value: '$1.2M', change: '+24.1%', trend: 'up', icon: Activity, color: 'from-orange-500 to-yellow-500' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 850000, users: 9200 },
    { month: 'Feb', revenue: 920000, users: 9800 },
    { month: 'Mar', revenue: 1050000, users: 10500 },
    { month: 'Apr', revenue: 980000, users: 11000 },
    { month: 'May', revenue: 1150000, users: 11800 },
    { month: 'Jun', revenue: 1200000, users: 12458 },
  ];

  const topPools = [
    { name: 'ETH Staking', tvl: '$18.5M', apy: '12.5%', users: 3200, status: 'Active' },
    { name: 'USDT Staking', tvl: '$12.3M', apy: '8.5%', users: 2800, status: 'Active' },
    { name: 'BNB Staking', tvl: '$8.7M', apy: '15.2%', users: 1500, status: 'Active' },
    { name: 'MATIC Staking', tvl: '$5.7M', apy: '14.3%', users: 1200, status: 'Active' },
  ];

  const recentActivity = [
    { user: 'User #12345', action: 'Staked 5.0 ETH', amount: '$9,500', time: '2 min ago', type: 'stake' },
    { user: 'User #67890', action: 'Withdrew 1000 USDT', amount: '$1,000', time: '5 min ago', type: 'withdraw' },
    { user: 'User #54321', action: 'Claimed rewards', amount: '$234', time: '12 min ago', type: 'claim' },
    { user: 'User #98765', action: 'Staked 2.5 BNB', amount: '$750', time: '18 min ago', type: 'stake' },
    { user: 'User #13579', action: 'New registration', amount: '-', time: '25 min ago', type: 'register' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Admin Dashboard</h1>
        <p className="text-purple-400">Platform overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="text-purple-400 mb-1">{stat.label}</div>
                <div className="text-white">{stat.value}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-white mb-4">Platform Revenue</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#A855F7" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* User Growth */}
        <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-white mb-4">User Growth</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
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
                  <Bar dataKey="users" fill="#A855F7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Staking Pools */}
        <div className="lg:col-span-2">
          <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-white mb-4">Top Staking Pools</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-700/30">
                      <th className="text-left text-purple-400 pb-3">Pool</th>
                      <th className="text-left text-purple-400 pb-3">TVL</th>
                      <th className="text-left text-purple-400 pb-3">APY</th>
                      <th className="text-left text-purple-400 pb-3">Users</th>
                      <th className="text-left text-purple-400 pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPools.map((pool, index) => (
                      <tr key={index} className="border-b border-purple-800/30">
                        <td className="py-4 text-white">{pool.name}</td>
                        <td className="py-4 text-purple-300">{pool.tvl}</td>
                        <td className="py-4 text-green-400">{pool.apy}</td>
                        <td className="py-4 text-purple-300">{pool.users}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                            {pool.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="bg-admin-card-gradient border-purple-700/30 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-4 border-b border-purple-800/30 last:border-0">
                    <div className="text-white text-sm mb-1">{activity.user}</div>
                    <div className="text-purple-400 text-sm mb-1">{activity.action}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-500 text-xs">{activity.time}</span>
                      {activity.amount !== '-' && (
                        <span className="text-green-400 text-sm">{activity.amount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
