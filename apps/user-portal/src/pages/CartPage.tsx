import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
    getCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    type CartItem,
} from '../store/cartStore';

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    const refresh = () => setItems(getCart());
    useEffect(() => { refresh(); }, []);

    const handleRemove = (variantId: string) => {
        removeFromCart(variantId);
        refresh();
    };

    const handleQty = (variantId: string, qty: number) => {
        updateQuantity(variantId, qty);
        refresh();
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
                <p>Your cart is empty.</p>
                <Link to="/" className="text-blue-600 hover:underline">Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 bg-white p-4 rounded shadow items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {item.imagePath && (
                                <img src={item.imagePath} alt={item.productName} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-500">
                                {item.size} / {item.color}
                            </p>
                            <p className="text-sm font-medium mt-1">${item.unitPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleQty(item.variantId, item.quantity - 1)}
                                className="w-8 h-8 border rounded text-lg leading-none"
                            >
                                −
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                                onClick={() => handleQty(item.variantId, item.quantity + 1)}
                                className="w-8 h-8 border rounded text-lg leading-none"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={() => handleRemove(item.variantId)}
                            className="text-red-500 hover:underline text-sm"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-white p-4 rounded shadow flex justify-between items-center">
                <span className="text-lg font-semibold">
                    Total: ${getCartTotal().toFixed(2)}
                </span>
                <button
                    onClick={() => navigate('/checkout')}
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
                >
                    Pay
                </button>
            </div>
        </div>
    );
}
