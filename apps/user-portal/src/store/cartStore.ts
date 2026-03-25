export interface CartItem {
    variantId: string;
    productId: string;
    productName: string;
    imagePath: string;
    size: string;
    color: string;
    unitPrice: number;
    quantity: number;
}

const CART_KEY_BASE = 'padidi_cart';

function getCartKey(): string {
    try {
        const info = localStorage.getItem('buyer_info');
        if (info) {
            const parsed = JSON.parse(info);
            if (parsed?.id) return `${CART_KEY_BASE}_${parsed.id}`;
        }
    } catch { /* fallback to guest key */ }
    return CART_KEY_BASE;
}

function read(): CartItem[] {
    try {
        const raw = localStorage.getItem(getCartKey());
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function write(items: CartItem[]) {
    localStorage.setItem(getCartKey(), JSON.stringify(items));
}

export function getCart(): CartItem[] {
    return read();
}

export function addToCart(item: CartItem) {
    const items = read();
    const existing = items.find((i) => i.variantId === item.variantId);
    if (existing) {
        existing.quantity += item.quantity;
    } else {
        items.push(item);
    }
    write(items);
}

export function removeFromCart(variantId: string) {
    const items = read().filter((i) => i.variantId !== variantId);
    write(items);
}

export function updateQuantity(variantId: string, qty: number) {
    const items = read();
    const item = items.find((i) => i.variantId === variantId);
    if (item) {
        item.quantity = Math.max(1, qty);
        write(items);
    }
}

export function clearCart() {
    localStorage.removeItem(getCartKey());
}

export function getCartTotal(): number {
    return read().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function getCartCount(): number {
    return read().reduce((sum, item) => sum + item.quantity, 0);
}
