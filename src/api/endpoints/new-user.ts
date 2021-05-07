import { AxiosInstance } from 'axios';
import { Endpoint } from '../api-provider';

export interface NewUserEndpoints {
    createUser: Endpoint<UserId>;
    addNewUser: Endpoint<UserId>;
    getNewUser: Endpoint<NewUser>;
}

export const getNewUserEndpoints = (client: AxiosInstance): NewUserEndpoints => ({
    createUser: (user: User) =>
        client.post<UserId>(`new-user/create`, user),

    addNewUser: (newUser: NewUser) =>
        client.post<UserId>(`new-user`, newUser),

    getNewUser: () =>
        client.get<NewUser>(`new-user`),
});