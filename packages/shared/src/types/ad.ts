export interface AdDto {
    id: string;
    imagePath: string;
    redirectUrl: string;
    isActive: boolean;
    createdAt: string;
}

export interface AdCreateRequest {
    redirectUrl: string;
    isActive: boolean;
}

export interface AdUpdateRequest {
    redirectUrl: string;
    isActive: boolean;
}
