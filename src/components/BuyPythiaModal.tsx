import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
// import { useWallet as useAppWallet } from "../context/WalletContext";
import { buyPythia } from "../utils/buyPythia";
import { Dialog } from "@headlessui/react";
import { Connection } from "@solana/web3.js";
import { Loader2 } from "lucide-react";
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
    const [solAmount, setSolAmount] = useState(0.1);
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
            const transaction = await buyPythia(solAmount, publicKey);

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

            // Обновляем баланс PYTHIA
            await refreshBalance();

            if (onSuccess) {
                onSuccess();
            }
            
            alert(`✅ Successfully purchased! Transaction: ${signature}`);
            onClose();
        } catch (error) {
            console.error("Error buying PYTHIA:", error);
            alert(`❌ Error purchasing PYTHIA: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <div className="fixed inset-0 bg-black/70" />
            
            <div className="relative glass-effect pixel-corners p-6 md:p-8 max-w-sm w-full mx-4">
                <h2 className="text-xl text-[#00ff00] mb-6 text-center tracking-wider">
                    BUY PYTHIA TOKENS
                </h2>
                
                <div className="mb-6">
                    <label className="block text-[#00ff00] text-sm mb-2">
                        AMOUNT (SOL)
                    </label>
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={solAmount}
                        onChange={(e) => setSolAmount(parseFloat(e.target.value))}
                        className="w-full bg-black/30 text-white px-4 py-3 glass-effect pixel-corners
                                focus:outline-none focus:ring-1 focus:ring-[#00ff00]
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    />
                </div>
                
                <button
                    className="w-full bg-[#00ff00] text-black p-4 pixel-corners
                             hover:neon-box transition-all duration-300
                             flex items-center justify-center gap-3 text-base font-bold tracking-wider
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBuy}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            PROCESSING...
                        </>
                    ) : (
                        `BUY FOR ${solAmount} SOL`
                    )}
                </button>

                {txId && (
                    <div className="mt-4 text-center">
                        <a
                            href={`https://solscan.io/tx/${txId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00ff00] text-sm hover:underline"
                        >
                            View Transaction
                        </a>
                    </div>
                )}

                <button 
                    className="mt-4 w-full text-gray-400 hover:text-white transition-colors"
                    onClick={onClose}
                    disabled={loading}
                >
                    CLOSE
                </button>
            </div>
        </Dialog>
    );
}
