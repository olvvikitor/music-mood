import api from "@/shared/services/apiService";

export const loginWithEmail = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data; // { token: string }
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Erro na conexão com o servidor. Tente novamente.");
    }
};
