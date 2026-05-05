import { AxiosInstance } from 'axios';

export interface AdminUserDto {
    userId: string;
    firstName: string;
    lastName: string;
    email?: string;
    permissions: string[];
    hasCredentials: boolean;
}

export type AdminEndpoints = ReturnType<typeof getAdminEndpoints>;

export const getAdminEndpoints = (client: AxiosInstance) => ({
    getUsers: () =>
        client.get<AdminUserDto[]>('admin/users'),

    setPermissions: (userId: string, permissions: string[]) =>
        client.put<void>(`admin/users/${userId}/permissions`, { permissions }),

    setCredentials: (userId: string, email: string, password: string) =>
        client.post<void>(`admin/users/${userId}/credentials`, { email, password }),

    revokeUserSessions: (userId: string) =>
        client.delete<void>(`admin/users/${userId}/sessions`),
});
