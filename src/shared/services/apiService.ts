import axios from "axios"
import { getApiBaseUrl } from "../config/apiBaseUrl";

const baseurl = getApiBaseUrl()

const api = axios.create({
    baseURL:baseurl,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = String(error?.config?.url || "");
        const isAuthEndpoint = requestUrl.includes("/auth/login");

        if (status === 401 && !isAuthEndpoint) {
            localStorage.removeItem("auth_token");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
