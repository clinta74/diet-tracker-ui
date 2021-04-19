import { apiBase } from '../api-base';

export const getWeatherForcasts = () => {
    return apiBase.client.get<WeatherForecast[]>(`WeatherForecast`);
}

