import { AxiosInstance } from 'axios';
import { Endpoint } from '../api-provider';

export interface UserEndpoints {
    getUser: Endpoint<CurrentUser>;
    getUserExists: Endpoint<boolean>;
}

export const getUserEndpoints = (client: AxiosInstance): UserEndpoints => ({
    getUser: () =>
        client.get<CurrentUser>(`user`),

    getUserExists: () =>
        client.get<boolean>(`user/exists`),
});