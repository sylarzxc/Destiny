import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TrendingUp, Shield, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: TrendingUp,
    text: "High returns on every stake",
  },
  {
    icon: Shield,
    text: "Secure & transparent platform",
  },
  {
    icon: Clock,
    text: "Flexible terms tailored to you",
  },
];

const periods = [
  { days: 30 },
  { days: 90 },
  { days: 180 },
];

type StakingType = "locked" | "flexible";

type TokenConfig = {
  id: string;
  symbol: string;
  name: string;
  imagePath: string; // expected under /public/assets
  // Annual percentage yields for locked staking by period
  lockedApy: Record<30 | 90 | 180, number>;
  // Flexible APY (annualized)
  flexibleApy: number;
};

// You can replace these values with the exact ones from v0.1 scripts later.
// For now we provide realistic placeholders that keep proportionality.
const tokens: TokenConfig[] = [
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    imagePath: "/assets/token-btc.png",
    lockedApy: { 30: 4.2, 90: 6.0, 180: 9.5 },
    flexibleApy: 2.0,
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    imagePath: "/assets/token-eth.png",
    lockedApy: { 30: 4.8, 90: 6.8, 180: 10.5 },
    flexibleApy: 2.2,
  },
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    imagePath: "/assets/token-usdt.png",
    lockedApy: { 30: 6.0, 90: 8.5, 180: 12.0 },
    flexibleApy: 3.0,
  },
  {
    id: "bnb",
    symbol: "BNB",
    name: "BNB",
    imagePath: "/assets/token-bnb.png",
    lockedApy: { 30: 4.0, 90: 6.2, 180: 9.0 },
    flexibleApy: 1.8,
  },
  {
    id: "avax",
    symbol: "AVAX",
    name: "Avalanche",
    imagePath: "/assets/token-avax.png",
    lockedApy: { 30: 5.0, 90: 7.2, 180: 10.8 },
    flexibleApy: 2.5,
  },
  {
    id: "doge",
    symbol: "DOGE",
    name: "Dogecoin",
    imagePath: "/assets/token-doge.png",
    lockedApy: { 30: 3.5, 90: 5.0, 180: 7.5 },
    flexibleApy: 1.2,
  },
  {
    id: "ada",
    symbol: "ADA",
    name: "Cardano",
    imagePath: "/assets/token-ada.png",
    lockedApy: { 30: 3.8, 90: 5.6, 180: 8.4 },
    flexibleApy: 1.6,
  },
  {
    id: "matic",
    symbol: "MATIC",
    name: "Polygon",
    imagePath: "/assets/token-matic.png",
    lockedApy: { 30: 4.1, 90: 6.1, 180: 9.1 },
    flexibleApy: 1.9,
  },
  {
    id: "dot",
    symbol: "DOT",
    name: "Polkadot",
    imagePath: "/assets/token-dot.png",
    lockedApy: { 30: 4.4, 90: 6.5, 180: 9.8 },
    flexibleApy: 2.1,
  },
  {
    id: "xrp",
    symbol: "XRP",
    name: "Ripple",
    imagePath: "/assets/token-xrp.png",
    lockedApy: { 30: 3.2, 90: 4.9, 180: 7.3 },
    flexibleApy: 1.3,
  },
];

const cryptoIcons = tokens;

