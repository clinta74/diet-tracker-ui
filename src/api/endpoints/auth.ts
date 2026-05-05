import { AxiosInstance } from 'axios';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    planId: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export type AuthEndpoints = ReturnType<typeof getAuthEndpoints>;

export const getAuthEndpoints = (client: AxiosInstance) => ({
    register: (data: RegisterRequest) =>
        client.post<AuthResponse>('auth/register', data),

    login: (data: LoginRequest) =>
        client.post<AuthResponse>('auth/login', data),

    refresh: (refreshToken: string) =>
        client.post<AuthResponse>('auth/refresh', { refreshToken }),

    revoke: (refreshToken: string) =>
        client.post<void>('auth/revoke', { refreshToken }),

    migrate: (email: string, newPassword: string) =>
        client.post<AuthResponse>('auth/migrate', { email, newPassword }),
});
