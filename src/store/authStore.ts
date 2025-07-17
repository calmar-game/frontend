import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  setAccessToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  cleanAccessToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoading: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  cleanAccessToken: () => set({ accessToken: null }),
}));