import api from "@/shared/services/apiService";

export type RefreshMoodStudio = {
     id: string;
     name: string;
     company: string;
     logoKey: string;
     referenceAnimes: string[];
     visualLanguage: string;
     renderingNotes: string;
};

export async function getRefreshProfile(studioId?: string, animeId?: string, nostalgic?: boolean): Promise<void> {
     const params: Record<string, string> = {};
     if (studioId) params.studioId = studioId;
     if (animeId) params.animeId = animeId;
     if (nostalgic) params.nostalgic = '1';
     await api.get("user/refreshMood", { params });
}

export async function getRefreshMoodStudios(): Promise<RefreshMoodStudio[]> {
     const { data } = await api.get<RefreshMoodStudio[]>("user/refreshMood/studios");
     return data;
}