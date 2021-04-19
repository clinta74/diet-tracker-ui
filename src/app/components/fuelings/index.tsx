import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CONFIG } from '../../../config';

interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

export const Fuelings: React.FC = () => {
    const auth0 = useAuth0();
    const [weathers, setWeathers] = useState<WeatherForecast[]>([]);

    useEffect(() => {
        auth0.getAccessTokenSilently()
            .then(token => {
                const client = axios.create({
                    baseURL: CONFIG.API_URL,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                client.get<WeatherForecast[]>('WeatherForecast')
                    .then(({ data }) => {
                        setWeathers(data);
                    })
            })
    }, [auth0]);

    return (
        <table width="100%">
            <thead>
                <tr>
                    <th>Temp</th>
                    <th>Summary</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {
                    weathers.map((weather, idx) =>
                        <tr key={idx}>
                            <td>{weather.temperatureF}</td>
                            <td>{weather.summary}</td>
                            <td>{weather.date}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
}