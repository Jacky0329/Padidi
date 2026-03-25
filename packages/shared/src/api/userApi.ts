import axios from 'axios';
import type { CategoryDto, ProductDto } from '../types/product';
import type { CheckoutRequest, CheckoutResponse } from '../types/order';
import type { AdDto } from '../types/ad';
import type { BuyerRegisterRequest, BuyerLoginRequest, BuyerLoginResponse, BuyerProfile } from '../types/buyer';
import type { AboutInfo } from '../types/about';

const userApi = axios.create({
    baseURL: typeof window !== 'undefined'
        ? (import.meta as Record<string, Record<string, string>>).env?.VITE_USER_API_BASE_URL || ''
        : '',
});

userApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('buyer_jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export async function getCategories(): Promise<CategoryDto[]> {
    const { data } = await userApi.get<CategoryDto[]>('/api/categories');
    return data;
}

export async function getProducts(categoryId?: string): Promise<ProductDto[]> {
    const params = categoryId ? { categoryId } : {};
    const { data } = await userApi.get<ProductDto[]>('/api/products', { params });
    return data;
}

export async function getProductById(id: string): Promise<ProductDto> {
    const { data } = await userApi.get<ProductDto>(`/api/products/${id}`);
    return data;
}

export async function submitOrder(req: CheckoutRequest): Promise<CheckoutResponse> {
    const { data } = await userApi.post<CheckoutResponse>('/api/orders', req);
    return data;
}

export async function getActiveAds(): Promise<AdDto[]> {
    const { data } = await userApi.get<AdDto[]>('/api/ads/active');
    return data;
}

// Buyer Auth
export async function registerBuyer(req: BuyerRegisterRequest): Promise<BuyerProfile> {
    const { data } = await userApi.post<BuyerProfile>('/api/buyer/auth/register', req);
    return data;
}

export async function loginBuyer(req: BuyerLoginRequest): Promise<BuyerLoginResponse> {
    const { data } = await userApi.post<BuyerLoginResponse>('/api/buyer/auth/login', req);
    return data;
}

export async function getBuyerAccount(): Promise<BuyerProfile> {
    const { data } = await userApi.get<BuyerProfile>('/api/buyer/account');
    return data;
}

// About
export async function getAboutInfo(): Promise<AboutInfo> {
    const { data } = await userApi.get<AboutInfo>('/api/about');
    return data;
}

export { userApi };
