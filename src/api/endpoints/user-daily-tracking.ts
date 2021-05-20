import { AxiosInstance } from 'axios';

export const getUserDailyTrackingEndpoints = (client: AxiosInstance) => ({
    getCurrentUserDailyTrackings: () => 
        client.get<CurrentUserDailyTracking>(`user-daily-tracking`),
        
});