import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { LoadingScreen } from "../components/LoadingScreen";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import '@solana/wallet-adapter-react-ui/styles.css';

interface UserProfile {
  username: string;
  avatar: {
    id: number;
    name: string;
    icon: any;
    description: string;
    borderColor: string;
    bgColor: string;
  };
}

interface WalletContextType {
  pythiaBalance: number;
  maxEnergy: number;
  currentEnergy: number;
  isConnected: boolean;
  walletAddress: string | null;
  isLoading: boolean;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => Promise<void>;
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
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const wallet = useSolanaWallet();
  const isConnected = !!wallet.connected;
  const walletAddress = wallet.publicKey?.toBase58() || null;
  
  const { balance: pythiaBalance, isLoading, error } = useTokenBalance();
  const maxEnergy = calculateMaxEnergy(pythiaBalance || 0);

  // Убираем эффект, который показывал экран загрузки при подключении кошелька

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  useEffect(() => {
    if (pythiaBalance !== null) {
      setCurrentEnergy(calculateMaxEnergy(pythiaBalance));
    } else {
      setCurrentEnergy(30);
    }
  }, [pythiaBalance]);

  const setUserProfile = async (profile: UserProfile) => {
    setShowLoading(true);
    try {
      // Имитируем задержку сохранения профиля
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUserProfileState(profile);
    } catch (error) {
      setShowLoading(false);
      throw error;
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
        // Обновляем баланс в useTokenBalance
        // Обновляем энергию
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