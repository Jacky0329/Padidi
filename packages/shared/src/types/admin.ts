export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    token: string;
    expiresAt: string;
}

export interface AdminUserDto {
    id: string;
    email: string;
    createdAt: string;
}

export interface AdminUserCreateRequest {
    email: string;
    password: string;
}

export interface AdminUserUpdateRequest {
    email: string;
    password?: string;
}