export function StakingCalculator() {
  const [selectedPeriod, setSelectedPeriod] = useState<30 | 90 | 180>(30);
  const [stakingType, setStakingType] = useState<StakingType>("locked");
  const [amount, setAmount] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState<string>(tokens[2].id); // default USDT

  const selectedToken = tokens.find((t) => t.id === selectedTokenId) ?? tokens[0];

  const calculateReturns = () => {
    const amt = parseFloat(amount) || 0;
    const apy =
      stakingType === "locked"
        ? selectedToken.lockedApy[selectedPeriod]
        : selectedToken.flexibleApy;

    const yearlyReturn = (amt * apy) / 100;
    const dailyReturn = yearlyReturn / 365;
    const days = stakingType === "locked" ? selectedPeriod : 30; // flexible shows 30d projection
    const periodReturn = dailyReturn * days;

    return {
      daily: dailyReturn,
      total: periodReturn,
    };
  };

  const { daily, total } = calculateReturns();

  return (
    <section className="py-4 md:py-16 relative overflow-hidden">
      {/* Smooth transition gradient from top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#030213] via-[#030213]/50 to-transparent pointer-events-none"></div>

      {/* Background matching Leaderboard section exactly */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030213] via-[#0a0520] to-[#030213]">
        {/* Static stars */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto rounded-xl md:rounded-3xl border p-4 md:p-6 backdrop-blur-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-[rgba(13,27,42,0.6)] border-[rgba(93,118,247,0.3)]">
          
          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            {/* Mobile Header */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Calculate your income</h3>
              <p className="text-sm text-[#8a8fa7] leading-relaxed">
                Estimate your potential earnings easily. Adjust the settings and see how your profit changes!
              </p>
            </div>

            {/* Mobile Token Selection */}
            <div className="space-y-3">
              <div className="text-xs text-[#8a8fa7] font-medium text-center">Select Token</div>
              <div className="flex gap-2 overflow-x-auto pb-2 pt-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {cryptoIcons.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => setSelectedTokenId(token.id)}
                    className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition-all duration-75 ease-out shadow-lg hover:shadow-xl flex-shrink-0 ${
                      selectedTokenId === token.id
                        ? "ring-[#5d76f7] scale-110 shadow-[0_0_20px_rgba(93,118,247,0.5)] bg-[rgba(93,118,247,0.1)]"
                        : "ring-white/20 hover:ring-white/40 hover:scale-105 hover:bg-[rgba(255,255,255,0.05)]"
                    }`}
                    aria-label={token.symbol}
                  >
                    <ImageWithFallback
                      src={token.imagePath}
                      alt={token.symbol}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Period Selection */}
            <div className="space-y-3">
              <div className="text-xs text-[#8a8fa7] font-medium text-center">Select Period</div>
              <div className="grid grid-cols-3 gap-3">
                {periods.map((period) => (
                  <button
                    key={period.days}
                    onClick={() => setSelectedPeriod(period.days as 30 | 90 | 180)}
                    className={`h-16 rounded-xl transition-all duration-75 ease-out border-2 ${
                      selectedPeriod === period.days
                        ? "bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] text-[#0b1020] border-transparent shadow-[0_8px_25px_rgba(93,118,247,0.4)] transform scale-105"
                        : "bg-[rgba(93,118,247,0.08)] border-[rgba(93,118,247,0.3)] hover:border-[rgba(93,118,247,0.6)] hover:bg-[rgba(93,118,247,0.15)] hover:scale-102"
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{period.days}</div>
                    <div className="text-xs text-[#8a8fa7] font-medium">days</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Calculator */}
            <div className="w-full bg-[rgba(13,27,42,0.55)] border border-[rgba(93,118,247,0.18)] rounded-xl p-4 shadow-[0_8px_26px_rgba(5,10,28,0.45)]">
              {/* Staking Type Toggle */}
              <div className="flex gap-2 mb-4 border-2 border-[rgba(93,118,247,0.3)] rounded-xl overflow-hidden bg-[rgba(13,27,42,0.3)]">
                <Button
                  onClick={() => setStakingType("locked")}
                  variant="outline"
                  className={`flex-1 gap-2 text-sm font-medium rounded-lg border-none transition-all duration-75 ease-out ${
                    stakingType === "locked"
                      ? "bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] text-[#0b1020] shadow-[0_4px_15px_rgba(93,118,247,0.3)]"
                      : "bg-transparent text-[#5d76f7] hover:bg-[rgba(93,118,247,0.1)] hover:text-white"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Locked
                </Button>
                <Button
                  onClick={() => setStakingType("flexible")}
                  variant="outline"
                  className={`flex-1 gap-2 text-sm font-medium rounded-lg border-none transition-all duration-75 ease-out ${
                    stakingType === "flexible"
                      ? "bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] text-[#0b1020] shadow-[0_4px_15px_rgba(93,118,247,0.3)]"
                      : "bg-transparent text-[#5d76f7] hover:bg-[rgba(93,118,247,0.1)] hover:text-white"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Flexible
                </Button>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="h-12 pr-20 text-base placeholder:text-[#8a8fa7] bg-[rgba(13,27,42,0.8)] border-2 border-[rgba(93,118,247,0.3)] focus:border-[#5d76f7] focus:ring-2 focus:ring-[#5d76f7]/20 rounded-xl transition-all duration-75 ease-out [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold uppercase text-transparent bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] bg-clip-text border-2 border-[rgba(93,118,247,0.3)] rounded-lg px-3 py-1 backdrop-blur-[10px]">
                    {selectedToken.symbol}
                  </span>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-3 mb-4">
                <div className="rounded-xl p-3 transition-all duration-75 ease-out hover:bg-gradient-to-r hover:from-[rgba(93,118,247,0.15)] hover:to-[rgba(156,72,236,0.15)]">
                  <div className="text-xs text-[#8a8fa7] mb-1 font-medium">per 1 day</div>
                  <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] transition-all duration-75 ease-out">{daily.toFixed(2)} ({selectedToken.symbol})</div>
                </div>
                {stakingType === "locked" && (
                  <div className="rounded-xl p-3 transition-all duration-75 ease-out hover:bg-gradient-to-r hover:from-[rgba(93,118,247,0.15)] hover:to-[rgba(156,72,236,0.15)]">
                    <div className="text-xs text-[#8a8fa7] mb-1 font-medium">Total return</div>
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] transition-all duration-75 ease-out">{total.toFixed(2)} ({selectedToken.symbol})</div>
                  </div>
                )}
              </div>

              {/* Calculate Button */}
              <Button className="w-full h-12 text-white font-bold text-base bg-gradient-to-r from-[#e67e22] to-[#b84fd9] hover:opacity-90 shadow-[0_8px_25px_rgba(230,126,34,0.3)] rounded-xl transition-all duration-75 ease-out hover:scale-105 hover:shadow-[0_12px_35px_rgba(230,126,34,0.4)]">
                Calculate
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid items-center justify-center gap-6 md:gap-8 lg:grid-cols-[1.5fr_0.6fr_0.8fr_2fr]">
              {/* Left Column - Info */}
              <div className="lg:block hidden self-center">
                <h3 className="text-[2.6rem] leading-tight mb-14">Calculate your income</h3>
                <p className="text-[#8a8fa7] text-base mb-8 leading-relaxed max-w-[340px]">
                  Estimate your potential earnings easily. Adjust the settings and see how your profit changes!
                </p>

                <div className="space-y-4 mb-8">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] shadow-[0_3px_10px_rgba(93,118,247,0.4)] flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-base text-[#c7cce3]">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Column - Crypto Icons */}
              <div className="flex lg:flex-col flex-row items-center justify-center gap-3 lg:max-h-[440px] lg:overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent self-center">
                <div className="text-xs text-[#8a8fa7] mb-2 lg:block hidden font-medium">Select Token</div>
                {cryptoIcons.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => setSelectedTokenId(token.id)}
                    className={`w-8 h-8 rounded-full overflow-hidden ring-2 transition-all duration-75 ease-out shadow-lg hover:shadow-xl ${
                      selectedTokenId === token.id 
                        ? "ring-[#5d76f7] scale-110 shadow-[0_0_20px_rgba(93,118,247,0.5)] bg-[rgba(93,118,247,0.1)]" 
                        : "ring-white/20 hover:ring-white/40 hover:scale-105 hover:bg-[rgba(255,255,255,0.05)]"
                    }`}
                    aria-label={token.symbol}
                  >
                    <ImageWithFallback 
                      src={token.imagePath} 
                      alt={token.symbol} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>

              {/* Third Column - Period Selection */}
              <div className="flex lg:flex-col flex-row items-center justify-center gap-3 md:gap-4 self-center">
                {periods.map((period) => (
                  <button
                    key={period.days}
                    onClick={() => setSelectedPeriod(period.days as 30 | 90 | 180)}
                    className={`w-full lg:max-w-[180px] h-20 md:h-24 rounded-xl md:rounded-2xl transition-all duration-75 ease-out border-2 ${
                      selectedPeriod === period.days
                        ? "bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] text-[#0b1020] border-transparent shadow-[0_8px_25px_rgba(93,118,247,0.4)] transform scale-105"
                        : "bg-[rgba(93,118,247,0.08)] border-[rgba(93,118,247,0.3)] hover:border-[rgba(93,118,247,0.6)] hover:bg-[rgba(93,118,247,0.15)] hover:scale-102"
                    }`}
                  >
                    <div className="text-3xl md:text-4xl font-bold mb-1">{period.days}</div>
                    <div className="text-xs md:text-sm text-[#8a8fa7] font-medium">days</div>
                  </button>
                ))}
              </div>

              {/* Fourth Column - Calculator */}
              <div className="w-full bg-[rgba(13,27,42,0.55)] border border-[rgba(93,118,247,0.18)] rounded-xl p-4 md:p-6 shadow-[0_8px_26px_rgba(5,10,28,0.45)] self-center">
                {/* Title on Mobile */}
                <h3 className="text-2xl mb-4 lg:hidden">Calculate your income</h3>
                
                {/* Staking Type Toggle */}
                <div className="flex gap-2 md:gap-3 mb-4 md:mb-6 border-2 border-[rgba(93,118,247,0.3)] rounded-xl overflow-hidden bg-[rgba(13,27,42,0.3)]">
                  <Button
                    onClick={() => setStakingType("locked")}
                    variant="outline"
                    className={`flex-1 gap-2 text-sm font-medium rounded-lg border-none transition-all duration-75 ease-out ${
                      stakingType === "locked"
                        ? "bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] text-[#0b1020] shadow-[0_4px_15px_rgba(93,118,247,0.3)]"
                        : "bg-transparent text-[#5d76f7] hover:bg-[rgba(93,118,247,0.1)] hover:text-white"
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    Locked Staking
                  </Button>
                  <Button
                    onClick={() => setStakingType("flexible")}
                    variant="outline"
                    className={`flex-1 gap-2 text-sm font-medium rounded-lg border-none transition-all duration-75 ease-out ${
                      stakingType === "flexible"
                        ? "bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] text-[#0b1020] shadow-[0_4px_15px_rgba(93,118,247,0.3)]"
                        : "bg-transparent text-[#5d76f7] hover:bg-[rgba(93,118,247,0.1)] hover:text-white"
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    Flexible Staking
                  </Button>
                </div>

                {/* Amount Input */}
                <div className="mb-4 md:mb-6">
                  <div className="relative">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="h-12 md:h-14 pr-20 text-base md:text-lg placeholder:text-[#8a8fa7] bg-[rgba(13,27,42,0.8)] border-2 border-[rgba(93,118,247,0.3)] focus:border-[#5d76f7] focus:ring-2 focus:ring-[#5d76f7]/20 rounded-xl transition-all duration-75 ease-out [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold uppercase text-transparent bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] bg-clip-text border-2 border-[rgba(93,118,247,0.3)] rounded-lg px-3 py-1 backdrop-blur-[10px]">
                      {selectedToken.symbol}
                    </span>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="rounded-xl p-4 md:p-5 transition-all duration-75 ease-out hover:bg-gradient-to-r hover:from-[rgba(93,118,247,0.15)] hover:to-[rgba(156,72,236,0.15)]">
                    <div className="text-sm text-[#8a8fa7] mb-2 font-medium">per 1 day</div>
                    <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] transition-all duration-75 ease-out">{daily.toFixed(2)} ({selectedToken.symbol})</div>
                  </div>
                  {stakingType === "locked" && (
                    <div className="rounded-xl p-4 md:p-5 transition-all duration-75 ease-out hover:bg-gradient-to-r hover:from-[rgba(93,118,247,0.15)] hover:to-[rgba(156,72,236,0.15)]">
                      <div className="text-sm text-[#8a8fa7] mb-2 font-medium">Total return</div>
                      <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#5d76f7] to-[#9c48ec] transition-all duration-75 ease-out">{total.toFixed(2)} ({selectedToken.symbol})</div>
                    </div>
                  )}
                </div>

                {/* Calculate Button */}
                <Button className="w-full h-12 md:h-14 text-white font-bold text-lg bg-gradient-to-r from-[#e67e22] to-[#b84fd9] hover:opacity-90 shadow-[0_8px_25px_rgba(230,126,34,0.3)] rounded-xl transition-all duration-75 ease-out hover:scale-105 hover:shadow-[0_12px_35px_rgba(230,126,34,0.4)]">
                  Calculate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}