import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowDownToLine, 
  Send, 
  Users, 
  Trophy, 
  HelpCircle,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isAdmin?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  user?: any;
  profile?: any;
  onLogout?: () => void;
}

export function Sidebar({ currentPage, onPageChange, isAdmin, isMobileOpen, onMobileClose, user, profile, onLogout }: SidebarProps) {
  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deposit', label: 'Deposit', icon: Wallet },
    { id: 'receive', label: 'Receive', icon: ArrowDownToLine },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const handleNavClick = (id: string) => {
    onPageChange(id);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 flex flex-col transition-all duration-300 z-50 w-64",
        // Desktop
        "hidden lg:flex",
        // Mobile
        isMobileOpen ? "flex" : "hidden lg:flex"
      )}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-800/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              DESTINY
            </h1>
            <p className="text-slate-500 mt-1">Hello, friend</p>
          </div>
          
          {/* Mobile close button */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 scrollable-container">
        {userMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <Icon size={20} className={isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400"} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800/50 space-y-2 flex-shrink-0">
        {isAdmin && (
          <button
            onClick={() => handleNavClick('admin')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              currentPage === 'admin'
                ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            )}
          >
            <Settings size={20} />
            <span>Admin</span>
          </button>
        )}
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-600/10 transition-all"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 text-xs text-slate-600 flex-shrink-0">
        <p>Copyright© 2025</p>
        <p>Destiny</p>
        <p className="text-slate-700">v2.0 | hello@destiny.io</p>
      </div>
    </div>
    </>
  );
}
