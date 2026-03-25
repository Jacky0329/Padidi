import { useEffect, useState } from 'react';
import type { ProductDto } from '@padidi/shared/types/product';
import { getProducts, deleteProduct } from '@padidi/shared/api/boApi';
import ProductForm from '../components/ProductForm';

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState<ProductDto | null>(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        await deleteProduct(id);
        load();
    };

    if (loading) return <p className="p-6 text-gray-500">Loading products…</p>;

    if (showForm || editProduct) {
        return (
            <ProductForm
                product={editProduct ?? undefined}
                onDone={() => {
                    setShowForm(false);
                    setEditProduct(null);
                    load();
                }}
            />
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Products</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + New Product
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-sm font-medium">Name</th>
                            <th className="px-4 py-3 text-sm font-medium">Price</th>
                            <th className="px-4 py-3 text-sm font-medium">Category</th>
                            <th className="px-4 py-3 text-sm font-medium">Variants</th>
                            <th className="px-4 py-3 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-b last:border-b-0">
                                <td className="px-4 py-3">{p.name}</td>
                                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                                <td className="px-4 py-3">{p.categoryName}</td>
                                <td className="px-4 py-3">{p.variants.length}</td>
                                <td className="px-4 py-3 space-x-2">
                                    <button
                                        onClick={() => setEditProduct(p)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                    No products yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
