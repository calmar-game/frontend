import { VersionedTransaction, Connection, PublicKey } from "@solana/web3.js";
import api from "../api";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const connection = new Connection(SOLANA_RPC);

// Jupiter API endpoint
const JUPITER_API = "https://quote-api.jup.ag/v6";

// Token addresses
const SOL_MINT = "So11111111111111111111111111111111111111112";
const PYTHIA_MINT = "CreiuhfwdWCN5mJbMJtA9bBpYQrQF2tCBuZwSPWfpump";

export async function buyPythia(solAmount: number, userPublicKey: PublicKey) {
    try {
        console.log(`🔄 Getting quote for ${solAmount} SOL to PYTHIA swap...`);

        // 1. Get quote
        const quoteResponse = await api.get(`/api/proxy?url=${JUPITER_API}/quote`, {
            params: {
                inputMint: SOL_MINT,
                outputMint: PYTHIA_MINT,
                amount: Math.floor(solAmount * 1e9),
                slippageBps: 100,
                feeBps: 4,
                onlyDirectRoutes: true,
            }
        });

        if (!quoteResponse.data) {
            throw new Error('Failed to get quote from Jupiter');
        }

        console.log(`✅ Got quote. Expected output: ${quoteResponse.data.outAmount} PYTHIA`);

        // 2. Get swap transaction
        const swapResponse = await api.post(`/api/proxy?url=${JUPITER_API}/swap`, {
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
        console.error("Error buying PYTHIA:", error);
        throw error;
    }
}
