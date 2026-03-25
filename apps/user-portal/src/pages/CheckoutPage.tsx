import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { getCart, clearCart } from '../store/cartStore';
import { submitOrder } from '@padidi/shared/api/userApi';
import type { CheckoutResponse, InsufficientVariant } from '@padidi/shared/types/order';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [buyerName, setBuyerName] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stockError, setStockError] = useState<InsufficientVariant[]>([]);
    const [result, setResult] = useState<CheckoutResponse | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setStockError([]);

        const cart = getCart();
        if (cart.length === 0) {
            setError('Cart is empty.');
            setSubmitting(false);
            return;
        }

        try {
            const res = await submitOrder({
                buyerName,
                buyerEmail,
                cartItems: cart.map((item) => ({
                    variantId: item.variantId,
                    productName: item.productName,
                    unitPrice: item.unitPrice,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                })),
            });
            clearCart();
            setResult(res);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number; data?: { error?: string; insufficientVariants?: InsufficientVariant[] } } };
            if (axiosErr.response?.status === 409 && axiosErr.response.data?.error === 'INSUFFICIENT_STOCK') {
                setStockError(axiosErr.response.data.insufficientVariants ?? []);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow max-w-md text-center space-y-4">
                    <h2 className="text-xl font-bold">Order Placed</h2>
                    <p className="text-amber-600 font-medium">{result.message}</p>
                    <div className="text-left text-sm space-y-1">
                        <p><strong>Order ID:</strong> {result.order.id}</p>
                        <p><strong>Total:</strong> ${result.order.orderTotal.toFixed(2)}</p>
                        <p><strong>Items:</strong> {result.order.lineItems.length}</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {stockError.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <p className="font-medium text-red-800 mb-2">Some items are out of stock:</p>
                    <ul className="list-disc list-inside text-sm text-red-700">
                        {stockError.map((v) => (
                            <li key={v.variantId}>
                                {v.productName} — {v.size} / {v.color}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        required
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <hr className="my-2" />
                <p className="text-sm text-gray-500">Payment (mock)</p>

                <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <input
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Expiry</label>
                        <input
                            required
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <input
                            required
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="123"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                    {submitting ? 'Processing…' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}
