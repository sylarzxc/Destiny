import { Shield, Zap, TrendingUp, Lock, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your assets are protected by multi-layer security protocols and smart contract audits",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "High APY Returns",
    description: "Earn up to 12% annual percentage yield on your staked cryptocurrency",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Instant Rewards",
    description: "Receive daily rewards automatically distributed to your wallet",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Lock,
    title: "Flexible Locking",
    description: "Choose between flexible and locked staking periods that suit your needs",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of users who trust Destiny Network for their staking needs",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track your earnings and portfolio performance with advanced analytics",
    color: "from-indigo-500 to-purple-500",
  },
];

export function WhyDestiny() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030213] via-[#0a0520] to-[#030213]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            WHY DESTINY NETWORK
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the future of decentralized staking with cutting-edge features designed for your success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="h-full bg-gradient-to-br from-[#1a1a2e]/80 to-[#0a0a1a]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/50 transition-all">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity blur-xl`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-16"
        >
          {[
            { value: "$2.4M+", label: "Total Value Locked" },
            { value: "15K+", label: "Active Stakers" },
            { value: "12%", label: "Max APY" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/50 transition-all"
            >
              <div className="text-3xl md:text-4xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
