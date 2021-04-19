import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { CONFIG } from '../config';

export const createAxiosInstance = (): AxiosInstance => {
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

const authInterceptor = ((config: AxiosRequestConfig, token: string) => {
    config.headers.Authorization = `Bearer ${token}`;

    return config;
})

class ApiBase {
    client: AxiosInstance;
    authInterceptorHandle: number;

    constructor() {
        this.authInterceptorHandle = 0;
        this.client = createAxiosInstance();

        this.client.interceptors.response
            .use(config => config,
                (error: AxiosError) => {
                    if (error.response) {
                        if (error.response.status === 401) {
                            window.location.reload();
                        }
                        else if (error.response.data) {
                            return Promise.reject(error.response.data);
                        }
                    }
                    return Promise.reject(error.message);
                });
    }

    setAuthToken(token: string): void {
        this.client.interceptors.request.eject(this.authInterceptorHandle)
        this.authInterceptorHandle = this.client.interceptors.request
            .use(config => authInterceptor(config, token));
    }
}

export const apiBase = new ApiBase();
