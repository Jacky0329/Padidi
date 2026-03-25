import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { getProductById } from '@padidi/shared/api/userApi';
import type { ProductDto } from '@padidi/shared/types/product';
import VariantPicker from '../components/VariantPicker';
import { addToCart } from '../store/cartStore';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<{
        variantId: string;
        size: string;
        color: string;
        stockQuantity: number;
    } | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getProductById(id).then((data) => {
            setProduct(data);
            const firstImg = data.imagePaths?.[0] || data.imagePath || '';
            setActiveImage(firstImg);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Product not found</div>;
    }

    const allImages = [...new Set(
        [product.imagePath, ...(product.imagePaths ?? [])].filter((p): p is string => !!p)
    )];

    const handleAddToCart = () => {
        if (!selectedVariant || selectedVariant.stockQuantity === 0) return;
        addToCart({
            variantId: selectedVariant.variantId,
            productId: product.id,
            productName: product.name,
            imagePath: product.imagePath ?? '',
            size: selectedVariant.size,
            color: selectedVariant.color,
            unitPrice: product.price,
            quantity,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Link to="/" className="text-sm text-gray-500 hover:text-black mb-4 inline-block">
                    &larr; Back to products
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* Product Image Gallery */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {activeImage ? (
                                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">👗</div>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setActiveImage(img)}
                                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-colors ${activeImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <p className="text-sm text-gray-500">{product.category.name}</p>
                        <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
                        <p className="text-2xl font-semibold mt-4">${product.price.toFixed(2)}</p>
                        <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

                        {/* Variant Picker */}
                        <div className="mt-6">
                            <VariantPicker
                                variants={product.variants}
                                onVariantSelected={(variantId, size, color, stockQuantity) =>
                                    setSelectedVariant({ variantId, size, color, stockQuantity })
                                }
                            />
                        </div>

                        {/* Quantity Selector */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-8 h-8 rounded border flex items-center justify-center text-lg leading-none hover:bg-gray-100"
                                >−</button>
                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-14 text-center border rounded py-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="w-8 h-8 rounded border flex items-center justify-center text-lg leading-none hover:bg-gray-100"
                                >+</button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="mt-6">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {added ? 'Added to cart!' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Variant Stock Table */}
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Stock by Variant</h3>
                            <div className="border rounded overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-3 py-2">Size</th>
                                            <th className="text-left px-3 py-2">Color</th>
                                            <th className="text-left px-3 py-2">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.variants.map((v) => (
                                            <tr key={v.id} className="border-t">
                                                <td className="px-3 py-2">{v.size}</td>
                                                <td className="px-3 py-2">{v.color}</td>
                                                <td className="px-3 py-2">
                                                    {v.stockQuantity > 0 ? (
                                                        <span className="text-green-600">{v.stockQuantity} in stock</span>
                                                    ) : (
                                                        <span className="text-red-500">Out of stock</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
