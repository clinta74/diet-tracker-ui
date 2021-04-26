import { apiBase } from '../api-base';

export const createUser = (user: User) =>
    apiBase.client.post<string>(`new-user/create`, user);

export const addNewUser = (newUser: NewUser) =>
    apiBase.client.post<string>(`new-user`, newUser);

export const getNewUser = () =>
    apiBase.client.get<NewUser>(`new-user`);