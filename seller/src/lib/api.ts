
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
    // Add other endpoints as needed
};

export default api;
