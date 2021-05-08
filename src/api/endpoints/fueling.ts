import { AxiosInstance } from 'axios';

export type FuelingEndpoints = ReturnType<typeof getFuelingEndpoints>;
export const getFuelingEndpoints = (client: AxiosInstance) => ({
    getFuelings: () =>
        client.get<Fueling[]>(`fuelings`),

    addFueling: (fueling: Fueling) =>
        client.post<Fueling>(`fueling`, fueling),

    updateFueling: (fuelingId: number, fueling: Fueling) =>
        client.put<never>(`fueling/${fuelingId}`, fueling),

    deleteFueling: (fuelingId: number) =>
        client.delete<never>(`fueling/${fuelingId}`),
});