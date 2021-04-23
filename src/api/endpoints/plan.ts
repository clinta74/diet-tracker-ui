import { apiBase } from '../api-base';

export const getPlans = () => 
    apiBase.client.get<Plan[]>(`plans`);