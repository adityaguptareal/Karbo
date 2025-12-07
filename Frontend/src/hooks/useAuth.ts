import { useState, useEffect } from 'react';
import { profileAPI } from '@/services/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    isBlocked: boolean;
    walletBalance: number;
    farmlandIds: string[];
    companyDocuments: string[];
    rejectionReason?: string;
}

interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    firstName: string;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await profileAPI.getProfile();
                if (response.user) {
                    setUser(response.user);
                }
            } catch (err: any) {
                console.error('Error fetching user profile:', err);
                setError(err.message || 'Failed to fetch user profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const firstName = user?.name ? user.name.split(' ')[0] : '';

    return { user, isLoading, error, firstName };
};
