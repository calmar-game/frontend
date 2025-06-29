import { useState, useEffect } from 'react';
import { User, loginUser } from '../api';

export function useUser(wallet: string | null) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            if (!wallet) {
                setUser(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const userData = await loginUser(wallet);
                setUser(userData);
            } catch (err) {
                setError('Failed to fetch user data');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [wallet]);

    return { user, isLoading, error };
}
