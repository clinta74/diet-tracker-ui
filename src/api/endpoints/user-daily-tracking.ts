import { AxiosInstance } from 'axios';

export type UserDailyTrackingEndpoints = ReturnType<typeof getUserDailyTrackingEndpoints>;

const baseUrl = 'user-daily-tracking';

export const getUserDailyTrackingEndpoints = (client: AxiosInstance) => ({
    getCurrentUserDailyTrackings: (day: string) =>
        client.get<CurrentUserDailyTracking>(`${baseUrl}/${day}`),

    updateCurrentUserDailyTracking: (day: string, userTrackingId: number, occurrence: number, currentUserDailyTrackingUpdateRequest: CurrentUserDailyTrackingUpdateRequest) =>
        client.put<UserDailyTracking>(`${baseUrl}/${day}/${userTrackingId}/${occurrence}`, currentUserDailyTrackingUpdateRequest),

});