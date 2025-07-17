import { useWallet } from "@solana/wallet-adapter-react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { logout as logoutRequest } from "../api";

export function useWalletSession() {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const cleanAccessToken = useAuthStore((s) => s.cleanAccessToken);
  const hadWallet = useRef(false);

  useEffect(() => {
    const handleDisconnect = async () => {
      if (publicKey) {
        if (!hadWallet.current) console.log("🔌 Connected");
        hadWallet.current = true;
      } else if (hadWallet.current) {
        console.error("❌ Disconnected");

        try {
          if (accessToken) {
            await logoutRequest(accessToken);
          }
        } catch (err) {
          console.warn("Logout request failed:", err);
        }

        cleanAccessToken();
        navigate("/");
        hadWallet.current = false;
      }
    };

    handleDisconnect();
  }, [publicKey, accessToken, cleanAccessToken, navigate]);
}