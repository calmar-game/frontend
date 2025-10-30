// stores/useWalletStore.ts
import { create } from 'zustand';
import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SOLANA_RPC = "https://clean-old-mountain.solana-mainnet.quiknode.pro/c2394ff78485f0cc2af2fd4eaf0a51574f59c2f0";

interface WalletState {
  isConnected: boolean;
  publicKey: PublicKey | null;
  pythiaBalance: number | null;
  setWalletConnection: (data: {
    isConnected: boolean;
    publicKey: PublicKey;
  }) => void;
  setBalance: (sol: number) => void;
  refreshBalance: () => Promise<void>;
}

const connection = new Connection(SOLANA_RPC);

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  publicKey: null,
  pythiaBalance: null,

  setWalletConnection: ({ isConnected, publicKey }) => {
    set({ isConnected, publicKey });
  },

  setBalance: (sol) => {
    set({
      pythiaBalance: sol,
    });
  },

  refreshBalance: async () => {
    const publicKey = get().publicKey;
    if (!publicKey) return;

    try {
      // Get native SOL balance
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      console.log('SOL Balance:', solBalance);
      get().setBalance(solBalance);
    } catch (e) {
      console.error('[refreshBalance] Failed:', e);
    }
  },
}));