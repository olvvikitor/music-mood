import api from "@/shared/services/apiService";
import { CoreAxes, EmotionalVector } from "../types/music";

export type ListeningNowTrack = {
    id: string;
    music: string;
    artist: string;
    img_url: string;
    emotionalVector: EmotionalVector;
    dominantSentiment: string;
    reasoning: string;
    moodScore: number;
    coreAxes: CoreAxes;
};

export type ListeningNowResponse = {
    moodScore: number;
    dominantSentiment: string;
    emotionalVector: EmotionalVector;
    reasoning: string;
    coreAxes: CoreAxes;
    tracks: ListeningNowTrack[];
};

export async function getListeningNow(): Promise<ListeningNowResponse> {
    const data = await api.get("user/musicListeningNow").then((response) => response.data as ListeningNowResponse);

    return data;
}
