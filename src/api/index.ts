import axios from 'axios';
import { CharacterClass } from '../constants/avatars';

const api = axios.create({
  baseURL: 'https://backendforgames.com',
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
        const res = await fetch('https://backendforgames.com/api/auth/refresh', {
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
  accessToken?: string;
  walletAddress: string;
  username?: string;
  energyCurrent: number;
  energyMax: number;
  gameCoins: number;
  score: number;
  level: number;
  levelInd: number;
  characterClass: CharacterClass;
  avatar: string;
  place?: number;
  totalUsers?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  link?: string;
  condition: string;
  value: number;
  createdAt?: string;
  updatedAt?: string;
  completed?: boolean;
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
    const data = await api.post<User>('/api/auth/login', {
      walletAddress: wallet,
      signature,
      nonce,
    });

    return data.data;
}

export async function getNonce(walletAddress: string): Promise<{ nonce: string } | null> {
  const data = await api.get<{ nonce: string }>(`/api/auth/nonce/${walletAddress}`);
  return data.data;
}

export async function getGuestNonce(): Promise<{ nonce: string } | null> {
  const data = await api.get<{ nonce: string }>('/api/auth/nonce/guest/random');
  return data.data;
}

export async function registration(
  walletAddress: string,
  username: string,
  signature: string,
  nonce: string
): Promise<User | null> {
  const data = await api.post<User>('/api/auth/register', {
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
  const data = await api.post<{ accessToken: string }>('/api/auth/refresh');
  return data.data;
}

export async function getProfile(accessToken: string): Promise<User> {
  const response = await api.get<User>('/api/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export async function updateProfile(data: { username: string; characterClass: CharacterClass }, accessToken: string): Promise<User> {
  const res = await api.patch<User>('/api/profile', data, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return res.data;
}


export async function getTasks(accessToken: string): Promise<Task[]> {
  const response = await api.get<Task[]>('/api/tasks', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export async function completeTask(accessToken: string, taskId: number): Promise<User> {
  const response = await api.post<User>(`/api/tasks/complete/${taskId}`, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export async function logout(accessToken: string): Promise<void> {
  await api.post('/api/auth/logout', {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function gameLogin(
  username: string,
  password: string
): Promise<IResponse<User>> {
  const response = await api.post<IResponse<User>>('/api/users/login', {
    username,
    password
  });
  return response.data;
}

export async function getGameToken(accessToken: string): Promise<IResponse<{ accessToken: string }>> {
  const response = await api.get<IResponse<{ accessToken: string }>>('/api/users/game/token', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}