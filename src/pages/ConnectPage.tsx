import { useEffect } from 'react';
import { ArrowRight, Zap, Shield, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getNonce,
  getGuestNonce,
  loginUser,
  registration,
  User,
} from '../api';
import bs58 from 'bs58';
import { useAuthStore } from '../store/authStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButtonWithSession } from '../components/WalletMultiButton';
import { EagleIcon } from '../components/EagleIcon';

export function ConnectPage() {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuthStore();
  const wallet = useWallet();
  const walletAddress = wallet.publicKey?.toBase58() || null;
  const isWalletConnected = !!walletAddress;

  useEffect(() => {
    // Navigation logic handled separately
  }, [navigate]);

  async function handleLoginFlow() {
    if (!walletAddress) return;
  
    let nonce: string | null = null;
    try {
      const response = await getNonce(walletAddress);
      nonce = response?.nonce ?? null;
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } }).response?.status;
      if (status !== 404) throw err;
      const response = await getGuestNonce();
      nonce = response?.nonce ?? null;
    }
  
    if (!nonce) {
      console.error('Nonce generation failed');
      return;
    }
  
    const encoded = new TextEncoder().encode(nonce);
    const signatureBytes = await wallet.signMessage?.(encoded);
    if (!signatureBytes) {
      console.error('Signature generation failed');
      return;
    }
    const signature = bs58.encode(signatureBytes);
  
    let user: User | null = null;
    try {
      user = await loginUser(walletAddress, signature, nonce);
      setAccessToken(user?.accessToken ?? null);
      return;
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } }).response?.status;
      if (status !== 401 && status !== 404) throw err;
    }
  
    // if (user) {
    //   setUserProfile(user);
    //   return navigate('/profile');
    // }
  
    try {
      const username = `guest-${walletAddress.slice(0, 6)}`;
      const newUser = await registration(walletAddress, username, signature, nonce);
    
      if (newUser) {
        setAccessToken(newUser?.accessToken ?? null);
      }
    } catch (e) {
      console.error(e)
    }
  }
  
  useEffect(() => {
    if (accessToken !== null) {
      navigate("/setup");
    }
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between px-4 py-6 md:py-8 md:justify-center">
        <div className="max-w-3xl w-full">
          {/* Header Section */}
          <div className="text-center mb-6 md:mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 border-2 border-amber-500/40 backdrop-blur-xl shadow-lg shadow-amber-500/30">
              <EagleIcon size={48} className="text-amber-400 md:hidden" />
              <EagleIcon size={64} className="text-amber-400 hidden md:block" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-yellow-200">
                Solana Runner
              </span>
            </h1>
            
            <p className="text-sm md:text-base text-gray-400">
              Play. Earn. Dominate.
            </p>
          </div>

          {/* Features Grid - Desktop only */}
          <div className="hidden md:block mb-4">
            <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-purple-500/50 transition-all h-full">
                  <div className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all">
                      <Zap className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">Fast & Smooth</h3>
                      <p className="text-gray-400 text-xs">Lightning-fast gameplay on Solana</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-blue-500/50 transition-all h-full">
                  <div className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/40 group-hover:to-cyan-500/40 transition-all">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">Secure & Safe</h3>
                      <p className="text-gray-400 text-xs">Blockchain-backed security</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-cyan-500/50 transition-all h-full">
                  <div className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-cyan-500/40 group-hover:to-teal-500/40 transition-all">
                      <Rocket className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">Earn Rewards</h3>
                      <p className="text-gray-400 text-xs">Accumulate $SOL tokens</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works - Compact on mobile, full on desktop */}
          <div className="mb-6 md:mb-4">
            <h2 className="text-lg md:text-lg font-bold text-white mb-3 md:mb-2 text-center">How It Works</h2>
            <div className="grid grid-cols-3 gap-2 md:gap-3 md:space-y-0">
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-purple-500/50 transition-all h-full">
                  <div className="flex flex-col items-center text-center gap-2 h-full">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-75 blur-sm"></div>
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-950 flex items-center justify-center text-base md:text-lg font-bold text-white border border-slate-700">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs md:text-sm font-semibold text-white leading-tight">Connect Wallet</h3>
                      <p className="hidden md:block text-gray-400 text-xs mt-1">Authenticate with Solana to play</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-blue-500/50 transition-all h-full">
                  <div className="flex flex-col items-center text-center gap-2 h-full">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-75 blur-sm"></div>
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-950 flex items-center justify-center text-base md:text-lg font-bold text-white border border-slate-700">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs md:text-sm font-semibold text-white leading-tight">Check Balance</h3>
                      <p className="hidden md:block text-gray-400 text-xs mt-1">Your balance determines your energy capacity</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-cyan-500/50 transition-all h-full">
                  <div className="flex flex-col items-center text-center gap-2 h-full">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full opacity-75 blur-sm"></div>
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-950 flex items-center justify-center text-base md:text-lg font-bold text-white border border-slate-700">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs md:text-sm font-semibold text-white leading-tight">Play</h3>
                      <p className="hidden md:block text-gray-400 text-xs mt-1">Run and compete for rewards</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Scale - Compact on mobile */}
          <div className="mb-6 md:mb-4">
            <h2 className="text-lg md:text-lg font-bold text-white mb-3 md:mb-2 text-center">Energy Scale</h2>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-600/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-orange-500/50 transition-all text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-orange-400" fill="currentColor" />
                    <span className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">40</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-tight">0.01-0.1 $SOL</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-purple-500/50 transition-all text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-400" fill="currentColor" />
                    <span className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">80</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-tight">0.1-1 $SOL</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50 group-hover:border-cyan-500/50 transition-all text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" fill="currentColor" />
                    <span className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">120</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-tight">1+ $SOL</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons Section */}
          <div className="space-y-2 md:space-y-3 max-w-md mx-auto">
            {/* Wallet Connection Button */}
            <div className="w-full flex justify-center">
              <WalletButtonWithSession
                className="w-full px-6 py-4 md:py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold 
                           hover:from-purple-500 hover:to-blue-500 transition-all duration-300 
                           flex items-center justify-center gap-2 text-base md:text-sm
                           shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/50"
              />
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLoginFlow}
              disabled={!isWalletConnected}
              className={`w-full px-6 py-4 md:py-3 rounded-xl font-semibold 
                         flex items-center justify-center gap-2 transition-all duration-300 text-base md:text-sm
                         ${isWalletConnected
                           ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 border border-cyan-400/50 hover:border-cyan-300/80 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-400/60'
                           : 'bg-slate-800/50 text-gray-500 cursor-not-allowed border border-slate-700/30'
                         }`}
            >
              Sign In
              <ArrowRight className="w-5 h-5 md:w-4 md:h-4" />
            </button>

            {/* Play as Guest Button */}
            <a
              href={`https://backendforgames.com/runner/?walletAddress=Guest`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 md:py-3 rounded-xl bg-slate-800/50 text-white font-semibold 
                         hover:bg-slate-700/50 transition-all duration-300
                         border border-slate-700 hover:border-slate-600
                         flex items-center justify-center gap-2 group text-base md:text-sm"
            >
              <Rocket className="w-5 h-5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              Play as Guest
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}