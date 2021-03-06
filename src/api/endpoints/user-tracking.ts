import { AxiosInstance } from "axios";

const BASE_URL = 'user-tracking'

export type UserTrackingEndpoints = ReturnType<typeof getUserTrackingEndpoints>;

export const getUserTrackingEndpoints = (client: AxiosInstance) => ({
    getUserTrackings: () => 
        client.get<UserTracking[]>(`user-trackings`),

    getActiveUserTrackings: () => 
        client.get<UserTracking[]>(`user-trackings/active`),

    getUserTracking: (userTrackingId: number) =>
        client.get<UserTracking>(`${BASE_URL}/${userTrackingId}`),

    addUserTracking: (userTracking: UserTrackingRequest) =>
        client.post<UserTracking>(`${BASE_URL}`, userTracking),
    
    updateUserTracking: (userTrackingId: number, userTracking: UserTrackingRequest) =>
        client.put<UserTracking>(`${BASE_URL}/${userTrackingId}`, userTracking),

    deleteUserTracking: (userTrackingId: number) =>
        client.delete(`${BASE_URL}/${userTrackingId}`),
});

export enum UserTrackingType
{
    Number = 'Number',
    WholeNumber = 'WholeNumber',
    Boolean = 'Boolean',
    Icon = 'Icon',
}