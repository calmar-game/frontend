import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Trophy, User, Zap } from 'lucide-react';
import { WalletButtonWithSession } from './WalletMultiButton';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-fit">
      <div className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
          <NavLink 
            to="/runner" 
            className="flex items-center gap-2 font-bold text-lg group"
          >
            <Zap className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" fill="currentColor" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 group-hover:from-purple-300 group-hover:to-blue-300 transition-all">
              Solana Runner
            </span>
          </NavLink>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <WalletButtonWithSession className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 
                         border border-slate-700 hover:border-purple-500/50
                         transition-all flex items-center gap-2 text-white text-sm font-semibold
                         shadow-sm hover:shadow-lg hover:shadow-purple-500/20" />
            </div>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 
                       border border-slate-700 hover:border-purple-500/50
                       transition-all shadow-sm hover:shadow-lg hover:shadow-purple-500/20"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" strokeWidth={2} />
              ) : (
                <Menu className="w-6 h-6 text-white" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-xl z-40 pt-20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="grid gap-3">
              {/* Show wallet info on mobile */}
              <div className="md:hidden flex flex-col gap-3 mb-2">
                <WalletButtonWithSession className="w-full px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800
                           border border-slate-700 hover:border-purple-500/50
                           transition-all flex items-center justify-center gap-2 text-white text-sm font-semibold
                           shadow-sm hover:shadow-lg hover:shadow-purple-500/20" />
              </div>

              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="group relative overflow-hidden flex items-center gap-4 p-4 rounded-xl 
                         bg-slate-800/50 hover:bg-slate-800 
                         border border-slate-700/50 hover:border-purple-500/50
                         transition-all shadow-sm hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <User className="w-6 h-6 text-purple-400" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-white font-semibold text-base">Profile</span>
                  <p className="text-sm text-gray-400">View your stats and start game</p>
                </div>
              </NavLink>

              <NavLink
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className="group relative overflow-hidden flex items-center gap-4 p-4 rounded-xl 
                         bg-slate-800/50 hover:bg-slate-800 
                         border border-slate-700/50 hover:border-cyan-500/50
                         transition-all shadow-sm hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                  <Trophy className="w-6 h-6 text-cyan-400" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-white font-semibold text-base">Leaderboard</span>
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