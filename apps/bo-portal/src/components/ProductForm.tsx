import { useState, useEffect, useRef, type FormEvent } from 'react';
import type {
    ProductDto,
    CategoryDto,
} from '@padidi/shared/types/product';
import {
    getCategories,
    createProduct,
    updateProduct,
    uploadImage,
    createVariant,
    updateVariant,
    deleteVariant,
} from '@padidi/shared/api/boApi';

interface Props {
    product?: ProductDto;
    onDone: () => void;
}

interface VariantRow {
    id?: string;
    size: string;
    color: string;
    stockQuantity: number;
}

export default function ProductForm({ product, onDone }: Props) {
    const isEdit = !!product;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(product?.name ?? '');
    const [description, setDescription] = useState(product?.description ?? '');
    const [price, setPrice] = useState(product?.price?.toString() ?? '');
    const [categoryId, setCategoryId] = useState<string>(product?.category?.id ?? '');
    const [imagePaths, setImagePaths] = useState<string[]>(
        product?.imagePaths?.length
            ? product.imagePaths
            : product?.imagePath
                ? [product.imagePath]
                : []
    );
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [variants, setVariants] = useState<VariantRow[]>(
        product?.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            stockQuantity: v.stockQuantity,
        })) ?? [{ size: '', color: '', stockQuantity: 0 }],
    );
    const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleImageUpload = async (files: FileList) => {
        setUploading(true);
        try {
            const newPaths: string[] = [];
            for (const file of Array.from(files)) {
                const res = await uploadImage(file);
                newPaths.push(res.imagePath);
            }
            setImagePaths((prev) => [...prev, ...newPaths]);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImagePaths((prev) => prev.filter((_, i) => i !== index));
    };

    const addVariant = () => setVariants([...variants, { size: '', color: '', stockQuantity: 0 }]);
    const removeVariant = (i: number) => {
        const row = variants[i];
        if (row?.id) setDeletedVariantIds((prev) => [...prev, row.id!]);
        setVariants(variants.filter((_, idx) => idx !== i));
    };
    const updateVariantField = (i: number, field: keyof VariantRow, value: string | number) => {
        setVariants(variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setValidationError('');
        const p = parseFloat(price);
        if (isNaN(p) || p <= 0) { setValidationError('Price must be greater than 0.'); return; }
        for (const v of variants) {
            if (v.stockQuantity < 0) { setValidationError('Stock cannot be negative.'); return; }
        }
        setSaving(true);
        try {
            const validVariants = variants.filter((v) => v.size || v.color);

            if (isEdit) {
                await updateProduct(product!.id, {
                    name,
                    description,
                    price: parseFloat(price),
                    categoryId,
                    imagePath: imagePaths[0] ?? '',
                    imagePaths,
                });
                await Promise.all(deletedVariantIds.map((vid) => deleteVariant(product!.id, vid)));
                await Promise.all(
                    validVariants
                        .filter((v) => v.id)
                        .map((v) => updateVariant(product!.id, v.id!, { size: v.size, color: v.color, stockQuantity: v.stockQuantity }))
                );
                await Promise.all(
                    validVariants
                        .filter((v) => !v.id)
                        .map((v) => createVariant(product!.id, { size: v.size, color: v.color, stockQuantity: v.stockQuantity }))
                );
            } else {
                await createProduct({
                    name,
                    description,
                    price: parseFloat(price),
                    categoryId,
                    imagePath: imagePaths[0] ?? '',
                    imagePaths,
                    variants: validVariants.map((v) => ({ size: v.size, color: v.color, stockQuantity: v.stockQuantity })),
                });
            }
            onDone();
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-2xl space-y-4">
            <h2 className="text-xl font-bold">{isEdit ? 'Edit Product' : 'New Product'}</h2>
            {validationError && <p className="text-red-600 text-sm">{validationError}</p>}

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        required
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        required
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select…</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.length) handleImageUpload(e.target.files);
                        e.target.value = '';
                    }}
                />
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    {uploading ? 'Uploading…' : '+ Choose Files'}
                </button>
                {imagePaths.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {imagePaths.map((path, i) => (
                            <div key={i} className="relative w-20 h-20 rounded overflow-hidden border">
                                <img src={path} alt={`preview ${i + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Variants</label>
                    <button type="button" onClick={addVariant} className="text-blue-600 text-sm hover:underline">
                        + Add
                    </button>
                </div>
                {variants.map((v, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-end">
                        {v.id && (
                            <span className="text-xs text-gray-400 self-center w-4" title="Existing variant">•</span>
                        )}
                        <input
                            placeholder="Size"
                            value={v.size}
                            onChange={(e) => updateVariantField(i, 'size', e.target.value)}
                            className="border rounded px-2 py-1 flex-1"
                        />
                        <input
                            placeholder="Color"
                            value={v.color}
                            onChange={(e) => updateVariantField(i, 'color', e.target.value)}
                            className="border rounded px-2 py-1 flex-1"
                        />
                        <input
                            type="number"
                            min="0"
                            placeholder="Stock"
                            value={v.stockQuantity}
                            onChange={(e) => updateVariantField(i, 'stockQuantity', parseInt(e.target.value) || 0)}
                            className="border rounded px-2 py-1 w-20"
                        />
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-500 text-sm">
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
                </button>
                <button
                    type="button"
                    onClick={onDone}
                    className="border px-4 py-2 rounded hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
