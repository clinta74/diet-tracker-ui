import { AxiosInstance } from 'axios';

export type DayEndpoints = ReturnType<typeof getDayEndpoints>;

export const getDayEndpoints = (client: AxiosInstance) => ({
    getDay: (day: string) => 
        client.get<CurrentUserDay>(`day/${day}`),

    updateDay: (day: string, userDay: CurrentUserDay) =>
        client.put<CurrentUserDay>(`day/${day}`, userDay),

    getWeight: (startDate: string, endDate?: string) =>
        client.get<GraphValue[]>(`day/weight`, { params: { startDate, endDate }}),
})
