import { AxiosInstance } from 'axios';

export type DayEndpoints = ReturnType<typeof getDayEndpoints>;

export const getDayEndpoints = (client: AxiosInstance) => ({
    getDay: (day: string) => 
        client.get<CurrentUserDay>(`day/${day}`),

    updateDay: (day: string, userDay: UserDay | CurrentUserDay) =>
        client.put<CurrentUserDay>(`day/${day}`, userDay),
})
