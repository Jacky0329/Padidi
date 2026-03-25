import { Link } from 'react-router';
import type { ProductDto } from '@padidi/shared/types/product';

interface Props {
    product: ProductDto;
}

export default function ProductCard({ product }: Props) {
    const outOfStock =
        product.variants.length > 0 && product.variants.every((v) => v.stockQuantity === 0);

    return (
        <Link
            to={`/products/${product.id}`}
            className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
        >
            {outOfStock && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                    Out of Stock
                </span>
            )}
            <div className={`aspect-square bg-gray-100 ${outOfStock ? 'opacity-50' : ''}`}>
                {(product.imagePaths?.[0] || product.imagePath) && (
                    <img src={product.imagePaths?.[0] || product.imagePath} alt={product.name} className="w-full h-full object-cover" />
                )}
            </div>
            <div className={`p-4 ${outOfStock ? 'opacity-60' : ''}`}>
                <h3 className="font-medium text-gray-900 group-hover:text-black">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
                <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>
            </div>
        </Link>
    );
}
