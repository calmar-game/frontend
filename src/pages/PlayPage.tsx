import React from 'react';
import { Play, Trophy, Target } from 'lucide-react';

export function PlayPage() {
  return (
    <div className="min-h-screen w-full p-4 md:p-6 pb-32 bg-black grid-pattern flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto text-center px-4">
        <div className="w-28 h-28 md:w-40 md:h-40 mx-auto mb-8 relative animate-float">
          <div className="absolute inset-0 bg-[#00ff00] opacity-20 rounded-lg blur-xl animate-pulse"></div>
          <div className="relative w-full h-full glass-effect pixel-corners flex items-center justify-center">
            <Play className="w-14 h-14 md:w-20 md:h-20 text-[#00ff00]" fill="currentColor" />
          </div>
        </div>
        
        <div className="space-y-4 md:space-y-6">
          <div className="glass-effect pixel-corners p-4 md:p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-[#00ff00]" />
              <h2 className="text-sm md:text-base text-[#00ff00]">BEST RUNS</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 glass-effect pixel-corners">
                <span className="block text-[10px] md:text-xs text-[#29adff] mb-2">TODAY</span>
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4 text-[#00ff00]" />
                  <span className="text-sm md:text-base text-[#00ff00] neon-text">1.25K</span>
                </div>
              </div>
              <div className="p-3 md:p-4 glass-effect pixel-corners">
                <span className="block text-[10px] md:text-xs text-[#29adff] mb-2">ALL TIME</span>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-[#00ff00]" />
                  <span className="text-sm md:text-base text-[#00ff00] neon-text">2.45K</span>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#00ff00] text-black p-4 md:p-6 pixel-corners
                         hover:neon-box transition-all duration-300
                         flex items-center justify-center gap-3 text-base md:text-lg font-bold tracking-wider">
            START GAME
          </button>
        </div>
      </div>
    </div>
  );
}