import { AxiosInstance } from 'axios';

export type VictoryEndpoints = ReturnType<typeof getVictoryEndpoints>;
export const getVictoryEndpoints = (client: AxiosInstance) => ({

    getVictories: (type: VictoryType) =>
        client.get<Victory[]>(`victories`, {
            params: {
                type,
            }
        }),

    addVictory: (victory: Victory) =>
        client.post<Victory>(`victory`, victory),

    updateVictory: (victoryId: number, victory: Victory) =>
        client.put<never>(`victory/${victoryId}`, victory),

    deleteVictory: (victoryId: number) =>
        client.delete<never>(`victory/${victoryId}`),

});

export enum VictoryType {
    NonScale = 'NonScale',
    Goal = 'Goal'
}