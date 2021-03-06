import { useAuth0 } from '@auth0/auth0-react';
import axios, { AxiosInstance } from 'axios';
import React from 'react';
import { CONFIG } from '../config';
import { DayEndpoints, getDayEndpoints } from './endpoints/day';
import { FuelingEndpoints, getFuelingEndpoints } from './endpoints/fueling';
import { NewUserEndpoints, getNewUserEndpoints } from './endpoints/new-user';
import { getPlanEndpoints, PlanEndpoints } from './endpoints/plan';
import { UserEndpoints, getUserEndpoints } from './endpoints/user';
import { getUserDailyTrackingEndpoints, UserDailyTrackingEndpoints } from './endpoints/user-daily-tracking';
import { getUserTrackingEndpoints, UserTrackingEndpoints } from './endpoints/user-tracking';
import { getVictoryEndpoints, VictoryEndpoints } from './endpoints/victory';

const createAxiosInstance = (): AxiosInstance => {
    return axios.create({
        baseURL: `${CONFIG.API_URL}/api/`,
        timeout: 240 * 1000,
        responseType: 'json',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

interface IApiContext {
    Day: DayEndpoints;
    Fueling: FuelingEndpoints;
    NewUser: NewUserEndpoints;
    Plan: PlanEndpoints;
    User: UserEndpoints;
    UserDailyTracking: UserDailyTrackingEndpoints;
    UserTracking: UserTrackingEndpoints;
    Victory: VictoryEndpoints;
}

const ApiContext = React.createContext<{ Api: IApiContext } | null>(null);

export const ApiProvider: React.FC = ({ children }) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [Api, setApi] = React.useState<IApiContext>();

    React.useEffect(() => {
        const client = createAxiosInstance();
        client.interceptors.request
            .use(async config => {
                const token = await getAccessTokenSilently();
                config.headers['Authorization'] = `Bearer ${token}`;
                return config;
            });

        const api: IApiContext = {
            Day: getDayEndpoints(client),
            Fueling: getFuelingEndpoints(client),
            NewUser: getNewUserEndpoints(client),
            Plan: getPlanEndpoints(client),
            User: getUserEndpoints(client),
            UserDailyTracking: getUserDailyTrackingEndpoints(client),
            UserTracking: getUserTrackingEndpoints(client),
            Victory: getVictoryEndpoints(client),
        }

        setApi(api);
    }, [isAuthenticated]);

    return (
        <React.Fragment>
            {
                Api && <ApiContext.Provider value={{ Api }}>{children}</ApiContext.Provider>
            }
        </React.Fragment>
    );
}

export const useApi = () => {
    const context = React.useContext(ApiContext)
    if (context === null) throw new Error('useApi must be used within a ApiProvider');
    return context;
}