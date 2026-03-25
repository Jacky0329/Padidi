import axios from 'axios';
import type { AdminLoginRequest, AdminLoginResponse, AdminUserDto, AdminUserCreateRequest, AdminUserUpdateRequest } from '../types/admin';
import type {
    CategoryDto,
    CategoryCreateRequest,
    CategoryUpdateRequest,
    ProductDto,
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductVariantCreateRequest,
    ProductVariantUpdateRequest,
    ProductVariantDto,
} from '../types/product';
import type { AdDto, AdUpdateRequest } from '../types/ad';
import type { OrderDto } from '../types/order';

const boApi = axios.create({
    baseURL: typeof window !== 'undefined'
        ? (import.meta as Record<string, Record<string, string>>).env?.VITE_BO_API_BASE_URL || ''
        : '',
});

boApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('bo_jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth
export async function adminLogin(req: AdminLoginRequest): Promise<AdminLoginResponse> {
    const { data } = await boApi.post<AdminLoginResponse>('/api/admin/auth/login', req);
    return data;
}

// Categories
export async function getCategories(): Promise<CategoryDto[]> {
    const { data } = await boApi.get<CategoryDto[]>('/api/categories');
    return data;
}

export async function createCategory(req: CategoryCreateRequest): Promise<CategoryDto> {
    const { data } = await boApi.post<CategoryDto>('/api/categories', req);
    return data;
}

export async function updateCategory(id: string, req: CategoryUpdateRequest): Promise<CategoryDto> {
    const { data } = await boApi.put<CategoryDto>(`/api/categories/${id}`, req);
    return data;
}

export async function deleteCategory(id: string): Promise<void> {
    await boApi.delete(`/api/categories/${id}`);
}

// Products
export async function getProducts(): Promise<ProductDto[]> {
    const { data } = await boApi.get<ProductDto[]>('/api/products');
    return data;
}

export async function createProduct(body: ProductCreateRequest): Promise<ProductDto> {
    const { data } = await boApi.post<ProductDto>('/api/products', body);
    return data;
}

export async function updateProduct(id: string, body: ProductUpdateRequest): Promise<ProductDto> {
    const { data } = await boApi.put<ProductDto>(`/api/products/${id}`, body);
    return data;
}

export async function deleteProduct(id: string): Promise<void> {
    await boApi.delete(`/api/products/${id}`);
}

// Variants
export async function createVariant(productId: string, req: ProductVariantCreateRequest): Promise<ProductVariantDto> {
    const { data } = await boApi.post<ProductVariantDto>(`/api/products/${productId}/variants`, req);
    return data;
}

export async function updateVariant(productId: string, variantId: string, req: ProductVariantUpdateRequest): Promise<ProductVariantDto> {
    const { data } = await boApi.put<ProductVariantDto>(`/api/products/${productId}/variants/${variantId}`, req);
    return data;
}

export async function deleteVariant(productId: string, variantId: string): Promise<void> {
    await boApi.delete(`/api/products/${productId}/variants/${variantId}`);
}

// Uploads
export async function uploadImage(file: File): Promise<{ imagePath: string }> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await boApi.post<{ imagePath: string }>('/api/uploads', form);
    return data;
}

// Ads
export async function getAds(): Promise<AdDto[]> {
    const { data } = await boApi.get<AdDto[]>('/api/ads');
    return data;
}

export async function createAd(form: FormData): Promise<AdDto> {
    const { data } = await boApi.post<AdDto>('/api/ads', form);
    return data;
}

export async function updateAd(id: string, body: AdUpdateRequest): Promise<AdDto> {
    const { data } = await boApi.put<AdDto>(`/api/ads/${id}`, body);
    return data;
}

export async function deleteAd(id: string): Promise<void> {
    await boApi.delete(`/api/ads/${id}`);
}

// Orders (admin)
export async function getOrders(): Promise<OrderDto[]> {
    const { data } = await boApi.get<OrderDto[]>('/api/orders');
    return data;
}

export async function getOrderById(id: string): Promise<OrderDto> {
    const { data } = await boApi.get<OrderDto>(`/api/orders/${id}`);
    return data;
}

// Admin Users
export async function getAdminUsers(): Promise<AdminUserDto[]> {
    const { data } = await boApi.get<AdminUserDto[]>('/api/admin/users');
    return data;
}

export async function createAdminUser(req: AdminUserCreateRequest): Promise<AdminUserDto> {
    const { data } = await boApi.post<AdminUserDto>('/api/admin/users', req);
    return data;
}

export async function updateAdminUser(id: string, req: AdminUserUpdateRequest): Promise<AdminUserDto> {
    const { data } = await boApi.put<AdminUserDto>(`/api/admin/users/${id}`, req);
    return data;
}

export async function deleteAdminUser(id: string): Promise<void> {
    await boApi.delete(`/api/admin/users/${id}`);
}

export { boApi };
