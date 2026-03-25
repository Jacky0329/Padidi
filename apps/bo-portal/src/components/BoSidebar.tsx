import { NavLink } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const links = [
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/ads', label: 'Ads' },
    { to: '/orders', label: 'Orders' },
    { to: '/admin-users', label: 'Admin Users' },
];

export default function BoSidebar() {
    const { logout } = useAuth();

    return (
        <aside className="w-56 bg-gray-900 text-white min-h-screen flex flex-col">
            <div className="p-4 text-xl font-bold border-b border-gray-700">PADIDI Admin</div>
            <nav className="flex-1 p-2 space-y-1">
                {links.map(l => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded text-sm ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
                        }
                    >
                        {l.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button onClick={logout} className="text-red-400 hover:text-red-300 text-sm w-full text-left">
                    Logout
                </button>
            </div>
        </aside>
    );
}
