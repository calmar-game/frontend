import { useWallet } from "@solana/wallet-adapter-react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export function useWalletSession() {
    const { publicKey } = useWallet();
    const logout = useAuthStore(s => s.logout);
    const navigate = useNavigate();
    const hadWallet = useRef(false);
  
    useEffect(() => {
      if (publicKey) {
        if (!hadWallet.current) alert("🔌 Connected");
        hadWallet.current = true;
      } else if (hadWallet.current) {
        alert("❌ Disconnected");
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        logout();
        navigate("/")
        hadWallet.current = false;
      }
    }, [publicKey, logout, navigate]);
  }
  