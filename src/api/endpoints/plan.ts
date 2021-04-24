import { apiBase } from '../api-base';

export const getPlans = () =>
    apiBase.client.get<Plan[]>(`plans`);

export const addPlan = (plan: Plan) =>
    apiBase.client.post<number>(`plan`, plan);

export const updatePlan = (planId: number, plan: Plan) =>
    apiBase.client.put<never>(`plan/${planId}`, plan);

export const deletePlan = (planId: number) =>
    apiBase.client.delete<never>(`plan/${planId}`);