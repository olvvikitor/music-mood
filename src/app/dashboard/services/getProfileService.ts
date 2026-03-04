import api from "../../../shared/services/apiService"

export type UserResponseDto={
    country: string;
    display_name: string;
    email: string;
    id: string;
    img_profile: string;
    provider: string;
}

export async function getProfile():Promise<UserResponseDto>{
    return await api.get('user/me').then((response)=>response.data)
}