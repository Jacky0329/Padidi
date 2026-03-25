export interface CategoryDto {
    id: string;
    name: string;
}

export interface ProductVariantDto {
    id: string;
    size: string;
    color: string;
    stockQuantity: number;
}

export interface ProductDto {
    id: string;
    name: string;
    description: string;
    imagePath: string;
    imagePaths: string[];
    price: number;
    category: CategoryDto;
    variants: ProductVariantDto[];
}

export interface CategoryCreateRequest {
    name: string;
}

export interface CategoryUpdateRequest {
    name: string;
}

export interface ProductVariantCreateRequest {
    size: string;
    color: string;
    stockQuantity: number;
}

export interface ProductVariantUpdateRequest {
    size: string;
    color: string;
    stockQuantity: number;
}

export interface ProductCreateRequest {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imagePath?: string;
    imagePaths?: string[];
    variants: ProductVariantCreateRequest[];
}

export interface ProductUpdateRequest {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imagePath?: string;
    imagePaths?: string[];
}
