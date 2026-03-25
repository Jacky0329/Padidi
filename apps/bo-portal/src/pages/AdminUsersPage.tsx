import { useEffect, useState } from 'react';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@padidi/shared/api/boApi';
import type { AdminUserDto, AdminUserCreateRequest, AdminUserUpdateRequest } from '@padidi/shared/types/admin';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function load() {
        setLoading(true);
        try {
            setUsers(await getAdminUsers());
        } catch {
            setError('Failed to load admin users');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    function openCreate() {
        setEditingId(null);
        setEmail('');
        setPassword('');
        setError('');
        setShowForm(true);
    }

    function openEdit(u: AdminUserDto) {
        setEditingId(u.id);
        setEmail(u.email);
        setPassword('');
        setError('');
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                const body: AdminUserUpdateRequest = { email, password: password || undefined };
                await updateAdminUser(editingId, body);
            } else {
                if (!password) { setError('Password is required'); return; }
                const body: AdminUserCreateRequest = { email, password };
                await createAdminUser(body);
            }
            setShowForm(false);
            await load();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Operation failed';
            setError(msg);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this admin user?')) return;
        try {
            await deleteAdminUser(id);
            await load();
        } catch {
            setError('Failed to delete admin user');
        }
    }

    if (loading) return <p className="p-6">Loading…</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Admin Users</h1>
                <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Add Admin
                </button>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded space-y-3 bg-gray-50">
                    <h2 className="font-semibold">{editingId ? 'Edit Admin User' : 'New Admin User'}</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="password"
                        placeholder={editingId ? 'New password (leave blank to keep)' : 'Password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Created</th>
                        <th className="border p-2 w-40">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-b">
                            <td className="border p-2">{u.email}</td>
                            <td className="border p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="border p-2 space-x-2">
                                <button onClick={() => openEdit(u)} className="text-indigo-600 hover:underline">Edit</button>
                                <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr><td colSpan={3} className="p-4 text-center text-gray-500">No admin users found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
