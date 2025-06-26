import storage from "../utils/storage";
import { axiosInstance } from "./axiosInstance";

export const login = async (username: string, password: string) => {
    try{
        
        const response = await axiosInstance.post('/api/auth/login', 
            { username, password }
        );
        console.log("Login response:", response.data);
        storage.setToken(response.data.token); 

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response;

    } catch (error: any) {
        let message = error.response?.data?.message || "Đăng nhập thất bại";
        if(message.length > 100) {
            message = "Thông tin đăng nhập không hợp lệ";
        }
        console.log(message);
        return message;
        
    }
    
};


export const register = async (username: string, email: string, password: string) => {
    try {
        const response = await axiosInstance.post('/api/auth/register', 
            { username, email, password }
        );
        console.log("Register response:", response.data);
        storage.setToken(response.data.token);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        return response;
    } catch (error: any) {
        let message = error.response?.data?.message || "Đăng ký thất bại";
        console.log(message);
        if(message.length > 100) {
            message = "Thông tin đăng ký không hợp lệ";
        }
        return message;
    }
}



export const logout = async () => {
    try {
        window.location.href = '/login';
        storage.setToken(''); 
        axiosInstance.defaults.headers.common['Authorization'] = '';
    } catch (error: any) {
        const message = error.response?.data?.message || "Đăng xuất thất bại";
        console.log(message);
        return message;
    }
}