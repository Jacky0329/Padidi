import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '@padidi/shared/api/boApi';

export function useAuth() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!localStorage.getItem('bo_jwt');

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminLogin({ email, password });
            localStorage.setItem('bo_jwt', res.token);
            navigate('/products', { replace: true });
        } catch {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem('bo_jwt');
        navigate('/login', { replace: true });
    }, [navigate]);

    return { isAuthenticated, login, logout, loading, error };
}
