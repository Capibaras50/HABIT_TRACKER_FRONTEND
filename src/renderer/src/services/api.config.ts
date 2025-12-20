import axios from 'axios';

// Assuming default port 3000 based on typical Express setups. 
// Can be updated via environment variable if needed.
// Using relative path to leverage Vite proxy and avoid CORS
const API_URL = '/api/v1';

export const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable sending cookies
});

// Request interceptor: No longer needed for 'Authorization' header as we use cookies
apiInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid - Backend handles cookie clearing usually, but we can redirect
            window.location.hash = '#/login';
        }
        return Promise.reject(error);
    }
);
