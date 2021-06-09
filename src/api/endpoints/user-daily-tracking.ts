import { AxiosInstance } from 'axios';

export type UserDailyTrackingEndpoints = ReturnType<typeof getUserDailyTrackingEndpoints>;

const baseUrl = 'day-tracking-values';

export const getUserDailyTrackingEndpoints = (client: AxiosInstance) => ({
    getUserDailyTrackingValues: (day: string) =>
        client.get<UserDailyTrackingValue[]>(`${baseUrl}/${day}`),

    updateUserDailyTrackingValue: (day: string, values: UserDailyTrackingValueRequest[]) =>
        client.put(`${baseUrl}/${day}`, values)
});