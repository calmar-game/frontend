import { VersionedTransaction, PublicKey, Connection } from "@solana/web3.js";
import axios from "axios";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
// @ts-expect-error - Connection is not defined in the global scope
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const connection = new Connection(SOLANA_RPC);

// Jupiter API endpoint
const JUPITER_API = "https://lite-api.jup.ag/swap/v1";

// Token addresses
const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC on Solana

export async function buySolWithUsdc(usdcAmount: number, userPublicKey: PublicKey) {
    try {
        console.log(`🔄 Getting quote for ${usdcAmount} USDC to SOL swap...`);

        // 1. Get quote (USDC -> SOL)
        const quoteResponse = await axios.get(`${JUPITER_API}/quote`, {
            params: {
                inputMint: USDC_MINT,
                outputMint: SOL_MINT,
                amount: Math.floor(usdcAmount * 1e6), // USDC has 6 decimals
                slippageBps: 100,
                feeBps: 4,
                onlyDirectRoutes: false, // Only direct routes
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
        console.error("Error buying SOL with USDC:", error);
        throw error;
    }
}
