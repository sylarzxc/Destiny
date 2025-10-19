import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Users, Trophy } from "lucide-react";

const usersData = [
  { rank: 1, wallet: "T6H9pcbTJy9b7c4cd", xpPoints: 2340, xpMultiplier: "1.8" },
  { rank: 2, wallet: "T6f2x5i6bTJf9M6749B", xpPoints: 1975, xpMultiplier: "1.6" },
  { rank: 3, wallet: "T33479kbTSJubaee5d", xpPoints: 1650, xpMultiplier: "1.4" },
  { rank: 4, wallet: "T76PG5dB5JsBJ36dd", xpPoints: 1229, xpMultiplier: "1.3" },
];

const teamsData = [
  { rank: 1, team: "Red Wallet", xpPoints: 6090, xpMultiplier: "2.0" },
  { rank: 2, team: "404 Validators", xpPoints: 4800, xpMultiplier: "1.8" },
  { rank: 3, team: "BRC69 Boomers", xpPoints: 3500, xpMultiplier: "1.6" },
  { rank: 4, team: "Solana Offline", xpPoints: 2200, xpMultiplier: "1.4" },
];

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"users" | "teams">("users");

  const renderLeaderboardCard = (type: "users" | "teams") => {
    const data = type === "users" ? usersData : teamsData;
    const title = type === "users" ? "Users's Leaderboard" : "Teams's Leaderboard";
    const isUser = type === "users";

    return (
      <motion.div
        initial={{ opacity: 0, x: isUser ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#0a1435]/90 to-[#050a1a]/90 backdrop-blur-xl rounded-2xl border border-[#1e3a5f]/40 overflow-hidden shadow-2xl shadow-purple-900/20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f1e3d] to-[#0a1435] px-6 py-4 border-b border-[#1e3a5f]/50">
          <h3 className="text-lg md:text-xl text-blue-200">{title}</h3>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="space-y-1">
            {/* Table Header */}
            <div className="grid grid-cols-[45px,1fr,85px,90px] gap-3 pb-3 mb-2 border-b border-[#1e3a5f]/30">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Rank</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{isUser ? "Wallet" : "Team"}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">XP Points</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">XP Multipler</div>
            </div>

            {/* Table Rows */}
            {data.map((item, idx) => (
              <motion.div
                key={item.rank}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-[45px,1fr,85px,90px] gap-3 py-3 hover:bg-[#1e3a5f]/10 rounded-lg transition-all group"
              >
                <div className={`text-sm flex items-center ${item.rank <= 3 ? "text-orange-400" : "text-gray-400"}`}>
                  {item.rank}
                </div>
                <div className={`text-sm text-gray-200 truncate flex items-center ${isUser ? "font-mono" : ""}`}>
                  {isUser ? (item as typeof usersData[0]).wallet : (item as typeof teamsData[0]).team}
                </div>
                <div className="text-sm text-gray-300 flex items-center">
                  {item.xpPoints}
                </div>
                <div className="text-sm text-gray-400 flex items-center">
                  {item.xpMultiplier}×
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030213] via-[#0a0520] to-[#030213]"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-4xl md:text-5xl mb-3 bg-gradient-to-r from-purple-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            Leaderboards
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
        </motion.div>

        {/* Mobile Toggle Buttons */}
        <div className="md:hidden flex gap-3 mb-6 max-w-md mx-auto">
          <Button
            onClick={() => setActiveTab("users")}
            variant="outline"
            className={`flex-1 gap-2 ${
              activeTab === "users"
                ? "bg-purple-600/20 border-purple-500 text-purple-300"
                : "bg-transparent border-[#1e3a5f] text-gray-400 hover:border-purple-500/50"
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </Button>
          <Button
            onClick={() => setActiveTab("teams")}
            variant="outline"
            className={`flex-1 gap-2 ${
              activeTab === "teams"
                ? "bg-blue-600/20 border-blue-500 text-blue-300"
                : "bg-transparent border-[#1e3a5f] text-gray-400 hover:border-blue-500/50"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Teams
          </Button>
        </div>

        {/* Desktop: Show both tables side by side */}
        <div className="hidden md:grid md:grid-cols-2 gap-5 md:gap-6 max-w-6xl mx-auto">
          {renderLeaderboardCard("users")}
          {renderLeaderboardCard("teams")}
        </div>

        {/* Mobile: Show only active table */}
        <div className="md:hidden max-w-md mx-auto">
          {renderLeaderboardCard(activeTab)}
        </div>
      </div>
    </section>
  );
}
