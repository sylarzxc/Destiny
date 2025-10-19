import { 
  LayoutDashboard, 
  Users, 
  ArrowRightLeft, 
  Database, 
  BarChart3, 
  Settings,
  ChevronLeft,
  X
} from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface AdminSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onClose: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ currentPage, onPageChange, onClose, isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Users Management', icon: Users },
    { id: 'admin-transactions', label: 'Transactions', icon: ArrowRightLeft },
    { id: 'admin-pools', label: 'Staking Pools', icon: Database },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
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
        "fixed top-0 left-0 h-full bg-gradient-to-b from-purple-900 via-purple-900 to-purple-950 border-r border-purple-800/50 flex flex-col w-64 transition-all duration-300 z-50",
        // Desktop
        "hidden lg:flex",
        // Mobile
        isMobileOpen ? "flex" : "hidden lg:flex"
      )}>
      {/* Header */}
      <div className="p-6 border-b border-purple-800/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              ADMIN PANEL
            </h1>
            <p className="text-purple-400 mt-1">Administrator</p>
          </div>
          
          {/* Mobile close button */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-purple-400" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 scrollable-container">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white" 
                  : "text-purple-400 hover:bg-purple-800/50 hover:text-white"
              )}
            >
              <Icon size={20} className={isActive ? "text-purple-400" : "text-purple-400 group-hover:text-purple-300"} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-purple-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Back Button */}
      <div className="p-4 border-t border-purple-800/50 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 hover:bg-purple-800/50 hover:text-white transition-all"
        >
          <ChevronLeft size={20} />
          <span>Back to User Panel</span>
        </button>
      </div>
    </div>
    </>
  );
}
