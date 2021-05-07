import { useAuth0 } from '@auth0/auth0-react';
import axios, { AxiosError, AxiosInstance, AxiosPromise } from 'axios';
import React from 'react';
import { CONFIG } from '../config';
import { DayEndpoints, getDayEndpoints } from './endpoints/day';
import { FuelingEndpoints, getFuelingEndpoints } from './endpoints/fueling';
import { NewUserEndpoints, getNewUserEndpoints } from './endpoints/new-user';
import { getPlanEndpoints, PlanEndpoints } from './endpoints/plan';
import { UserEndpoints, getUserEndpoints } from './endpoints/user';
import { getVictoryEndpoints, VictoryEndpoints } from './endpoints/victory';

const createAxiosInstance = (token: string): AxiosInstance => {
    return axios.create({
        baseURL: `${CONFIG.API_URL}/api/`,
        timeout: 240 * 1000,
        responseType: 'json',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
};

export type Endpoint<T> = (...args: any[]) => AxiosPromise<T>;

interface IApiContext {
    Day: DayEndpoints;
    Fueling: FuelingEndpoints;
    NewUser: NewUserEndpoints;
    Plan: PlanEndpoints;
    User: UserEndpoints;
    Victory: VictoryEndpoints;
}

const ApiContext = React.createContext<{ token?: string, Api: IApiContext } | null>(null);

export const ApiProvider: React.FC = ({ children }) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [token, setToken] = React.useState<string>()
    const [Api, setApi] = React.useState<IApiContext>();

    React.useEffect(() => {
        getAccessTokenSilently()
            .then(setToken)
    }, [isAuthenticated, getAccessTokenSilently]);

    React.useEffect(() => {
        if (token) {
            const client = createAxiosInstance(token);
            client.interceptors.response
                .use(config => config,
                    (error: AxiosError) => {
                        if (error.response) {
                            if (error.response.status === 401) {
                                setToken(undefined);
                            }
                            else if (error.response.data) {
                                return Promise.reject(error.response.data);
                            }
                        }
                        return Promise.reject(error.message);
                    });

            const api: IApiContext = {
                Day: getDayEndpoints(client),
                Fueling: getFuelingEndpoints(client),
                NewUser: getNewUserEndpoints(client),
                Plan: getPlanEndpoints(client),
                User: getUserEndpoints(client),
                Victory: getVictoryEndpoints(client),
            }

            setApi(api);
        }
    }, [token]);

    return (
        <React.Fragment>
            {
                token && Api && <ApiContext.Provider value={{ token, Api }}>{children}</ApiContext.Provider>
            }
        </React.Fragment>
    );
}

export const useApi = () => {
    const context = React.useContext(ApiContext)
    if (context === null) throw new Error('useApi must be used within a ApiProvider');
    return context;
}