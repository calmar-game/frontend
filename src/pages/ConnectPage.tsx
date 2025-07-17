import React, { useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getNonce,
  getGuestNonce,
  loginUser,
  registration,
} from '../api';
import bs58 from 'bs58';
import { useAuthStore } from '../store/authStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButtonWithSession } from '../components/WalletMultiButton';

export function ConnectPage() {
  const navigate = useNavigate();
  // const {
    // isConnected,
    // isLoading,
    // publicKey,
    // setUserProfile,
    // signMessage,
    // walletAddress,
    // userProfile,
  // } = useWallet();

  const { userProfile, accessToken, setAccessToken } = useAuthStore();

  const wallet  = useWallet();

  const walletAddress = wallet.publicKey?.toBase58() || null;

  useEffect(() => {
    // if (isConnected) {
    //   if (userProfile) {
    //     navigate('/profile');
    //   } else {
    //     navigate('/setup');
    //   }
    // }
  }, [userProfile, navigate]);

  async function handleLoginFlow() {
    if (!walletAddress || userProfile) return;
  
    let nonce: string | null = null;
    try {
      const response = await getNonce(walletAddress);
      nonce = response.nonce;
    } catch (err: any) {
      if (err.response?.status !== 404) throw err;
      const response = await getGuestNonce();
      nonce = response.nonce;
    }
  
    if (!nonce) {
      console.error('Nonce generation failed');
      return;
    }
  
    const encoded = new TextEncoder().encode(nonce);
    const signatureBytes = await wallet.signMessage(encoded);
    const signature = bs58.encode(signatureBytes);
  
    let user: User | null = null;
    try {
      user = await loginUser(walletAddress, signature, nonce);
      setAccessToken(user.accessToken);
      return;
    } catch (err: any) {
      const status = err.response?.status;
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
        setAccessToken(newUser.accessToken);
        // setUserProfile(newUser);
        // return navigate('/setup');
      }
    } catch (e) {
      alert("ops!")
      console.error(e)
    }
  }
  
  useEffect(() => {
    if (accessToken !== null) {
      navigate("/setup");
    }
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black grid-pattern">
      <div className="max-w-md w-full mx-auto text-center px-6">
        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 relative animate-float">
          <div className="absolute inset-0 bg-[#00ff00] opacity-20 rounded-lg blur-xl animate-pulse"></div>
          <div className="relative w-full h-full glass-effect pixel-corners flex items-center justify-center">
            <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 text-[#00ff00]" />
          </div>
        </div>

        <h1 className="text-xl md:text-2xl neon-text mb-4 tracking-wider">Squid Runner</h1>

        <div className="glass-effect pixel-corners p-4 mb-8">
          <h2 className="text-[#00ff00] text-sm mb-4">How It Works</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 flex-shrink-0 rounded-full bg-[#00ff00]/10 flex items-center justify-center">
                <span className="text-[#00ff00] text-sm">1</span>
              </div>
              <p className="text-sm text-gray-300">
                Connect your Solana wallet to start playing and track your progress
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 flex-shrink-0 rounded-full bg-[#00ff00]/10 flex items-center justify-center">
                <span className="text-[#00ff00] text-sm">2</span>
              </div>
              <p className="text-sm text-gray-300">
                Your $PYTHIA balance determines your energy capacity
              </p>
            </div>
          </div>
        </div>

        <div className="glass-effect pixel-corners p-4 mb-8">
          <h2 className="text-[#00ff00] text-sm mb-4">Energy Scale</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 glass-effect pixel-corners">
              <div className="text-[#00ff00] text-lg font-bold mb-1">30</div>
              <div className="text-xs text-gray-400">0-100 $PYTHIA</div>
            </div>
            <div className="p-2 glass-effect pixel-corners">
              <div className="text-[#00ff00] text-lg font-bold mb-1">60</div>
              <div className="text-xs text-gray-400">100-300 $PYTHIA</div>
            </div>
            <div className="p-2 glass-effect pixel-corners">
              <div className="text-[#00ff00] text-lg font-bold mb-1">100</div>
              <div className="text-xs text-gray-400">300+ $PYTHIA</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">More $PYTHIA = More Energy</p>
        </div>

        <WalletButtonWithSession
          className="w-full bg-black/50 text-[#00ff00] p-4 glass-effect pixel-corners
                   hover:neon-box transition-all duration-300 tracking-wide
                   flex items-center justify-center gap-3 text-xs md:text-sm"
        />

        {!userProfile && (
          <button
            onClick={handleLoginFlow}
            className="w-full mt-4 bg-[#00ff00]/20 text-[#00ff00] p-4 glass-effect pixel-corners hover:neon-box transition-all duration-300 tracking-wide"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}