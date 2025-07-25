import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Подключаем QuickNode RPC
const SOLANA_RPC = "https://clean-old-mountain.solana-mainnet.quiknode.pro/c2394ff78485f0cc2af2fd4eaf0a51574f59c2f0";

// Контракт токена PYTHIA (Mint Address)
const TOKEN_MINT = new PublicKey("CreiuhfwdWCN5mJbMJtA9bBpYQrQF2tCBuZwSPWfpump");

export const useTokenBalance = () => {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchBalance = async () => {
            if (!publicKey) {
                setBalance(null);
                setError(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const connection = new Connection(SOLANA_RPC);
                const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
                    programId: TOKEN_PROGRAM_ID,
                });

                for (let accountInfo of tokenAccounts.value) {
                    const account = await getAccount(connection, accountInfo.pubkey);
                    
                    if (account.mint.toBase58() === TOKEN_MINT.toBase58()) {
                        setBalance(Number(account.amount) / Math.pow(10, 6)); // 6 decimals
                        setIsLoading(false);
                        return;
                    }
                }

                setBalance(0); // Если токенов нет
                setIsLoading(false);
            } catch (error) {
                console.error("Error while fetching token balance:", error);
                setError("Failed to fetch token balance");
                setBalance(null);
                setIsLoading(false);
            }
        };

        fetchBalance();

        // Обновляем баланс каждые 30 секунд
        const interval = setInterval(fetchBalance, 30000);

        return () => clearInterval(interval);
    }, [publicKey]);

    return { balance, isLoading, error };
};
