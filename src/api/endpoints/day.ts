import { AxiosInstance } from 'axios';

export type DayEndpoints = ReturnType<typeof getDayEndpoints>;

export const getDayEndpoints = (client: AxiosInstance) => ({
    getDay: (day: string) =>
        client.get<CurrentUserDay>(`day/${day}`),

    getDayFuelings: (day: string) =>
        client.get<UserDayFueling[]>(`day/${day}/fuelings`),

    getDayMeals: (day: string) =>
        client.get<UserDayMeal[]>(`day/${day}/meals`),

    getDayVictories: (day: string) =>
        client.get<UserDayVictory[]>(`day/${day}/victories`),

    updateDay: (day: string, userDay: CurrentUserDay) =>
        client.put<CurrentUserDay>(`day/${day}`, userDay),

    updateDayFuelings: (day: string, userFuelings: UserFueling[]) =>
        client.put<UserFueling[]>(`day/${day}/fuelings`, userFuelings),

    updateDayMeals: (day: string, userMeals: UserMeal[]) =>
        client.put<UserMeal[]>(`day/${day}/meals`, userMeals),

    updateDayVictories: (day: string, victories: Victory[]) =>
        client.put<Victory[]>(`day/${day}/victories`, victories),

    getWeightGraphValues: (startDate: string, endDate?: string) =>
        client.get<GraphValue[]>(`day/weight`, { params: { startDate, endDate } }),

    getWaterGraphValue: (startDate: string, endDate?: string) =>
        client.get<GraphValue[]>(`day/water`, { params: { startDate, endDate } }),
})
