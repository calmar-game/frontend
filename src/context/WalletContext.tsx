import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={clusterApiUrl("mainnet-beta")}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
            {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
