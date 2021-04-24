import { apiBase } from '../api-base';

export const getFuelings = () =>
    apiBase.client.get<Fueling[]>(`fuelings`);

export const addFueling = (fueling: Fueling) =>
    apiBase.client.post<number>(`fueling`, fueling);

export const updateFueling = (fuelingId: number, fueling: Fueling) =>
    apiBase.client.put<never>(`plan/${fuelingId}`, fueling);

export const deleteFueling = (fuelingId: number) =>
    apiBase.client.delete<never>(`plan/${fuelingId}`);