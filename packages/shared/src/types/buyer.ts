export interface BuyerRegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface BuyerLoginRequest {
    email: string;
    password: string;
}

export interface BuyerProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface BuyerLoginResponse {
    token: string;
    expiresAt: string;
    buyer: BuyerProfile;
}
