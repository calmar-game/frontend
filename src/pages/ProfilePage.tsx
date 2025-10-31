/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Star, Target, Zap, Play, Coins, CheckCircle2, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { BuyPythiaModal } from '../components/BuyPythiaModal';
import { useWalletStore } from '../store/walletStore';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { completeTask, getGameToken, getProfile, getTasks, User, Task } from '../api';
import { useWallet } from '@solana/wallet-adapter-react';
import { EagleIcon } from '../components/EagleIcon';
  


export function ProfilePage() {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const { accessToken } = useAuthStore();
  const wallet = useWallet();
  const { pythiaBalance, refreshBalance, isConnected, setWalletConnection } = useWalletStore();
  const [gameAccessToken, setGameAccessToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [tasksLoading, setTasksLoading] = useState(false);

  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (wallet.publicKey) {
      setWalletConnection({ isConnected: true, publicKey: wallet.publicKey });
    }
  }, [wallet.publicKey, setWalletConnection]);

  useEffect(() => {
    if (accessToken) {
      getGameToken(String(accessToken)).then((r) => {
        setGameAccessToken(String(r));
      })
      getProfile(String(accessToken)).then((r) => {
        setProfile(r);
      });
      getTasks(String(accessToken))
      .then((r) => setTasks(r))
      .catch((e) => console.error('Failed to load tasks:', e));
    }
  }, [accessToken]);

  useEffect(() => {
    if (isConnected) refreshBalance()
  }, [isConnected, refreshBalance])

  console.log(isConnected);
 

  // useEffect(() => {
  //   if (!isConnected) {
  //     navigate('/');
  //   }
  // }, [isConnected, navigate]);

  // const { pythiaBalance, maxEnergy, currentEnergy, walletAddress } = useWalletStore();

  const location = useLocation();
  const showNavbar = !['/', '/setup'].includes(location.pathname);

  const energyPercentage = (profile?.energyCurrent! / profile?.energyMax!) * 100;

  const currentPythiaBalance = pythiaBalance || 0;

  // mock leaderboard data
  const rank = profile?.place || 0;
  const totalPlayers = profile?.totalUsers || 0;

  return (
    <>
      {showNavbar && <Navbar />}
    
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-32">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-xl mx-auto">
          {/* Profile Header */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 mb-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              {/* Eagle Avatar Icon */}
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 border-2 border-amber-500/40 backdrop-blur-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <EagleIcon size={64} className="text-amber-400" />
              </div>
              
              {/* Username */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-yellow-200 mb-1">
                  {profile?.username}
                </h2>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Level Card */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400 font-semibold">LEVEL</span>
                </div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{profile?.level}</span>
              </div>

              {/* Leaderboard Card */}
              <Link
                to="/leaderboard"
                className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 block"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400 font-semibold">RANK</span>
                </div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {rank} / {totalPlayers}
                </span>
              </Link>

              {/* Wealth Card */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-gray-400 font-semibold">$SOL BALANCE</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 block mb-3">{pythiaBalance} $SOL</span>
                <button
                  onClick={() => setIsBuyModalOpen(true)}
                  className="w-full px-4 py-2 rounded-lg font-semibold text-xs
                           bg-gradient-to-r from-cyan-500 to-blue-500 text-white
                           hover:from-cyan-400 hover:to-blue-400
                           transition-all duration-300 
                           flex items-center justify-center gap-2
                           shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-400/40"
                >
                  <Coins className="w-4 h-4" />
                  Buy More $SOL
                </button>
              </div>
            </div>

            {/* Energy Scale Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 text-center">Energy Scale</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className={`relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-3 border text-center overflow-hidden transition-all
                              ${currentPythiaBalance < 0.1 ? 'border-orange-500/50 shadow-lg shadow-orange-500/20' : 'border-slate-700/50'}`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-orange-400" fill="currentColor" />
                      <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">40</span>
                    </div>
                    <div className="text-xs text-gray-400">0.01-0.1 $SOL</div>
                  </div>
                  {currentPythiaBalance < 0.1 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 to-transparent animate-pulse"></div>
                  )}
                </div>

                <div className={`relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-3 border text-center overflow-hidden transition-all
                              ${currentPythiaBalance >= 0.1 && currentPythiaBalance < 1 ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' : 'border-slate-700/50'}`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-purple-400" fill="currentColor" />
                      <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">80</span>
                    </div>
                    <div className="text-xs text-gray-400">0.1-1 $SOL</div>
                  </div>
                  {currentPythiaBalance >= 0.1 && currentPythiaBalance < 1 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-transparent animate-pulse"></div>
                  )}
                </div>

                <div className={`relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-3 border text-center overflow-hidden transition-all
                              ${currentPythiaBalance >= 1 ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'border-slate-700/50'}`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-cyan-400" fill="currentColor" />
                      <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">120</span>
                    </div>
                    <div className="text-xs text-gray-400">1+ $SOL</div>
                  </div>
                  {currentPythiaBalance >= 1 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/10 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>

              {/* Current Energy Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Current Energy
                  </span>
                  <span className="text-cyan-400 font-bold">{profile?.energyCurrent}/{profile?.energyMax}</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 relative transition-all duration-500"
                    style={{ width: `${energyPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 to-blue-400/50 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">Energy recharges 1 point every 8 hours</p>
              </div>
            </div>

            {/* Start Game Button */}
            {gameAccessToken !== null ? (
              profile?.energyCurrent && profile?.energyCurrent > 0 ? (
                <a
                //TODO: remove this after testing
                  href={`https://backendforgames.com/runner/?walletAddress=${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI3LCJ3YWxsZXRBZGRyZXNzIjoiMm9zYWh6ZG9UeDFuYmpUUVc2aVFWYTVqdkVrRlVNQzJ2ZWdVd2JKN1JMRkIiLCJpYXQiOjE3NjE4Njk5ODEsImV4cCI6MTc2MjQ3NDc4MX0._ElhvwPYn1I0t2rWKLJ-_G5LTprdBehgbYQIAzPqVso"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-4 rounded-xl font-bold text-lg
                           bg-gradient-to-r from-purple-600 to-blue-600 text-white
                           hover:from-purple-500 hover:to-blue-500
                           transition-all duration-300 
                           flex items-center justify-center gap-3
                           shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/50"
                >
                  <Play className="w-6 h-6" fill="currentColor" />
                  START GAME
                </a>
              ) : (
                <div
                  className="w-full px-6 py-4 rounded-xl font-bold text-lg
                           bg-slate-800/50 text-gray-500
                           flex items-center justify-center gap-3
                           border border-slate-700/50 cursor-not-allowed"
                >
                  <Play className="w-6 h-6" fill="currentColor" />
                  NO ENERGY
                </div>
              )
            ) : null}
            
          </div>

          {/* Daily Tasks Section */}
          {tasks.length > 0 && (
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200">
                  Daily Tasks
                </h2>
              </div>
              
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">{task.title}</h3>
                        {task.description && (
                          <p className="text-xs text-gray-400 mb-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="text-purple-400 font-extrabold flex items-center gap-1">
                            <Zap className="inline w-4 h-4 text-purple-400" fill="currentColor" />
                            {task.value}
                          </span>
                          {/* <span>•</span> */}
                          {/* <span>{task.condition}</span> */}
                        </div>
                      </div>
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                      ) : (
                        <button
                          disabled={tasksLoading}
                          onClick={() => {
                            if (task.link) window.open(task.link, '_blank');
                            if (!accessToken) return;
                            setTasksLoading(true);
                            completeTask(String(accessToken), task.id).then((r) => {
                              setProfile(r);
                            }).catch((e) => console.error('Failed to complete task:', e));
                            setTimeout(() => {
                              getTasks(String(accessToken))
                              .then((r) => {
                                setTasks(r);
                              })
                              .catch((e) => console.error('Failed to load tasks:', e));
                              setTasksLoading(false);
                            }, 2000);
                          }}
                          className="px-4 py-2 text-xs font-semibold rounded-lg
                                   bg-gradient-to-r from-purple-600 to-blue-600 text-white
                                   hover:from-purple-500 hover:to-blue-500
                                   transition-all duration-300 flex-shrink-0
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {tasksLoading ? 'Loading...' : 'Complete'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BuyPythiaModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)} 
        onSuccess={() => {
          setIsBuyModalOpen(false);
          setTimeout(() => {
            refreshBalance();
            getProfile(String(accessToken)).then((r) => {
              setProfile(r);
            }).catch((e) => console.error('Failed to refresh profile:', e));
          }, 10000);
        }}
      />
    
    </div>
    </>
  );
}