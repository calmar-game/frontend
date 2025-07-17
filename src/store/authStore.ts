import { create } from "zustand";
import { User } from "../api";

interface AuthState {
  accessToken: string | null;
  userProfile: User | null;
  isLoading: boolean;
  setAccessToken: (token: string | null) => void;
  setUserProfile: (profile: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => ({  accessToken: null, userProfile: null, isLoading: boolean })

}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userProfile: null,
  isLoading: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ accessToken: null, userProfile: null, isLoading: false }),
}));