import { useEffect, useState } from 'react';
import type { OrderDto } from '@padidi/shared/types/order';
import { getOrders } from '@padidi/shared/api/boApi';

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        getOrders().then(setOrders);
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Orders</h2>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-sm font-medium">Order ID</th>
                            <th className="px-4 py-3 text-sm font-medium">Buyer</th>
                            <th className="px-4 py-3 text-sm font-medium">Email</th>
                            <th className="px-4 py-3 text-sm font-medium">Items</th>
                            <th className="px-4 py-3 text-sm font-medium">Total</th>
                            <th className="px-4 py-3 text-sm font-medium">Date</th>
                            <th className="px-4 py-3 text-sm font-medium"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <>
                                <tr key={o.id} className="border-b">
                                    <td className="px-4 py-3 text-sm font-mono">{o.id.slice(0, 8)}…</td>
                                    <td className="px-4 py-3">{o.buyerNameSnapshot}</td>
                                    <td className="px-4 py-3 text-sm">{o.buyerEmailSnapshot}</td>
                                    <td className="px-4 py-3">{o.lineItems.length}</td>
                                    <td className="px-4 py-3 font-medium">${o.orderTotal.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm">{new Date(o.placedAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            {expanded === o.id ? 'Hide' : 'View'}
                                        </button>
                                    </td>
                                </tr>
                                {expanded === o.id && (
                                    <tr key={`${o.id}-detail`}>
                                        <td colSpan={7} className="px-8 py-4 bg-gray-50">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-gray-500">
                                                        <th className="text-left py-1">Product</th>
                                                        <th className="text-left py-1">Size</th>
                                                        <th className="text-left py-1">Color</th>
                                                        <th className="text-left py-1">Qty</th>
                                                        <th className="text-left py-1">Unit Price</th>
                                                        <th className="text-left py-1">Line Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {o.lineItems.map((li, idx) => (
                                                        <tr key={idx}>
                                                            <td className="py-1">{li.productNameSnapshot}</td>
                                                            <td className="py-1">{li.sizeSnapshot}</td>
                                                            <td className="py-1">{li.colorSnapshot}</td>
                                                            <td className="py-1">{li.quantity}</td>
                                                            <td className="py-1">${li.unitPriceSnapshot.toFixed(2)}</td>
                                                            <td className="py-1">${li.lineTotal.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No orders yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
