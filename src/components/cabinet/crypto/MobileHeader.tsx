import React from 'react';
import { Menu, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  onMenuClick: () => void;
  isAdmin?: boolean;
  user?: any;
  profile?: any;
  onLogout?: () => void;
}

export function MobileHeader({ onMenuClick, isAdmin, user, profile, onLogout }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800/50 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-slate-300 hover:text-white"
        >
          <Menu size={24} />
        </Button>

        {/* Logo */}
        <h1 className={`bg-gradient-to-r ${
          isAdmin 
            ? 'from-purple-400 to-pink-500' 
            : 'from-blue-400 to-purple-500'
        } bg-clip-text text-transparent`}>
          {isAdmin ? 'ADMIN' : 'DESTINY'}
        </h1>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
            <Settings size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
