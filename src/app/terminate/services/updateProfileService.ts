import { UserResponseDto } from "@/app/dashboard/services/getProfileService"
import api from "../../../shared/services/apiService"
import { FormAceptNotification } from "../page"

export async function updateProfileService(data: FormAceptNotification): Promise<void> {
    await api.put('user/updateAfterCreate', { data: data })
}