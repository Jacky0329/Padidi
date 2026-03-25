import { useEffect, useState, type FormEvent } from 'react';
import type { CategoryDto } from '@padidi/shared/types/product';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@padidi/shared/api/boApi';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        try {
            await createCategory({ name: name.trim() });
            setName('');
            load();
        } finally { setSaving(false); }
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;
        setSaving(true);
        try {
            await updateCategory(id, { name: editName.trim() });
            setEditId(null);
            load();
        } finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category?')) return;
        await deleteCategory(id);
        load();
    };

    if (loading) return <p className="p-6 text-gray-500">Loading categories…</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Categories</h2>

            <form onSubmit={handleCreate} className="flex gap-2 mb-6">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New category name"
                    className="border rounded px-3 py-2 flex-1"
                />
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Add
                </button>
            </form>

            <div className="bg-white rounded shadow">
                {categories.map((c) => (
                    <div key={c.id} className="flex items-center border-b last:border-b-0 px-4 py-3">
                        {editId === c.id ? (
                            <>
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="border rounded px-2 py-1 flex-1 mr-2"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(c.id)}
                                />
                                <button
                                    onClick={() => handleUpdate(c.id)}
                                    className="text-green-600 hover:underline text-sm mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditId(null)}
                                    className="text-gray-500 hover:underline text-sm"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1">{c.name}</span>
                                <button
                                    onClick={() => { setEditId(c.id); setEditName(c.name); }}
                                    className="text-blue-600 hover:underline text-sm mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                ))}
                {categories.length === 0 && (
                    <p className="text-center text-gray-500 py-6">No categories yet.</p>
                )}
            </div>
        </div>
    );
}
