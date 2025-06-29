import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { useUser } from "../hooks/useUser";
import { LoadingScreen } from "../components/LoadingScreen";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";
import { registerUser, User } from "../api";

import '@solana/wallet-adapter-react-ui/styles.css';


interface WalletContextType {
  pythiaBalance: number | null;
  maxEnergy: number;
  currentEnergy: number;
  isConnected: boolean;
  walletAddress: string | null;
  isLoading: boolean;
  userProfile: User | null;
  setUserProfile: (profile: Partial<User>) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

function calculateMaxEnergy(pythiaBalance: number): number {
  if (pythiaBalance >= 300) return 100;
  if (pythiaBalance >= 100) return 60;
  return 30;
}

function WalletStateProvider({ children }: { children: React.ReactNode }) {
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [userProfile, setUserProfileState] = useState<User | null>(null);
  const wallet = useSolanaWallet();
  const isConnected = !!wallet.connected;
  const walletAddress = wallet.publicKey?.toBase58() || null;
  
  const { balance: pythiaBalance, isLoading, error } = useTokenBalance();
  const { user } = useUser(walletAddress);
  const maxEnergy = calculateMaxEnergy(pythiaBalance || 0);

  // Синхронизируем профиль с данными пользователя
  useEffect(() => {
    if (user) {
      setUserProfileState(user);
    }
  }, [user]);

  useEffect(() => {
    if (pythiaBalance !== null) {
      setCurrentEnergy(calculateMaxEnergy(pythiaBalance));
    } else {
      setCurrentEnergy(30);
    }
  }, [pythiaBalance]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  const setUserProfile = async (profile: Partial<User>) => {
    if (!walletAddress || !profile.username) {
      throw new Error('Wallet not connected');
    }

    setShowLoading(true);
    try {
      const updatedUser = await registerUser(walletAddress, profile.username);

      if (updatedUser) {
        setUserProfileState(updatedUser);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      setShowLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!wallet.publicKey) return;
    
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
        mint: new PublicKey("CreiuhfwdWCN5mJbMJtA9bBpYQrQF2tCBuZwSPWfpump"),
      });

      if (tokenAccounts.value.length > 0) {
        const account = await getAccount(connection, tokenAccounts.value[0].pubkey);
        const newBalance = Number(account.amount) / Math.pow(10, 6);
        setCurrentEnergy(calculateMaxEnergy(newBalance));
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        pythiaBalance,
        maxEnergy,
        currentEnergy,
        isConnected,
        walletAddress,
        isLoading,
        userProfile,
        setUserProfile,
        refreshBalance,
      }}
    >
      {showLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      {children}
    </WalletContext.Provider>
  );
}

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={clusterApiUrl("mainnet-beta")}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletStateProvider>
            {children}
          </WalletStateProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletContextProvider');
    }
    return context;
};

export { WalletMultiButton };