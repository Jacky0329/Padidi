import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { getCategories, getProducts, getActiveAds } from '@padidi/shared/api/userApi';
import type { CategoryDto, ProductDto } from '@padidi/shared/types/product';
import type { AdDto } from '@padidi/shared/types/ad';
import AdBanner from '../components/AdBanner';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [ads, setAds] = useState<AdDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories().then(setCategories);
        getActiveAds().then(setAds);
    }, []);

    useEffect(() => {
        setLoading(true);
        getProducts(categoryId).then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, [categoryId]);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">PADIDI Fashion</h1>

                {/* Ad Banners */}
                {ads.length > 0 && (
                    <div className="mb-8">
                        <AdBanner ads={ads} />
                    </div>
                )}

                {/* Category Filter */}
                <nav className="flex gap-2 mb-8 flex-wrap">
                    <Link
                        to="/"
                        className={`px-4 py-2 rounded-full text-sm font-medium ${!categoryId ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/categories/${cat.id}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${categoryId === cat.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* Product Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No products found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
