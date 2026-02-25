import axios from "axios"
import api from "../../../shared/services/apiService"

export type UserResponseDto={
    id: string
    email: string
    spotifyId: string
    img_profile:string
    display_name: string
    country: string
}

export async function getProfile():Promise<UserResponseDto>{
    
    return await api.get('user/me').then((response)=>response.data)
}