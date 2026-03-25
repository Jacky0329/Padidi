import type { AdDto } from '@padidi/shared/types/ad';

interface Props {
    ads: AdDto[];
}

export default function AdBanner({ ads }: Props) {
    if (ads.length === 0) return null;

    return (
        <div className="flex gap-4 overflow-x-auto pb-2">
            {ads.map((ad) => (
                <a
                    key={ad.id}
                    href={ad.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                >
                    <img
                        src={ad.imagePath}
                        alt="Ad"
                        className="h-40 w-auto object-cover"
                    />
                </a>
            ))}
        </div>
    );
}
