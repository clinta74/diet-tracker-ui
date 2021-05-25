import { AxiosInstance } from "axios";

export type UserTrackingEndpoints = ReturnType<typeof getUserTrackingEndpoints>;

export const getUserTrackingEndpoints = (client: AxiosInstance) => ({
    getActiveUserTrackings: () => 
        client.get<UserTracking[]>(`user-trackings`),

    addUserTracking: (userTracking: UserTrackingRequest) =>
        client.post(`user-tracking`, userTracking),
    
    updateUserTracking: (userTrackingId: number, userTracking: UserTrackingRequest) =>
        client.put(`user-tracking/${userTrackingId}`, userTracking),

    deleteUserTracking: (userTrackingId: number) =>
        client.delete(`user-tracking/${userTrackingId}`),
});

export enum UserTrackingType
{
    Number = 'Number',
    Boolean = 'Boolean',
}