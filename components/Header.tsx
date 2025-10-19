import { Button } from "./ui/button";
import { MobileMenu } from "./MobileMenu";
import { useState } from "react";
import { useAuth } from "../src/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Очистимо localStorage та sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Навіть якщо є помилка, очистимо localStorage та перенаправимо
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D1A]/30 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-3 md:py-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
                <span className="text-xl tracking-wider">DESTINY</span>
              </div>
              
              {/* Vertical separator and "invest • earn • enjoy" */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="h-6 w-px bg-orange-400"></div>
                <span className="tracking-widest">invest • earn • enjoy</span>
              </div>
            </div>
            
            {/* Center Navigation */}
            <div className="flex items-center justify-center flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                THE INVESTMENT SPACE
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-300">
                      {profile?.display_name || user.email}
                    </span>
                    <Button 
                      onClick={() => navigate('/kabinet')}
                      variant="ghost" 
                      className="hover:bg-white/5"
                    >
                      Kabinet
                    </Button>
                    <Button 
                      onClick={handleSignOut}
                      variant="ghost" 
                      className="hover:bg-white/5"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="hover:bg-white/5"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => navigate('/login')}
                  >
                    Log in
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
              <span className="text-lg tracking-wider">DESTINY</span>
              
              {/* Vertical separator and "invest • earn • enjoy" */}
              <div className="flex items-center gap-2 text-xs text-gray-400 ml-2">
                <div className="h-4 w-px bg-orange-400"></div>
                <span className="tracking-widest">invest • earn • enjoy</span>
              </div>
            </div>
            
            {/* Burger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
