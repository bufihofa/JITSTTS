import { axiosInstance } from "../../api/axiosInstance";

export const DynamicAPI = async (method: string, url: string, params?: any, body?: any) => {
    try {
        let response;
        console.log(`DynamicAPI (${method} ${url}):`, { params, body });
        if(method === "GET") {
            response = await axiosInstance.get(url, params);
        }
        else if(method === "POST") {
            response = await axiosInstance.post(url, body);
        }
        else if(method === "PATCH") {
            response = await axiosInstance.patch(url, body);
        }
        else if(method === "PUT") {
            response = await axiosInstance.put(url, body);
        }
        else if(method === "DELETE") {
            response = await axiosInstance.delete(url, { data: body });
        } else {
            throw new Error("Unsupported HTTP method");
        }

        console.log(`DynamicAPI (${method} ${url}):`, response.data);

        if (response.status !== 200) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response?.data;
    } catch (error: any) {
        console.error(`Error in DynamicAPI (${method} ${url}):`, error);
        throw new Error(error.response?.data?.message || "API request failed");
    }
    
}