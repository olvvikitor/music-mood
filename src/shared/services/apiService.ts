import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.1.5:3000",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;