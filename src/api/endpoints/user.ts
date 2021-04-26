import { apiBase } from '../api-base';

export const getUser = () =>
    apiBase.client.get<CurrentUser>(`user`);

export const getUserExists = () =>
    apiBase.client.get<boolean>(`user/exists`);

export const getNewUser = () =>
    apiBase.client.get<User>(`newuser`);