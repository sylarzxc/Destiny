import { Twitter, Github, MessageCircle, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030213] to-black"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
              <span className="text-xl tracking-wider">DESTINY</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              The next-generation DeFi platform for secure cryptocurrency staking. Earn rewards while retaining full control of your assets.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Staking</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Governance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Whitepaper</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2025 Destiny Network. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
