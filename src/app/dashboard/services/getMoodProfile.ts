import api from "@/shared/services/apiService"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { url } from "inspector"

export type MoodProfileResponse = {
    moodScore: number;
    id: string;
    userId: string;
    sentiment: string;
    url_gif: string,
    emotions: EmotionalVector;
    analyzedAt: Date;
    tracksAnalyzeds: {
        music: string,
        artist: string,
        emotionalVector: EmotionalVector,
        dominantSentiment: string
    };
}
const moodTranslationMap: Record<string, string> = {
    // Positivos Energéticos
    LaEmCima: "excited",
    NoFluxo: "motivated",
    PartiuConquistar: "determined",
    ModoChefe: "confident",

    // Positivos Calmos
    GoodVibes: "peaceful",
    GratidaoTotal: "grateful",
    CliminhaDeAmor: "in love",
    FeNoFuturo: "hopeful",

    // Reflexivos
    SaudadeBoa: "nostalgic",
    Pensativo: "thoughtful",
    ViajandoNaMente: "dreamy",

    // Negativos Energéticos
    Pilhado: "stressed",
    DeSacoCheio: "annoyed",
    Estourado: "angry",

    // Negativos Passivos
    Badzinho: "sad",
    CoracaoAberto: "vulnerable",
    NaSua: "lonely",
    SemGas: "tired"
};
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY!)

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


export async function getMoodProfile(): Promise<MoodProfileResponse> {


    const data: MoodProfileResponse = await api.get('user/mood').then((response) => response.data)
    const gifUrl = await getGifByMood(data.sentiment)
    return {
        ...data,
        url_gif: gifUrl
    }
}

async function getGifByMood(sentiment: string): Promise<string> {
    const translated = moodTranslationMap[sentiment] ?? "neutral"

    const { data } = await gf.random({
        tag: `anime ${translated} reaction`,
        type: "gifs",
        rating: "pg-13"
    })

    return data.images.fixed_height.webp
}