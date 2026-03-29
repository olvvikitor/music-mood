import api from "@/shared/services/apiService"
import { CoreAxes } from "../types/music";
import  { getMoodDisplayName } from "@/shared/lib/moodHelpers";

export type MoodProfileResponse = {
    moodScore: number;
    id: string;
    userId: string;
    sentiment: string;
    url_gif: string;
    emotions: EmotionalVector;
    reasoning: string;
    analyzedAt: Date;
    image_mood:string,
    coreAxes: CoreAxes;
    tracksAnalyzeds: {
        music: string;
        id: string;
        img_url: string;
        artist: string;
        emotionalVector: EmotionalVector;
        moodScore: number;
        reasoning: string;
        dominantSentiment: string;
        coreAxes: CoreAxes;
    }[];
}




// ---------------------------------------------------------------------------
// Tipos auxiliares
// ---------------------------------------------------------------------------
export const EMOTIONAL_DIMENSIONS = [
    "Valencia",
    "Energia",
    "Dominancia",
    "Melancolia",
    "Euforia",
    "Tensao",
    "ConexaoSocial",
    "Introspeccao",
    "Empoderamento",
    "Vulnerabilidade"
] as const;

export type EmotionalVector = {
    [K in typeof EMOTIONAL_DIMENSIONS[number]]: number;
};

// ---------------------------------------------------------------------------
// API principal
// ---------------------------------------------------------------------------
export async function getMoodProfile(): Promise<MoodProfileResponse> {
    const data: MoodProfileResponse = await api
        .get("user/mood")
        .then((r) => r.data);

    const tracksAjustadas = data.tracksAnalyzeds.map((track) => ({
        ...track,
        dominantSentiment: getMoodDisplayName(track.dominantSentiment, track.dominantSentiment),
    }));

    return {
        ...data,
        sentiment:       getMoodDisplayName(data.sentiment, data.sentiment),
        tracksAnalyzeds: tracksAjustadas,
    };
}