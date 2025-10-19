import { motion } from "framer-motion";

const sponsors = [
  "COINBASE VENTURES",
  "FABRIC VENTURES",
  "FRAMEWORK",
  "ROBOT VENTURES",
  "WINTERMUTE",
  "AMBER",
  "BREVAN HOWARD",
  "COINBASE VENTURES",
  "FABRIC VENTURES",
  "FRAMEWORK",
  "ROBOT VENTURES",
  "WINTERMUTE",
];

export function SponsorsMarquee() {
  return (
    <section className="py-16 relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-[#030213] via-[#0a0520] to-[#030213]"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 uppercase tracking-widest">Trusted by leading investors</p>
        </div>

        {/* Scrolling marquee */}
        <div className="relative overflow-hidden">
          <div className="flex">
            <motion.div
              className="flex gap-12 pr-12"
              animate={{
                x: [0, -50 + "%"],
              }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              {sponsors.map((sponsor, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 text-gray-500 hover:text-white transition-colors text-sm md:text-base tracking-widest whitespace-nowrap"
                >
                  {sponsor}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030213] to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030213] to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
