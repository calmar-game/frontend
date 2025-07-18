// stores/useWalletStore.ts
import { create } from 'zustand';
import { PublicKey, Connection } from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';

const SOLANA_RPC = "https://clean-old-mountain.solana-mainnet.quiknode.pro/c2394ff78485f0cc2af2fd4eaf0a51574f59c2f0";

interface WalletState {
  isConnected: boolean;
  publicKey: PublicKey | null;
  pythiaBalance: number | null;
  setWalletConnection: (data: {
    isConnected: boolean;
    publicKey: PublicKey;
  }) => void;
  setBalance: (pythia: number) => void;
  refreshBalance: () => Promise<void>;
}

const connection = new Connection(SOLANA_RPC);
const mint = new PublicKey('CreiuhfwdWCN5mJbMJtA9bBpYQrQF2tCBuZwSPWfpump')

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  publicKey: null,
  pythiaBalance: null,

  setWalletConnection: ({ isConnected, publicKey }) => {
    set({ isConnected, publicKey });
  },

  setBalance: (pythia) => {
    set({
      pythiaBalance: pythia,
    });
  },

  refreshBalance: async () => {
    const publicKey = get().publicKey;
    if (!publicKey) return;

    try {
      const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
        mint,
      });

      console.log(tokenAccounts)

      if (tokenAccounts.value.length > 0) {
        const account = await getAccount(connection, tokenAccounts.value[0].pubkey);
        const newBalance = Number(account.amount) / Math.pow(10, 6);
        get().setBalance(newBalance);
      }
    } catch (e) {
      console.error('[refreshBalance] Failed:', e);
    }
  },
}));