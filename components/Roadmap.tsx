import { CheckCircle2, Circle, Rocket, Sparkles, Globe, Coins } from "lucide-react";
import { motion } from "framer-motion";

const roadmapItems = [
  {
    quarter: "Q4 2024",
    title: "Platform Launch",
    status: "completed",
    icon: Rocket,
    items: [
      "Smart contract deployment",
      "Security audits completed",
      "Beta testing phase",
      "Community building",
    ],
  },
  {
    quarter: "Q1 2025",
    title: "Feature Expansion",
    status: "completed",
    icon: Sparkles,
    items: [
      "Mobile app release",
      "Multi-chain support",
      "Advanced analytics dashboard",
      "Referral program launch",
    ],
  },
  {
    quarter: "Q2 2025",
    title: "Global Growth",
    status: "active",
    icon: Globe,
    items: [
      "Strategic partnerships",
      "International expansion",
      "Governance token launch",
      "DAO implementation",
    ],
  },
  {
    quarter: "Q3 2025",
    title: "DeFi Integration",
    status: "upcoming",
    icon: Coins,
    items: [
      "Liquidity pool staking",
      "Yield farming options",
      "Cross-chain bridges",
      "NFT staking support",
    ],
  },
];

export function Roadmap() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030213] via-[#0a0520] to-[#030213]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Roadmap
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our journey to becoming the leading DeFi staking platform
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Connector line */}
                {idx < roadmapItems.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent z-0"></div>
                )}

                <div
                  className={`relative h-full bg-gradient-to-br from-[#1a1a2e]/80 to-[#0a0a1a]/80 backdrop-blur-xl rounded-2xl border p-6 transition-all ${
                    item.status === "completed"
                      ? "border-green-500/50 hover:border-green-500"
                      : item.status === "active"
                      ? "border-purple-500/50 hover:border-purple-500 shadow-lg shadow-purple-500/20"
                      : "border-white/10 hover:border-purple-500/30"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{item.quarter}</span>
                    {item.status === "completed" && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {item.status === "active" && (
                      <div className="relative">
                        <Circle className="w-5 h-5 text-purple-500 animate-pulse" />
                        <div className="absolute inset-0 bg-purple-500 rounded-full blur-md animate-pulse"></div>
                      </div>
                    )}
                    {item.status === "upcoming" && (
                      <Circle className="w-5 h-5 text-gray-600" />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 ${
                      item.status === "completed"
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : item.status === "active"
                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                        : "bg-gradient-to-br from-gray-600 to-gray-700"
                    }`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl mb-4">{item.title}</h3>

                  {/* Items */}
                  <ul className="space-y-2">
                    {item.items.map((subItem, subIdx) => (
                      <li key={subIdx} className="flex items-start gap-2 text-sm text-gray-400">
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                            item.status === "completed"
                              ? "bg-green-500"
                              : item.status === "active"
                              ? "bg-purple-500"
                              : "bg-gray-600"
                          }`}
                        ></div>
                        <span>{subItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
