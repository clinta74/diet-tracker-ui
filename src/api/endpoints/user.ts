import { apiBase } from '../api-base';

export const getUser = () => 
    apiBase.client.get<User>(`user`);

export const getNewUser = () =>
    apiBase.client.get<User>(`newuser`);