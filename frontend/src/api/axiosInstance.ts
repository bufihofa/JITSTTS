import axios from "axios";
import storage from "../utils/storage";


const baseURL = "";
//const baseURL = "http://localhost:1337/"; 
export const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        storage.setLastAccess();
        window.dispatchEvent(new Event('storageAccessUpdated'));
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            storage.clearLoginData();
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);