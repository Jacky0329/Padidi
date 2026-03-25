import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getCategories } from '@padidi/shared/api/userApi';
import type { CategoryDto } from '@padidi/shared/types/product';
import { getCartCount } from '../store/cartStore';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const { currentBuyer, logout, getBuyerName } = useAuth();

    useEffect(() => {
        getCategories().then(setCategories).catch(() => { });
        setCartCount(getCartCount());
        const interval = setInterval(() => setCartCount(getCartCount()), 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-indigo-600">PADIDI</Link>

                <nav className="hidden md:flex gap-4 items-center text-sm">
                    {categories.map(c => (
                        <Link key={c.id} to={`/categories/${c.id}`} className="hover:text-indigo-600">
                            {c.name}
                        </Link>
                    ))}
                    <Link to="/about" className="hover:text-indigo-600">About Us</Link>
                </nav>

                <div className="flex items-center gap-4 text-sm">
                    {currentBuyer && (
                        <span className="text-gray-600 hidden sm:block">
                            Welcome back, <strong>{getBuyerName()}</strong>
                        </span>
                    )}

                    <Link to="/cart" className="relative hover:text-indigo-600">
                        🛒
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {currentBuyer ? (
                        <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-indigo-600">Login</Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
