import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export interface Player {
    id: string;
    rank: string;
    username: string;
    score: string;
}

export async function getTopPlayers() : Promise<Player[]> {
    const response = await api.get('/api/leaderboard/top');
    return response.data;
}