import React, { useEffect, useState } from 'react';
import { Api } from '../../../api';

export const Fuelings: React.FC = () => {
    const [weathers, setWeathers] = useState<WeatherForecast[]>([]);

    useEffect(() => {
        Api.WeatherForecast.getWeatherForcasts()
            .then(({ data }) => {
                setWeathers(data);
            })
    }, []);

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