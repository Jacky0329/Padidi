export interface CartItemRequest {
    variantId: string;
    productName: string;
    unitPrice: number;
    size: string;
    color: string;
    quantity: number;
}

export interface CheckoutRequest {
    buyerName: string;
    buyerEmail: string;
    cartItems: CartItemRequest[];
}

export interface OrderLineItemDto {
    productNameSnapshot: string;
    unitPriceSnapshot: number;
    sizeSnapshot: string;
    colorSnapshot: string;
    quantity: number;
    lineTotal: number;
}

export interface OrderDto {
    id: string;
    buyerNameSnapshot: string;
    buyerEmailSnapshot: string;
    orderTotal: number;
    placedAt: string;
    lineItems: OrderLineItemDto[];
}

export interface CheckoutResponse {
    message: string;
    order: OrderDto;
}

export interface InsufficientVariant {
    variantId: string;
    productName: string;
    size: string;
    color: string;
}
