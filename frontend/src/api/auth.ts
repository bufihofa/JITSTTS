import storage from "../utils/storage";
import { axiosInstance } from "./axiosInstance";

export const login = async (username: string, password: string, savePassword: boolean) => {
    try{
        
        const response = await axiosInstance.post('/api/auth/login', 
            { username, password }
        );


        storage.clearLoginData(); 
        
        storage.setLoginData(
            response.data.token, 
            response.data.user.role, 
            response.data.user.username
        );

        if(savePassword) {
            storage.saveLoginData(
                response.data.token, 
                response.data.user.role, 
                response.data.user.username
            );
        } 

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response;

    } catch (error: any) {
        let message = error.response?.data?.message || "Đăng nhập thất bại";
        if(message.length > 100) {
            message = "Thông tin đăng nhập không hợp lệ";
        }
        return message;
        
    }
    
};


export const register = async (username: string, email: string, password: string) => {
    try {
        const response = await axiosInstance.post('/api/auth/register', 
            { username, email, password }
        );
        storage.setLoginData(response.data.token, response.data.user.role, response.data.user.username);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        return response;
    } catch (error: any) {
        let message = error.response?.data?.message || "Đăng ký thất bại";
        if(message.length > 100) {
            message = "Thông tin đăng ký không hợp lệ";
        }
        return message;
    }
}



export const logout = async () => {
    try {
        window.location.href = '/login';
        storage.clearLoginData();
        axiosInstance.defaults.headers.common['Authorization'] = '';
    } catch (error: any) {
        const message = error.response?.data?.message || "Đăng xuất thất bại";
        return message;
    }
}

export const isAdmin = () => {
    const role = storage.getRole();
    return role === 'admin';
}