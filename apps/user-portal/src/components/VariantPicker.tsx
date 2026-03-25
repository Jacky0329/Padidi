import { useState } from 'react';
import type { ProductVariantDto } from '@padidi/shared/types/product';

interface Props {
    variants: ProductVariantDto[];
    onVariantSelected: (variantId: string, size: string, color: string, stockQuantity: number) => void;
}

export default function VariantPicker({ variants, onVariantSelected }: Props) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const sizes = [...new Set(variants.map((v) => v.size))];
    const colors = [...new Set(variants.map((v) => v.color))];

    const selectedVariant =
        selectedSize && selectedColor
            ? variants.find((v) => v.size === selectedSize && v.color === selectedColor)
            : null;

    const handleSizeClick = (size: string) => {
        setSelectedSize(size);
        if (selectedColor) {
            const v = variants.find((v) => v.size === size && v.color === selectedColor);
            if (v) onVariantSelected(v.id, v.size, v.color, v.stockQuantity);
        }
    };

    const handleColorClick = (color: string) => {
        setSelectedColor(color);
        if (selectedSize) {
            const v = variants.find((v) => v.size === selectedSize && v.color === color);
            if (v) onVariantSelected(v.id, v.size, v.color, v.stockQuantity);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                <div className="flex gap-2 flex-wrap">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeClick(size)}
                            className={`px-3 py-1 border rounded text-sm ${selectedSize === size
                                ? 'border-black bg-black text-white'
                                : 'hover:border-gray-400'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                <div className="flex gap-2 flex-wrap">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => handleColorClick(color)}
                            className={`px-3 py-1 border rounded text-sm ${selectedColor === color
                                ? 'border-black bg-black text-white'
                                : 'hover:border-gray-400'
                                }`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            {selectedVariant && (
                <div className="text-sm">
                    {selectedVariant.stockQuantity > 0 ? (
                        <span className="text-green-600">{selectedVariant.stockQuantity} in stock</span>
                    ) : (
                        <span className="text-red-500 font-medium">Out of Stock</span>
                    )}
                </div>
            )}
        </div>
    );
}
