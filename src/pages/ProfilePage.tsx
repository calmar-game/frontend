import React, { useEffect, useState } from 'react';
import { Star, Trophy, Target, Zap, Play, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BuyPythiaModal } from '../components/BuyPythiaModal';
import { useWallet } from '../context/WalletContext';

export function ProfilePage() {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const navigate = useNavigate();
  const { pythiaBalance, maxEnergy, currentEnergy, isLoading, isConnected, userProfile } = useWallet();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);
  const energyPercentage = (currentEnergy / maxEnergy) * 100;

  return (
    <>
    <div className="min-h-screen w-full p-4 md:p-6 pb-32 bg-black grid-pattern">
      <div className="max-w-xl mx-auto">
        <div className="glass-effect pixel-corners p-4 md:p-6 mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div 
              className="w-16 h-16 md:w-20 md:h-20 glass-effect pixel-corners
                       flex items-center justify-center"
              style={{ 
                backgroundColor: userProfile?.avatar.bgColor,
                boxShadow: `0 0 10px ${userProfile?.avatar.borderColor}` 
              }}
            >
              {userProfile && React.createElement(userProfile.avatar.icon, {
                size: 32,
                style: { color: userProfile.avatar.borderColor },
                strokeWidth: 1.5
              })}
            </div>
            <div className="flex-1">
              <h2 className="text-sm md:text-base text-[#00ff00] tracking-wider mb-2">
                {userProfile?.username.toUpperCase()}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: userProfile?.avatar.borderColor }}>
                  {userProfile?.avatar.name}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
            <div className="glass-effect pixel-corners p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-[#00ff00]" />
                <span className="text-xs text-[#00ff00]">LEVEL</span>
              </div>
              <span className="text-lg md:text-xl text-[#00ff00] neon-text">42</span>
            </div>
            <div className="glass-effect pixel-corners p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-[#00ff00]" />
                <span className="text-xs text-[#00ff00]">WEALTH</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg md:text-xl text-[#00ff00] neon-text">{pythiaBalance} $PYTHIA</span>
                <button
                  onClick={() => setIsBuyModalOpen(true)}
                  className="text-xs text-[#00ff00] hover:underline"
                >
                  Buy More PYTHIA
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            {/* Energy Cards */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className={`glass-effect pixel-corners p-3 text-center relative overflow-hidden
                            ${pythiaBalance < 100 ? 'border border-[#00ff00]' : ''}`}>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Zap className="w-4 h-4 text-[#00ff00]" />
                    <span className="text-lg font-bold text-[#00ff00]">30</span>
                  </div>
                  <div className="text-[10px] text-gray-400">0-100 $PYTHIA</div>
                </div>
                {pythiaBalance < 100 && (
                  <div className="absolute inset-0 bg-[#00ff00]/10 animate-pulse"></div>
                )}
              </div>

              <div className={`glass-effect pixel-corners p-3 text-center relative overflow-hidden
                            ${pythiaBalance >= 100 && pythiaBalance < 300 ? 'border border-[#00ff00]' : ''}`}>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Zap className="w-4 h-4 text-[#00ff00]" />
                    <span className="text-lg font-bold text-[#00ff00]">60</span>
                  </div>
                  <div className="text-[10px] text-gray-400">100-300 $PYTHIA</div>
                </div>
                {pythiaBalance >= 100 && pythiaBalance < 300 && (
                  <div className="absolute inset-0 bg-[#00ff00]/10 animate-pulse"></div>
                )}
              </div>

              <div className={`glass-effect pixel-corners p-3 text-center relative overflow-hidden
                            ${pythiaBalance >= 300 ? 'border border-[#00ff00]' : ''}`}>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Zap className="w-4 h-4 text-[#00ff00]" />
                    <span className="text-lg font-bold text-[#00ff00]">100</span>
                  </div>
                  <div className="text-[10px] text-gray-400">300+ $PYTHIA</div>
                </div>
                {pythiaBalance >= 300 && (
                  <div className="absolute inset-0 bg-[#00ff00]/10 animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Buy More PYTHIA Button */}
            <button 
              className="w-full p-2 glass-effect pixel-corners text-xs
                       text-[#00ff00] hover:neon-box transition-all duration-300
                       flex items-center justify-center gap-2 mb-6"
              onClick={() => setIsBuyModalOpen(true)}
            >
              <Coins className="w-3 h-3" />
              Buy More $PYTHIA
            </button>

            {/* Current Energy Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#00ff00]">Current Energy</span>
                <span className="text-[#00ff00]">{currentEnergy}/{maxEnergy}</span>
              </div>
              <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden pixel-corners">
                <div 
                  className="h-full bg-gradient-to-r from-[#00ff00] to-[#00ff99] relative"
                  style={{ width: `${energyPercentage}%` }}
                >
                  <div className="absolute inset-0 energy-bar opacity-30"></div>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">Energy recharges 1 point every 8 hours</p>
            </div>
          </div>

          <button 
            className={`w-full p-4 md:p-6 pixel-corners
                     flex items-center justify-center gap-3 text-base md:text-lg font-bold
                     transition-all duration-300 ${
                       currentEnergy > 0 
                         ? 'bg-[#00ff00] text-black hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]' 
                         : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                     }`}
            onClick={() => {
              window.open(`https://backendforgames.com/runner/?walletAddress=Value2`, '_blank');
            }}
            disabled={currentEnergy === 0}
          >
            <Play className="w-6 h-6" fill="currentColor" />
            {currentEnergy > 0 ? 'START GAME' : 'NO ENERGY'}
          </button>
        </div>
      </div>
    </div>

    <BuyPythiaModal 
      isOpen={isBuyModalOpen} 
      onClose={() => setIsBuyModalOpen(false)} 
      onSuccess={() => {
        // Здесь можно обновить баланс
      }}
    />
    </>
  );
}