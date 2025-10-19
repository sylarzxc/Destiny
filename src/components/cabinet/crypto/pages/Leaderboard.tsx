import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Leaderboard() {
  const topStakers = [
    { rank: 1, user: 'CryptoKing', totalStaked: '$250,000', rewards: '$32,500', referrals: 45, badge: 'Diamond' },
    { rank: 2, user: 'MoonWalker', totalStaked: '$180,000', rewards: '$23,400', referrals: 32, badge: 'Platinum' },
    { rank: 3, user: 'HODLMaster', totalStaked: '$150,000', rewards: '$19,500', referrals: 28, badge: 'Platinum' },
    { rank: 4, user: 'StakeQueen', totalStaked: '$120,000', rewards: '$15,600', referrals: 24, badge: 'Gold' },
    { rank: 5, user: 'YieldFarmer', totalStaked: '$95,000', rewards: '$12,350', referrals: 20, badge: 'Gold' },
    { rank: 6, user: 'DefiLord', totalStaked: '$85,000', rewards: '$11,050', referrals: 18, badge: 'Gold' },
    { rank: 7, user: 'TokenMaster', totalStaked: '$72,000', rewards: '$9,360', referrals: 15, badge: 'Silver' },
    { rank: 8, user: 'StakingPro', totalStaked: '$65,000', rewards: '$8,450', referrals: 14, badge: 'Silver' },
    { rank: 9, user: 'CryptoNinja', totalStaked: '$58,000', rewards: '$7,540', referrals: 12, badge: 'Silver' },
    { rank: 10, user: 'BlockchainBoss', totalStaked: '$52,000', rewards: '$6,760', referrals: 11, badge: 'Silver' },
  ];

  const categories = [
    { name: 'Top Stakers', icon: Trophy, color: 'text-yellow-400' },
    { name: 'Top Earners', icon: TrendingUp, color: 'text-green-400' },
    { name: 'Top Referrers', icon: Users, color: 'text-blue-400' },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Diamond': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'Platinum': return 'bg-slate-300/20 text-slate-300 border-slate-300/50';
      case 'Gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Silver': return 'bg-slate-400/20 text-slate-400 border-slate-400/50';
      default: return 'bg-bronze-500/20 text-bronze-400 border-bronze-500/50';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-400" size={24} />;
    if (rank === 2) return <Medal className="text-slate-300" size={24} />;
    if (rank === 3) return <Award className="text-orange-400" size={24} />;
    return <span className="text-slate-400">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Leaderboard</h1>
        <p className="text-slate-400">See who's leading in staking and earning rewards</p>
      </div>

      {/* Your Stats */}
      <Card className="bg-referral-gradient border-blue-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-2">Your Ranking</h2>
              <div className="flex items-center gap-4">
                <div className="text-slate-300">
                  <span className="text-slate-400">Rank:</span>{' '}
                  <span className="text-blue-400">#47</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Total Staked:</span>{' '}
                  <span className="text-white">$32,100</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Rewards:</span>{' '}
                  <span className="text-green-400">$2,847</span>
                </div>
              </div>
            </div>
            <Badge className={getBadgeColor('Silver')}>
              Silver Member
            </Badge>
          </div>
        </div>
      </Card>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={index}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                index === 0
                  ? 'bg-slate-800/50 border-blue-500/30 text-white'
                  : 'bg-slate-900/30 border-slate-700 text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={18} className={index === 0 ? category.color : ''} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 2nd Place */}
        <Card className="bg-moonwalker border-slate-700/50 backdrop-blur-sm">
          <div className="h-48 flex flex-col items-center justify-end p-4 md:p-6">
            <div className="mb-3 md:mb-4">
              <Medal className="text-slate-300" size={32} />
            </div>
            <div className="text-white mb-1 text-center text-sm md:text-base">{topStakers[1].user}</div>
            <Badge className={`${getBadgeColor(topStakers[1].badge)} text-xs`}>
              {topStakers[1].badge}
            </Badge>
            <div className="text-slate-400 mt-2 md:mt-3 text-sm">{topStakers[1].totalStaked}</div>
            <div className="text-green-400 text-xs md:text-sm">+{topStakers[1].rewards}</div>
          </div>
        </Card>

        {/* 1st Place */}
        <Card className="bg-diamond border-yellow-500/30 backdrop-blur-sm">
          <div className="h-56 flex flex-col items-center justify-end p-4 md:p-6">
            <div className="mb-3 md:mb-4">
              <Trophy className="text-yellow-400" size={40} />
            </div>
            <div className="text-white mb-1 text-center text-sm md:text-base">{topStakers[0].user}</div>
            <Badge className={`${getBadgeColor(topStakers[0].badge)} text-xs`}>
              {topStakers[0].badge}
            </Badge>
            <div className="text-slate-400 mt-2 md:mt-3 text-sm">{topStakers[0].totalStaked}</div>
            <div className="text-green-400 text-xs md:text-sm">+{topStakers[0].rewards}</div>
          </div>
        </Card>

        {/* 3rd Place */}
        <Card className="bg-platinum border-slate-700/50 backdrop-blur-sm">
          <div className="h-48 flex flex-col items-center justify-center p-4 md:p-6">
            <div className="mb-3 md:mb-4">
              <Award className="text-orange-400" size={28} />
            </div>
            <div className="text-white mb-1 text-center text-sm md:text-base">{topStakers[2].user}</div>
            <Badge className={`${getBadgeColor(topStakers[2].badge)} text-xs`}>
              {topStakers[2].badge}
            </Badge>
            <div className="text-slate-400 mt-2 md:mt-3 text-sm">{topStakers[2].totalStaked}</div>
            <div className="text-green-400 text-xs md:text-sm">+{topStakers[2].rewards}</div>
          </div>
        </Card>
      </div>

      {/* Full Leaderboard */}
      <Card className="bg-cabinet-card-gradient border-slate-700/50 backdrop-blur-sm">
        <div className="p-6">
          <h2 className="text-white mb-4">All Rankings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 pb-3 px-4">Rank</th>
                  <th className="text-left text-slate-400 pb-3">User</th>
                  <th className="text-left text-slate-400 pb-3">Badge</th>
                  <th className="text-left text-slate-400 pb-3">Total Staked</th>
                  <th className="text-left text-slate-400 pb-3">Rewards Earned</th>
                  <th className="text-left text-slate-400 pb-3">Referrals</th>
                </tr>
              </thead>
              <tbody>
                {topStakers.map((staker) => (
                  <tr 
                    key={staker.rank} 
                    className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${
                      staker.rank <= 3 ? 'bg-slate-800/20' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {staker.rank <= 3 ? (
                          getRankIcon(staker.rank)
                        ) : (
                          <span className="text-slate-400">#{staker.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-white">{staker.user}</td>
                    <td className="py-4">
                      <Badge className={getBadgeColor(staker.badge)}>
                        {staker.badge}
                      </Badge>
                    </td>
                    <td className="py-4 text-slate-300">{staker.totalStaked}</td>
                    <td className="py-4 text-green-400">{staker.rewards}</td>
                    <td className="py-4 text-blue-400">{staker.referrals}</td>
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
