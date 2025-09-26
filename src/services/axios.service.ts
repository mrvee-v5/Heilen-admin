// src/services/axios.service.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
const prod = "https://api.heilen.io";
const dev = "https://dev.heilen.io"
// The API base URL. Replace with your actual base URL or environment variable.
const API_BASE_URL = dev; // Example


// A list of URLs that do not require an authorization token.
// You can add more endpoints to this array as needed.
const authNotRequiredURLs: string[] = [
    '/user/send-verification-code',
    '/user/verify/token',
    '/user/user/register',
    '/user/login',
    "/admin/users"
    // Add other public endpoints here
];

const getAccessToken = async (): Promise<string | null> => {
    // This is a placeholder. In a web application, you would typically get the token from a local storage mechanism like localStorage or a cookie.
    // Example: return localStorage.getItem('accessToken');
    return null;
};

const getExcludedURLs = (config: AxiosRequestConfig): boolean => {
    return (
        config.url !== undefined &&
        authNotRequiredURLs.some(endpoint => config.url?.endsWith(endpoint))
    );
};

// Create a new instance of axios
const axiosExtended: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    // Add any other default headers here
});

// Add a request interceptor
axiosExtended.interceptors.request.use(async (config:any) => {
    // In a real app, you would get a client API key from a secure location.
    config.headers['X-API-key'] = "sheyyoudeywhinemeniiiiiiiiii";

    if (getExcludedURLs(config)) {
        return config;
    }

    const accessToken = await getAccessToken();
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
}, (error:any) => {
    return Promise.reject(error);
});

export default axiosExtended;