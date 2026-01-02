
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const sellerAPI = {
    auth: {
        login: (data: any) => api.post("/auth/login", data),
        signup: (data: any) => api.post("/auth/register", data), // User registration
        createSellerProfile: (data: any) => api.post("/auth/create-seller", data),
        getSellerProfile: () => api.get("/auth/seller-profile"),
        updatePaymentDetails: (data: any) => api.post("/auth/seller-payment-details", data),
        submitKYC: (data: any) => api.post("/auth/seller-kyc", data),
        uploadImage: (file: File) => {
            const formData = new FormData();
            formData.append("image", file);
            return api.post("/upload/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
    },
    products: {
        list: () => api.get("/seller/products"),
        create: (data: any) => api.post("/seller/products", data),
        update: (id: string, data: any) => api.put(`/seller/products/${id}`, data),
        delete: (id: string) => api.delete(`/seller/products/${id}`),
        get: (id: string) => api.get(`/seller/products/${id}`),
    },
    categories: {
        list: () => api.get("/categories"),
        getSubcategories: (categoryId: string) => api.get(`/categories/${categoryId}/subcategories`),
    },
    orders: {
        list: () => api.get("/seller/orders"),
        updateStatus: (id: string, status: string) => api.put(`/seller/orders/${id}/status`, { status }),
        updateReturnStatus: (id: string, status: string) => api.put(`/seller/orders/${id}/return-status`, { status }),
    },
    payouts: {
        getWallet: () => api.get("/seller/wallet"),
        request: (amount: number) => api.post("/seller/request-payout", { amount }),
        list: () => api.get("/seller/payouts"),
        updateBank: (data: any) => api.put("/seller/bank-details", data)
    },
    inventory: {
        stats: () => api.get("/seller/inventory/stats")
    },
    dashboard: {
        stats: () => api.get("/seller/dashboard/stats")
    }
    // Add other endpoints as needed
};

export default api;
