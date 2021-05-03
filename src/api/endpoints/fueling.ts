import { apiBase } from '../api-base';

export const getFuelings = () =>
    apiBase.client.get<Fueling[]>(`fuelings`);

export const addFueling = (fueling: Fueling) =>
    apiBase.client.post<Fueling>(`fueling`, fueling);

export const updateFueling = (fuelingId: number, fueling: Fueling) =>
    apiBase.client.put<never>(`fueling/${fuelingId}`, fueling);

export const deleteFueling = (fuelingId: number) =>
    apiBase.client.delete<never>(`fueling/${fuelingId}`);