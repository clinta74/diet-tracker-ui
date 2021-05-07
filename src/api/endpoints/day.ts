import { AxiosInstance } from 'axios';
import { Endpoint } from '../api-provider';

export interface DayEndpoints {
    getDay: Endpoint<CurrentUserDay>;
    updateDay: Endpoint<CurrentUserDay>;
}

export const getDayEndpoints = (client: AxiosInstance): DayEndpoints => ({
    getDay: (day: string) => 
        client.get<CurrentUserDay>(`day/${day}`),

    updateDay: (day: string, userDay: UserDay | CurrentUserDay) =>
        client.put<CurrentUserDay>(`day/${day}`, userDay),
})
