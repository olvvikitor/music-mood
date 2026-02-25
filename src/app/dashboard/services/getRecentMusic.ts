import api from "@/shared/services/apiService";
import { Music } from "../types/music";

export async function getRecentMusics(): Promise<Music[]> {
    return await api.get('user/lastTracks').then((response) => response.data)

}