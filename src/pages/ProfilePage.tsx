import { Star, Trophy, Target, Zap, Play, Coins, CheckCircle2, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BuyPythiaModal } from '../components/BuyPythiaModal';
import { GAME_AVATARS } from '../constants/avatars';
import { useWalletStore } from '../store/walletStore';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { getGameToken, getProfile, getTasks } from '../api';
import React from 'react';


export function ProfilePage() {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const { accessToken } = useAuthStore();
  const { pythiaBalance } = useWalletStore();
  const [gameAccessToken, setGameAccessToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState([]);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (accessToken) {
      getGameToken(String(accessToken)).then((r) => {
        setGameAccessToken(String(r));
      })
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      getProfile(String(accessToken)).then((r) => {
        setProfile(r);
      });
    }
  }, [accessToken]);

  useEffect(() => {
    getTasks()
      .then((r) => setTasks(r))
      .catch((e) => console.error('Failed to load tasks:', e));
  }, []);
 

  // useEffect(() => {
  //   if (!isConnected) {
  //     navigate('/');
  //   }
  // }, [isConnected, navigate]);

  // const { pythiaBalance, maxEnergy, currentEnergy, walletAddress } = useWalletStore();

  const location = useLocation();
  const showNavbar = !['/', '/setup'].includes(location.pathname);

  
  const avatar = profile ? GAME_AVATARS.find(avatar => avatar.id === profile?.characterClass) : null;

  const energyPercentage = (profile?.energyCurrent! / profile?.energyMax!) * 100;

  console.info(profile

  )

  return (
    <>
      {showNavbar && <Navbar />}
    
    
    <div className="min-h-screen w-full p-4 md:p-6 pb-32 bg-black grid-pattern">
      <div className="max-w-xl mx-auto">
        <div className="glass-effect pixel-corners p-4 md:p-6 mb-6">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div 
              className="w-16 h-16 md:w-20 md:h-20 
                       flex items-center justify-center"
              style={{ 
                backgroundColor: avatar?.bgColor,
                boxShadow: `0 0 10px ${avatar?.borderColor}` 
              }}
            >
              {profile && avatar?.icon && (
                React.createElement(avatar.icon, {
                  size: 32,
                  style: { color: avatar.borderColor },
                  strokeWidth: 1.5
                })
              )}
                          </div>
            <div className="flex-1">
              <h2 className="text-sm md:text-base text-center text-[#00ff00] tracking-wider mb-2">
                {profile?.username!.toUpperCase()}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: avatar?.borderColor }}>
                  {avatar?.name}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: avatar?.bgColor }}>
                    {profile?.avatar?.name}
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
                <span className="text-lg md:text-xl text-[#00ff00] neon-text">{profile?.level}</span>
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
                  <span className="text-[#00ff00]">{profile?.energyCurrent}/{profile?.energyMax}</span>
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


            {
  gameAccessToken !== null ? (
    profile?.energyCurrent > 0 ? (
      <a
        href={`https://backendforgames.com/runner?walletAddress=${gameAccessToken}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-4 md:p-6 pixel-corners
                   flex items-center justify-center gap-3 text-base md:text-lg font-bold
                   transition-all duration-300 bg-[#00ff00] text-black hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]"
      >
        <Play className="w-6 h-6" fill="currentColor" />
        START GAME
      </a>
    ) : (
      <div
        className="w-full p-4 md:p-6 pixel-corners
                   flex items-center justify-center gap-3 text-base md:text-lg font-bold
                   transition-all duration-300 bg-gray-700 text-gray-300 cursor-not-allowed"
      >
        <Play className="w-6 h-6" fill="currentColor" />
        NO ENERGY
      </div>
    )
  ) : null
}
            
          </div>

          <div className="glass-effect pixel-corners p-4 md:p-6">
            {
              tasks.length > 0
              ? <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-[#00ff00]" />
                <h2 className="text-lg text-[#00ff00]">Ежедневные задания</h2>
              </div>
              : null
            }
            
            
            <div className="space-y-4">
  {tasks.map((task) => (
    <div 
      key={task.id}
      className={`glass-effect pixel-corners p-4 
                hover:bg-white/5 transition-all duration-300`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {/* Если хочешь — можешь отрендерить иконку по условию task.condition */}
        </div>
        <div className="flex-1">
          <h3 className="text-sm text-[#00ff00] mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-xs text-gray-400 mb-1">{task.description}</p>
          )}
          <p className="text-xs text-gray-400">
            {task.value} XP — {task.condition}
          </p>
        </div>
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 text-[#00ff00]" />
        ) : (
          <button
            onClick={() => {
              if (task.link) window.open(task.link, '_blank');
              // Либо выполни нужное действие
            }}
            className="px-4 py-2 text-xs text-[#00ff00] glass-effect pixel-corners
                    hover:neon-box transition-all duration-300"
          >
            Выполнить
          </button>
        )}
      </div>
    </div>
  ))}
</div>
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
    
    </div>
    </>
  );
}