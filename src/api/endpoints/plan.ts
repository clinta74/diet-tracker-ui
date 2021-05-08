import { AxiosInstance } from 'axios';

export type PlanEndpoints = ReturnType<typeof getPlanEndpoints>;

export const getPlanEndpoints = (client: AxiosInstance) => ({
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