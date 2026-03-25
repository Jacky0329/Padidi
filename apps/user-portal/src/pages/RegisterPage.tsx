import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { registerBuyer, loginBuyer } from '@padidi/shared/api/userApi';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await registerBuyer({ email, password, firstName, lastName });
            const res = await loginBuyer({ email, password });
            login(res);
            navigate('/', { replace: true });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number } };
            if (axiosErr.response?.status === 409) {
                setError('Email already registered.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-center">Create Account</h1>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded px-3 py-2" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50">
                    {loading ? 'Creating account…' : 'Register'}
                </button>
                <p className="text-sm text-center text-gray-500">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                </p>
            </form>
        </div>
    );
}
