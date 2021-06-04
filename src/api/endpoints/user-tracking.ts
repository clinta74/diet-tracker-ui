import { AxiosInstance } from "axios";

const BASE_URL = 'user-tracking'

export type UserTrackingEndpoints = ReturnType<typeof getUserTrackingEndpoints>;

export const getUserTrackingEndpoints = (client: AxiosInstance) => ({
    getActiveUserTrackings: () => 
        client.get<UserTracking[]>(`user-trackings`),

    getUserTracking: (userTrackingId: number) =>
        client.get<UserTracking>(`${BASE_URL}/${userTrackingId}`),

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