import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { BuyerLoginResponse, BuyerProfile } from '@padidi/shared/types/buyer';

const JWT_KEY = 'buyer_jwt';
const INFO_KEY = 'buyer_info';

function getStoredBuyer(): BuyerProfile | null {
    try {
        const raw = localStorage.getItem(INFO_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function useAuth() {
    const navigate = useNavigate();
    const [currentBuyer, setCurrentBuyer] = useState<BuyerProfile | null>(getStoredBuyer);

    const isAuthenticated = !!localStorage.getItem(JWT_KEY);

    const login = useCallback((response: BuyerLoginResponse) => {
        localStorage.setItem(JWT_KEY, response.token);
        localStorage.setItem(INFO_KEY, JSON.stringify(response.buyer));
        setCurrentBuyer(response.buyer);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(JWT_KEY);
        localStorage.removeItem(INFO_KEY);
        setCurrentBuyer(null);
        navigate('/login', { replace: true });
    }, [navigate]);

    const getBuyerName = () => {
        const b = getStoredBuyer();
        return b ? [b.firstName, b.lastName].filter(Boolean).join(' ') || b.email : '';
    };

    const getBuyerEmail = () => getStoredBuyer()?.email ?? '';

    return { isAuthenticated, currentBuyer, login, logout, getBuyerName, getBuyerEmail };
}
