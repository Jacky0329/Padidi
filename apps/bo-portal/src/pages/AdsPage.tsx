import { useEffect, useState, type FormEvent } from 'react';
import type { AdDto } from '@padidi/shared/types/ad';
import { getAds, createAd, updateAd, deleteAd } from '@padidi/shared/api/boApi';

export default function AdsPage() {
    const [ads, setAds] = useState<AdDto[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editAd, setEditAd] = useState<AdDto | null>(null);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const data = await getAds();
        setAds(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this ad?')) return;
        await deleteAd(id);
        load();
    };

    const handleEdit = (ad: AdDto) => {
        setEditAd(ad);
        setRedirectUrl(ad.redirectUrl);
        setIsActive(ad.isActive);
        setShowForm(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editAd) {
                await updateAd(editAd.id, { redirectUrl, isActive });
            } else {
                if (!file) return;
                const form = new FormData();
                form.append('image', file);
                form.append('redirectUrl', redirectUrl);
                form.append('isActive', String(isActive));
                await createAd(form);
            }
            resetForm();
            load();
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditAd(null);
        setRedirectUrl('');
        setIsActive(true);
        setFile(null);
    };

    if (loading) return <p className="p-6 text-gray-500">Loading ads…</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Ad Banners</h2>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + New Ad
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 max-w-lg space-y-4">
                    <h3 className="font-medium">{editAd ? 'Edit Ad' : 'Create Ad'}</h3>
                    {!editAd && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Image</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                required={!editAd}
                                className="text-sm"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Redirect URL</label>
                        <input
                            required
                            type="url"
                            value={redirectUrl}
                            onChange={(e) => setRedirectUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            id="isActive"
                        />
                        <label htmlFor="isActive" className="text-sm">Active</label>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving…' : editAd ? 'Update' : 'Create'}
                        </button>
                        <button type="button" onClick={resetForm} className="border px-4 py-2 rounded hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-sm font-medium">Image</th>
                            <th className="px-4 py-3 text-sm font-medium">Redirect URL</th>
                            <th className="px-4 py-3 text-sm font-medium">Active</th>
                            <th className="px-4 py-3 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ads.map((ad) => (
                            <tr key={ad.id} className="border-b last:border-b-0">
                                <td className="px-4 py-3">
                                    <img src={ad.imagePath} alt="Ad" className="h-12 w-auto rounded" />
                                </td>
                                <td className="px-4 py-3 text-sm truncate max-w-xs">{ad.redirectUrl}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-sm ${ad.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                        {ad.isActive ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 space-x-2">
                                    <button onClick={() => handleEdit(ad)} className="text-blue-600 hover:underline text-sm">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(ad.id)} className="text-red-600 hover:underline text-sm">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {ads.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No ads yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
