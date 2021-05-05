import { apiBase } from "../api-base";

export const getVictories = (type: VictoryType) =>
    apiBase.client.get<Victory[]>(`victories`, { params: {
        type,
    }});

export const addVictory = (victory: Victory) =>
    apiBase.client.post<Victory>(`victory`, victory);

export const updateVictory = (victoryId: number, victory: Victory) =>
    apiBase.client.put<never>(`victory/${victoryId}`, victory);

export const deleteVictory = (victoryId: number) =>
    apiBase.client.delete<never>(`victory/${victoryId}`);

export enum VictoryType {
    NonScale = 'NonScale',
    Goal = 'Goal'
}