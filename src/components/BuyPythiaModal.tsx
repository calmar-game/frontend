import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { buySolWithUsdc } from "../utils/buyPythia";
import { Dialog } from "@headlessui/react";
import { Connection } from "@solana/web3.js";
import { Loader2, Coins, ExternalLink, X } from "lucide-react";
import { useWalletStore } from "../store/walletStore";

const SOLANA_RPC = "https://clean-old-mountain.solana-mainnet.quiknode.pro/c2394ff78485f0cc2af2fd4eaf0a51574f59c2f0";
const connection = new Connection(SOLANA_RPC);

interface BuyPythiaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function BuyPythiaModal({ isOpen, onClose, onSuccess }: BuyPythiaModalProps) {
    const { publicKey, sendTransaction } = useWallet();
    const { refreshBalance } = useWalletStore();
    const [usdcAmount, setUsdcAmount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [txId, setTxId] = useState("");

    const handleBuy = async () => {
        if (!publicKey) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            setLoading(true);
            
            // Get the transaction
            const transaction = await buySolWithUsdc(usdcAmount, publicKey);

            console.log("Signing transaction...");
            const signature = await sendTransaction(transaction, connection, {
                skipPreflight: true, // Skip preflight to avoid simulation errors
                maxRetries: 3
            });
            setTxId(signature);

            console.log("Waiting for confirmation...");
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            
            if (confirmation.value.err) {
                throw new Error(`Transaction failed: ${confirmation.value.err}`);
            }

            await refreshBalance();

            if (onSuccess) {
                onSuccess();
            }
            
            alert(`✅ Successfully purchased SOL! Transaction: ${signature}`);
            onClose();
        } catch (error) {
            console.error("Error buying SOL:", error);
            alert(`❌ Error purchasing SOL: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            
            {/* Modal */}
            <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 max-w-md w-full border border-slate-700/50 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                        <Coins className="w-8 h-8 text-cyan-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-200">
                            Buy $SOL
                        </span>
                    </h2>
                    
                    <p className="text-sm text-gray-400">
                        Purchase SOL with USDC
                    </p>
                </div>
                
                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-white text-sm font-semibold mb-3">
                        Amount (USDC)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={usdcAmount}
                            onChange={(e) => setUsdcAmount(parseFloat(e.target.value))}
                            className="w-full bg-slate-800/50 text-white px-4 py-3 rounded-lg
                                     border border-slate-700 focus:border-cyan-500/50
                                     focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                                     placeholder:text-gray-500 transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     text-lg font-semibold
                                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={loading}
                            placeholder="10"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">
                            USDC
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Minimum: 1 USDC
                    </p>
                </div>
                
                {/* Buy Button */}
                <button
                    className="w-full px-6 py-4 rounded-xl font-bold text-base
                             bg-gradient-to-r from-cyan-500 to-blue-500 text-white
                             hover:from-cyan-400 hover:to-blue-400
                             transition-all duration-300 
                             flex items-center justify-center gap-2
                             shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-400/50
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    onClick={handleBuy}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Coins className="w-5 h-5" />
                            Buy SOL for {usdcAmount} USDC
                        </>
                    )}
                </button>

                {/* Transaction Link */}
                {txId && (
                    <div className="mt-4">
                        <a
                            href={`https://solscan.io/tx/${txId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-cyan-400 text-sm hover:text-cyan-300 transition-colors font-semibold"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View on Solscan
                        </a>
                    </div>
                )}

                {/* Cancel Button */}
                <button 
                    className="mt-3 w-full text-gray-400 hover:text-white transition-colors text-sm font-semibold py-2"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>
        </Dialog>
    );
}
