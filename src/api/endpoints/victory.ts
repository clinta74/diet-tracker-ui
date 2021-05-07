import { AxiosInstance } from 'axios';
import { Endpoint } from '../api-provider';

export interface VictoryEndpoints {
    getVictories: Endpoint<Victory[]>;
    addVictory: Endpoint<Victory>;
    updateVictory: Endpoint<never>;
    deleteVictory: Endpoint<never>;
}

export const getVictoryEndpoints = (client: AxiosInstance): VictoryEndpoints => ({

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