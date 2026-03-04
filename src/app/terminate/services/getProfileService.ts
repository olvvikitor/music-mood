import { UserResponseDto } from "@/app/dashboard/services/getProfileService"
import api from "../../../shared/services/apiService"

export async function getInfoUserPlataform():Promise<UserResponseDto>{
    return await api.get('user/me').then((response)=>response.data)
}