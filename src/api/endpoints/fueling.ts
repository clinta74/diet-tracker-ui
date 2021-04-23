import { apiBase } from '../api-base';

export const getFuelings = () => 
    apiBase.client.get<Fueling[]>(`fuelings`);

export const addFueling = (fueling: Fueling) =>
    apiBase.client.post<number>(`fueling`, fueling);