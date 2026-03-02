import api from "@/shared/services/apiService";

export async function getRefreshProfile():Promise<void>{
     await api.get('user/refreshMood')
}