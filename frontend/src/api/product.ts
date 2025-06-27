import { axiosInstance } from "./axiosInstance";

export const getProductList = async () => {
    try {
        const response = await axiosInstance.get('/api/product/list');
        console.log("Product list fetched successfully:", response.data);
        return response.data.products; 
    } catch (error: any) {
        console.error("Error fetching product list:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch product list");
    }
}
