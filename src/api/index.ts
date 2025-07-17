import axios from 'axios';
import { CharacterClass } from '../constants/avatars';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await fetch('http://localhost:8000/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Refresh failed');

        const { data } = await res.json();
        const token = data?.accessToken;
        if (!token) throw new Error('No token returned');

        original.headers['Authorization'] = `Bearer ${token}`;
        return api(original); // ⬅️ Повтор запроса
      } catch {
        if (!['/'].includes(window.location.pathname)) {
          document.cookie = 'refreshToken=; Max-Age=0; path=/'; // Очистка cookie
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(err);
  }
);


export default api;

export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  energyCurrent: number;
  energyMax: number;
  gameCoins: number;
  score: number;
  level: number;
  levelInd: number;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  link?: string;
  condition: string;
  value: number;
}

export interface Player {
  id: string;
  rank: string;
  username: string;
  score: string;
}

export interface IResponse<T> {
  message: string;
  success: boolean;
  data?: T;
}

export async function loginUser(wallet: string, signature: string, nonce: string): Promise<User | null> {
    const data = await api.post<IResponse<User>>('/api/auth/login', {
      walletAddress: wallet,
      signature,
      nonce,
    });

    return data.data;
}

export async function getNonce(walletAddress: string): Promise<string | null> {
  const data = await api.get<IResponse<{ nonce: string }>>(`/api/auth/nonce/${walletAddress}`);
  return data.data;
}

export async function getGuestNonce(): Promise<string | null> {
  const data = await api.get<IResponse<{ nonce: string }>>('/api/auth/nonce/guest/random');
  return data.data;
}

export async function registration(
  walletAddress: string,
  username: string,
  signature: string,
  nonce: string
): Promise<User | null> {
  const data = await api.post<IResponse<User>>('/api/auth/register', {
      walletAddress,
      username,
      signature,
      nonce,
    });
    return data.data;
}

export async function getTopPlayers(): Promise<Player[]> {
  const response = await api.get('/api/leaderboard/top');
  return response.data;
}

export async function refreshAccessToken() {
  const data = await api.post<IResponse<{ accessToken: string }>>('/api/auth/refresh');
  return data.data;
}

export async function getProfile(accessToken: string) {
  const response = await api.get<IResponse<User>>('/api/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export async function updateProfile(data: { username: string; characterClass: CharacterClass }, accessToken: string) {
  const res = await api.patch<IResponse<User>>('/api/profile', data, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return res.data;
}


export async function getTasks() {
  const response = await api.get<IResponse<Task[]>>('/api/tasks');
  return response.data;
}

export async function logout(accessToken: string): Promise<void> {
  await api.post('/api/auth/logout', {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}