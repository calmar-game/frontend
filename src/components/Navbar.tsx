import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Trophy, User } from 'lucide-react';
import { WalletButtonWithSession } from './WalletMultiButton';
// import { useNavigate } from 'react-router-dom';
// import { WalletMultiButton } from '../context/WalletContext';
// import { useWalletStore } from '../store/walletStore';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // const { walletAddress, isLoading, isConnected } = useWalletStore();
  // const navigate = useNavigate();

  return (
    <div className="h-fit">
      <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-b border-[#00ff00]/30 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
          <NavLink to="/runner" className="text-[#00ff00] font-medium">Squid Runner</NavLink>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <WalletButtonWithSession className="px-3 py-1.5 rounded-lg bg-[#00ff00]/10 hover:bg-[#00ff00]/20 transition-colors
                         flex items-center gap-2 text-[#00ff00] text-sm font-medium" />
            </div>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-[#00ff00]/10 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-[#00ff00]" strokeWidth={1.5} />
              ) : (
                <Menu className="w-6 h-6 text-[#00ff00]" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-40 pt-20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="grid gap-4">
              {/* Show wallet info on mobile */}
              <div className="md:hidden flex flex-col gap-3 p-4 rounded-lg bg-[#00ff00]/5 mb-4">
                <div className="flex items-center justify-between">
                  <WalletButtonWithSession className="w-full px-3 py-1.5 rounded-lg bg-[#00ff00]/10 hover:bg-[#00ff00]/20 transition-colors
                             flex items-center justify-center gap-2 text-[#00ff00] text-sm font-medium" />
                </div>
              </div>

              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-[#00ff00]/10 transition-colors"
              >
                <User className="w-6 h-6 text-[#00ff00]" strokeWidth={1.5} />
                <div>
                  <span className="text-white font-medium">Profile</span>
                  <p className="text-sm text-gray-400">View your stats and start game</p>
                </div>
              </NavLink>

              <NavLink
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-[#00ff00]/10 transition-colors"
              >
                <Trophy className="w-6 h-6 text-[#00ff00]" strokeWidth={1.5} />
                <div>
                  <span className="text-white font-medium">Leaderboard</span>
                  <p className="text-sm text-gray-400">Check global rankings</p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* Top spacing for content */}
      <div className="h-16" />
    </div>
  );
}