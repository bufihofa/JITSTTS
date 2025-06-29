import type { Product } from "../types/Product";
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
export const createProduct = async (products: Product[]) => {
    try {
        console.log("Creating product list:", products);
        return;
        const response = await axiosInstance.post('/api/product/create', { products });
        console.log("Product list fetched successfully:", response.data);
        return response.data.products; 
    } catch (error: any) {
        console.error("Error fetching product list:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch product list");
    }
}
export const deleteProduct = async (products: number[]) => {
    try {
        console.log("Deleting products:", {products});
        const response = await axiosInstance.delete(`/api/product/delete`, { data: {products} });
        console.log("Product deleted successfully:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error deleting product:", error);
        throw new Error(error.response?.data?.message || "Failed to delete product");
    }
}