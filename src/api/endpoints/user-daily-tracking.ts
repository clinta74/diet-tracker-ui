import { AxiosInstance } from 'axios';

export type UserDailyTrackingEndpoints = ReturnType<typeof getUserDailyTrackingEndpoints>;

const baseUrl = 'day-tracking-values';

export const getUserDailyTrackingEndpoints = (client: AxiosInstance) => ({
    getUserDailyTrackingValues: (day: string) =>
        client.get<UserDailyTrackingValue[]>(`${baseUrl}/${day}`),

    addUserDailyTrackingValue: (values: UserDailyTrackingValueRequest[]) =>
        client.post(`${baseUrl}`, values),

    updateUserDailyTrackingValue: (day: string, values: UserDailyTrackingValueRequest[]) =>
        client.put(`${baseUrl}/${day}`, values),

    getUserDailyTrackingHistoryValues: (userTrackingId: number, startDate: string, endDate?: string) =>
        client.get<UserDailyTrackingValue[]>(`${baseUrl}/${userTrackingId}/history`, { params: { startDate, endDate } }),
});