import { VersionedTransaction, Connection, PublicKey } from "@solana/web3.js";
import api from "../api";
import axios from "axios";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const connection = new Connection(SOLANA_RPC);

// Jupiter API endpoint
const JUPITER_API = "https://quote-api.jup.ag/v6";

// Token addresses
const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT on Solana

export async function buySolWithUsdt(usdtAmount: number, userPublicKey: PublicKey) {
    try {
        console.log(`🔄 Getting quote for ${usdtAmount} USDT to SOL swap...`);

        // 1. Get quote (USDT -> SOL)
        const quoteResponse = await axios.get(`${JUPITER_API}/quote`, {
            params: {
                inputMint: USDT_MINT,
                outputMint: SOL_MINT,
                amount: Math.floor(usdtAmount * 1e6), // USDT has 6 decimals
                slippageBps: 100,
                feeBps: 4,
                onlyDirectRoutes: false, // Allow routes through other tokens if needed
            }
        });

        if (!quoteResponse.data) {
            throw new Error('Failed to get quote from Jupiter');
        }

        console.log(`✅ Got quote. Expected output: ${quoteResponse.data.outAmount / 1e9} SOL`);

        // 2. Get swap transaction
        const swapResponse = await axios.post(`${JUPITER_API}/swap`, {
            quoteResponse: quoteResponse.data,
            userPublicKey: userPublicKey.toBase58(),
            wrapUnwrapSOL: true,
        });

        if (!swapResponse.data.swapTransaction) {
            throw new Error('Failed to get swap transaction from Jupiter');
        }

        // 3. Create and return transaction
        const serializedTransaction = swapResponse.data.swapTransaction;
        const transaction = VersionedTransaction.deserialize(Buffer.from(serializedTransaction, 'base64'));
        
        return transaction;

    } catch (error) {
        console.error("Error buying SOL with USDT:", error);
        throw error;
    }
}
