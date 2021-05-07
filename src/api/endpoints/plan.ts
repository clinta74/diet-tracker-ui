import { AxiosInstance } from 'axios';
import { Endpoint } from '../api-provider';

export interface PlanEndpoints {
    getPlans: Endpoint<Plan[]>;
    getPlan: Endpoint<Plan>;
    addPlan: Endpoint<number>;
    updatePlan: Endpoint<never>;
    deletePlan: Endpoint<never>;
    changePlan: Endpoint<number>;
}

export const getPlanEndpoints = (client: AxiosInstance): PlanEndpoints => ({
    getPlans: () =>
        client.get<Plan[]>(`plans`),

    getPlan: (planId: number) =>
        client.get<Plan>(`plan/${planId}`),

    addPlan: (plan: Plan) =>
        client.post<number>(`plan`, plan),

    updatePlan: (planId: number, plan: Plan) =>
        client.put<never>(`plan/${planId}`, plan),

    deletePlan: (planId: number) =>
        client.delete<never>(`plan/${planId}`),

    changePlan: (planId: number) =>
        client.put<number>(`plan/change`, planId),
});