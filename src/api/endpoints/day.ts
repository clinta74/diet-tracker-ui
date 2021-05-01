import { apiBase } from '../api-base';

export const getDay = (day: string) => 
    apiBase.client.get<CurrentUserDay>(`day/${day}`);

export const updateDay = (day: string, userDay: UserDay | CurrentUserDay) =>
    apiBase.client.put<CurrentUserDay>(`day/${day}`, userDay);