import api from "@/shared/services/apiService";

export async function setPasswordService(password: string): Promise<void> {
    await api.post('auth/set-password', { password });
}
