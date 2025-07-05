import type { Product } from "../types/Product";
import { axiosInstance } from "./axiosInstance";

export const searchProduct = async (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  maxQuantity?: number;
  minQuantity?: number;
  sortBy?: string;
  sortDirection?: string;
}) => {
    try {
        const response = await axiosInstance.get('/api/product/search', {
            params
        });
        console.log("Search response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching products:", error);
    return { products: [], pagination: { page: 1, totalPages: 1, totalItems: 0 } };
  }
}
export const getProductList = async () => {
    try {
        const response = await axiosInstance.get('/api/product/list');
        return response.data.products; 
    } catch (error: any) {
        console.error("Error fetching product list:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch product list");
    }
}
export const createProduct = async (products: Product[]) => {
    try {
        const response = await axiosInstance.post('/api/product/create', { products });
        return response.data.products; 
    } catch (error: any) {
        console.error("Error fetching product list:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch product list");
    }
}
export const editProduct = async (products: any[]) => {
    try {
        const response = await axiosInstance.patch('/api/product/update', { products });
        return response.data.finalProducts; 
    } catch (error: any) {
        console.error("Error editing product:", error);
        throw new Error(error.response?.data?.message || "Failed to edit product");
    }
}
export const deleteProduct = async (products: number[]) => {
    try {
        const response = await axiosInstance.delete(`/api/product/delete`, { data: {products} });
        return response.data;
    } catch (error: any) {
        console.error("Error deleting product:", error);
        throw new Error(error.response?.data?.message || "Failed to delete product");
    }
}