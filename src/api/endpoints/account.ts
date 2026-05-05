import { AxiosInstance } from 'axios';

export interface SessionInfo {
    id: number;
    createdAt: string;
    expiresAt: string;
    createdByIp?: string;
}

export type AccountEndpoints = ReturnType<typeof getAccountEndpoints>;

export const getAccountEndpoints = (client: AxiosInstance) => ({
    changePassword: (currentPassword: string, newPassword: string) =>
        client.put<void>('account/password', { currentPassword, newPassword }),

    changeEmail: (newEmail: string) =>
        client.put<void>('account/email', { newEmail }),

    getSessions: () =>
        client.get<SessionInfo[]>('account/sessions'),

    revokeSession: (id: number) =>
        client.delete<void>(`account/sessions/${id}`),

    revokeAllSessions: () =>
        client.delete<void>('account/sessions'),
});
