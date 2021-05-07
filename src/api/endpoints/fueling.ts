import { AxiosInstance } from 'axios';
import { Endpoint } from '../api-provider';

export interface FuelingEndpoints {
    getFuelings: Endpoint<Fueling[]>;
    addFueling: Endpoint<Fueling>;
    updateFueling: Endpoint<never>;
    deleteFueling: Endpoint<never>
}
export const getFuelingEndpoints = (client: AxiosInstance): FuelingEndpoints => ({
    getFuelings: () =>
        client.get<Fueling[]>(`fuelings`),

    addFueling: (fueling: Fueling) =>
        client.post<Fueling>(`fueling`, fueling),

    updateFueling: (fuelingId: number, fueling: Fueling) =>
        client.put<never>(`fueling/${fuelingId}`, fueling),

    deleteFueling: (fuelingId: number) =>
        client.delete<never>(`fueling/${fuelingId}`),
});