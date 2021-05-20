import { AxiosInstance } from "axios";

export const getUserTrackingEndpoints = (client: AxiosInstance) => ({
    getActiveUserTrackings: () => 
        client.get<UserTracking[]>(`user-trackings`),

    addUserTracking: (userTracking: UserTrackingRequest) =>
        client.post(`user-tracking`, userTracking),
    
    updateUserTracking: (userTrackingId: number, userTracking: UserTrackingRequest) =>
        client.put(`user-tracking/${userTrackingId}`, userTracking),
});

export enum UserTrackingType
{
    Number = 'Number',
    Boolean = 'Boolean',
}