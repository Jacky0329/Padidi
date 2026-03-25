import { useEffect, useState } from 'react';
import { getAboutInfo } from '@padidi/shared/api/userApi';
import type { AboutInfo } from '@padidi/shared/types/about';

export default function AboutPage() {
    const [info, setInfo] = useState<AboutInfo | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getAboutInfo()
            .then(setInfo)
            .catch(() => setError('Failed to load about information.'));
    }, []);

    if (error) return <p className="p-6 text-red-600">{error}</p>;
    if (!info) return <p className="p-6">Loading…</p>;

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">{info.companyName}</h1>
            <p className="text-xl text-gray-600 mb-6 italic">{info.tagline}</p>
            <p className="text-gray-700 leading-relaxed">{info.description}</p>
        </div>
    );
}
