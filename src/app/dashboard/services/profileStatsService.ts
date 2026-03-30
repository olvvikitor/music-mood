import api from "@/shared/services/apiService";

export type MoodHistoryItem = {
    id: string;
    moodScore: number;
    sentiment: string;
    image_mood?: string;
    analyzedAt: string;
    emotions: Record<string, number>;
    coreAxes: Record<string, number>;
};

export type MoodWeekItem = {
    moodScore: number;
    sentiment: string;
    analyzedAt: string;
};

export type UserStats = {
    totalListened: number;
    totalMoods: number;
    avgMoodScore: number;
    topArtists: { name: string; count: number; img_url: string }[];
    topTracks: { title: string; artist: string; count: number; img_url: string }[];
};

export async function getMoodHistory(limit = 20): Promise<MoodHistoryItem[]> {
    return api.get(`/user/mood-history?limit=${limit}`).then(r => r.data);
}

export async function getMoodWeek(): Promise<MoodWeekItem[]> {
    return api.get("/user/mood-week").then(r => r.data);
}

export async function getUserStats(): Promise<UserStats> {
    return api.get("/user/stats").then(r => r.data);
}
