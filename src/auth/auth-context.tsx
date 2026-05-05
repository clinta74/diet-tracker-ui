import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';

export interface AuthUser {
    userId: string;
    name: string;
    email?: string;
    permissions: string[];
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    planId: number;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    migrateAccount: (email: string, newPassword: string) => Promise<void>;
    refreshAccessToken: () => Promise<string | null>;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

interface DecodedJwt {
    sub: string;
    name?: string;
    email?: string;
    permissions?: string[];
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const REFRESH_TOKEN_KEY = 'refreshToken';

function decodeJwt(token: string): DecodedJwt {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload)) as DecodedJwt;
    } catch {
        return { sub: '' };
    }
}

function userFromToken(token: string): AuthUser {
    const decoded = decodeJwt(token);
    return {
        userId: decoded.sub,
        name: decoded.name || decoded.sub,
        email: decoded.email,
        permissions: decoded.permissions || [],
    };
}

export const AuthProvider: React.FC = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: null,
        isLoading: true,
        isAuthenticated: false,
    });
    const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scheduleRefresh = useCallback((expiresIn: number, refreshTokenValue: string) => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        const delayMs = Math.max((expiresIn - 60) * 1000, 10000);
        refreshTimerRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`${CONFIG.API_URL}/api/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken: refreshTokenValue }),
                });
                if (response.ok) {
                    const data: AuthResponse = await response.json();
                    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
                    setState({
                        user: userFromToken(data.accessToken),
                        accessToken: data.accessToken,
                        isLoading: false,
                        isAuthenticated: true,
                    });
                    scheduleRefresh(data.expiresIn, data.refreshToken);
                } else {
                    localStorage.removeItem(REFRESH_TOKEN_KEY);
                    setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
                }
            } catch {
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
            }
        }, delayMs);
    }, []);

    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!storedRefreshToken) return null;
        try {
            const response = await fetch(`${CONFIG.API_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
            });
            if (response.ok) {
                const data: AuthResponse = await response.json();
                localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
                setState({
                    user: userFromToken(data.accessToken),
                    accessToken: data.accessToken,
                    isLoading: false,
                    isAuthenticated: true,
                });
                scheduleRefresh(data.expiresIn, data.refreshToken);
                return data.accessToken;
            } else {
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
                return null;
            }
        } catch {
            return null;
        }
    }, [scheduleRefresh]);

    // On mount: try to restore session from stored refresh token
    useEffect(() => {
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!storedRefreshToken) {
            setState(s => ({ ...s, isLoading: false }));
            return;
        }
        fetch(`${CONFIG.API_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
        })
            .then(async response => {
                if (response.ok) {
                    const data: AuthResponse = await response.json();
                    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
                    setState({
                        user: userFromToken(data.accessToken),
                        accessToken: data.accessToken,
                        isLoading: false,
                        isAuthenticated: true,
                    });
                    scheduleRefresh(data.expiresIn, data.refreshToken);
                } else {
                    localStorage.removeItem(REFRESH_TOKEN_KEY);
                    setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
                }
            })
            .catch(() => {
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
            });
        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        };
    }, [scheduleRefresh]);

    const login = useCallback(async (email: string, password: string) => {
        const response = await fetch(`${CONFIG.API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Invalid email or password');
        }
        const data: AuthResponse = await response.json();
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        setState({
            user: userFromToken(data.accessToken),
            accessToken: data.accessToken,
            isLoading: false,
            isAuthenticated: true,
        });
        scheduleRefresh(data.expiresIn, data.refreshToken);
    }, [scheduleRefresh]);

    const logout = useCallback(async () => {
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (storedRefreshToken && state.accessToken) {
            try {
                await fetch(`${CONFIG.API_URL}/api/auth/revoke`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.accessToken}`,
                    },
                    body: JSON.stringify({ refreshToken: storedRefreshToken }),
                });
            } catch {
                // Ignore revoke errors
            }
        }
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
    }, [state.accessToken]);

    const register = useCallback(async (data: RegisterData) => {
        const response = await fetch(`${CONFIG.API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Registration failed');
        }
        const authResponse: AuthResponse = await response.json();
        localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
        setState({
            user: userFromToken(authResponse.accessToken),
            accessToken: authResponse.accessToken,
            isLoading: false,
            isAuthenticated: true,
        });
        scheduleRefresh(authResponse.expiresIn, authResponse.refreshToken);
    }, [scheduleRefresh]);

    const migrateAccount = useCallback(async (email: string, newPassword: string) => {
        const response = await fetch(`${CONFIG.API_URL}/api/auth/migrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Migration failed');
        }
        const authResponse: AuthResponse = await response.json();
        localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
        setState({
            user: userFromToken(authResponse.accessToken),
            accessToken: authResponse.accessToken,
            isLoading: false,
            isAuthenticated: true,
        });
        scheduleRefresh(authResponse.expiresIn, authResponse.refreshToken);
    }, [scheduleRefresh]);

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register, migrateAccount, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};
