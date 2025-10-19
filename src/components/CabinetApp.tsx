import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Toaster } from '../../components/ui/sonner';
import { Sidebar } from './cabinet/crypto/Sidebar';
import { AdminSidebar } from './cabinet/crypto/admin/AdminSidebar';
import { MobileHeader } from './cabinet/crypto/MobileHeader';

// User Pages
import { Dashboard } from './cabinet/crypto/pages/Dashboard';
import { Deposit } from './cabinet/crypto/pages/Deposit';
import { Receive } from './cabinet/crypto/pages/Receive';
import { Send } from './cabinet/crypto/pages/Send';
import { Referrals } from './cabinet/crypto/pages/Referrals';
import { Leaderboard } from './cabinet/crypto/pages/Leaderboard';
import { Support } from './cabinet/crypto/pages/Support';

// Admin Pages
import { AdminDashboard } from './cabinet/crypto/admin/AdminDashboard';
import { UsersManagement } from './cabinet/crypto/admin/UsersManagement';
import { Transactions } from './cabinet/crypto/admin/Transactions';
import { StakingPools } from './cabinet/crypto/admin/StakingPools';
import { Analytics } from './cabinet/crypto/admin/Analytics';
import { AdminSettings } from './cabinet/crypto/admin/AdminSettings';

export function CabinetApp() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Check if user is admin based on profile role
  useEffect(() => {
    // Don't automatically switch to admin mode
    // Admin mode should only be activated when user explicitly clicks "Admin" button
    // This ensures users start with regular cabinet interface
  }, [profile]);

  const renderPage = useMemo(() => {
    // Admin Pages
    if (currentPage === 'admin-dashboard') return <AdminDashboard />;
    if (currentPage === 'admin-users') return <UsersManagement />;
    if (currentPage === 'admin-transactions') return <Transactions />;
    if (currentPage === 'admin-pools') return <StakingPools />;
    if (currentPage === 'admin-analytics') return <Analytics />;
    if (currentPage === 'admin-settings') return <AdminSettings />;

    // User Pages
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'deposit': return <Deposit />;
      case 'receive': return <Receive />;
      case 'send': return <Send />;
      case 'referrals': return <Referrals />;
      case 'leaderboard': return <Leaderboard />;
      case 'support': return <Support />;
      default: return <Dashboard />;
    }
  }, [currentPage]);

  const handlePageChange = useCallback((page: string) => {
    // Check if switching to admin
    if (page.startsWith('admin-')) {
      setIsAdmin(true);
      setCurrentPage(page);
    } else if (page === 'admin') {
      setIsAdmin(true);
      setCurrentPage('admin-dashboard');
    } else {
      // If switching to regular user pages, stay in admin mode if user is admin
      // Only switch to user mode if explicitly requested
      if (page === 'user-dashboard') {
        setIsAdmin(false);
        setCurrentPage('dashboard');
      } else {
        setCurrentPage(page);
      }
    }
  }, []);

  const handleAdminClose = useCallback(() => {
    setIsAdmin(false);
    setCurrentPage('dashboard');
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut();
    navigate('/', { replace: true });
  }, [signOut, navigate]);

  // Memoize sidebar to prevent unnecessary re-renders
  const sidebarComponent = useMemo(() => {
    if (isAdmin) {
      return (
        <AdminSidebar 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
          onClose={handleAdminClose}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      );
    } else {
      return (
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
          isAdmin={profile?.role?.trim() === 'admin'}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          user={user}
          profile={profile}
          onLogout={handleLogout}
        />
      );
    }
  }, [isAdmin, currentPage, isMobileSidebarOpen, user, profile, handlePageChange, handleAdminClose, handleLogout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Toaster position="top-right" />
      
      {/* Mobile Header */}
      <MobileHeader 
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        isAdmin={isAdmin}
        user={user}
        profile={profile}
        onLogout={handleLogout}
      />
      
      {/* Sidebar */}
      {sidebarComponent}
      
      {/* Main Content */}
      <main className="min-h-screen scrollable-container pt-16 lg:pt-0 lg:ml-64 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-6 lg:p-8 hide-horizontal-scrollbar">
          {renderPage}
        </div>
      </main>
    </div>
  );
}
