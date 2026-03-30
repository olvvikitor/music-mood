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

export async function getRefreshProfile(studioId?: string): Promise<void> {
     await api.get("user/refreshMood", {
          params: studioId ? { studioId } : undefined,
     });
}

export async function getRefreshMoodStudios(): Promise<RefreshMoodStudio[]> {
     const { data } = await api.get<RefreshMoodStudio[]>("user/refreshMood/studios");
     return data;
}