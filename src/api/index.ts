import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backendforgames.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  energyCurrent: number,
  energyMax: number,
  gameCoins: number,
  score: number,
  level: number,
  levelInd: number
}

export interface Player {
    id: string;
    rank: string;
    username: string;
    score: string;
}

export interface IResponse<T> { 
  message: string,
  success: boolean,
  data?: T
}

export async function loginUser(wallet: string): Promise<User | null> {
    try {
        const { data } = await api.get<IResponse<User>>(`/api/users/login/${wallet}`);


        if (data.data)
          return data.data

        else return null

    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

export async function registerUser(wallet: string, username: string): Promise<User | null> {
  try {
    const { data } = await api.post<IResponse<User>>(`/api/users/register`, {
      wallet,
      username
    });

    if (data.data)
      return data.data

    else return null

} catch (error) {
    console.error('Login error:', error);
    return null;
}
}

export async function getTopPlayers(): Promise<Player[]> {
    const response = await api.get('/api/leaderboard/top');
    return response.data;
}