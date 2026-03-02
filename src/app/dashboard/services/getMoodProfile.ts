import api from "@/shared/services/apiService"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { Mood } from "../types/music";

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
        id: string,
        img_url: string
        artist: string,
        emotionalVector: EmotionalVector,
        moodScore:number,
        dominantSentiment: string
    }[];
}
const animeSearchMap: Record<string, string[]> = {

    // 🔥 Positivo + Alta Energia
    EuforiaAtiva: [
        "anime power up aura",
        "anime glowing energy transformation",
        "anime hype battle moment"
    ],

    ConfiancaDominante: [
        "anime confident smirk close up",
        "anime villain calm smile",
        "anime boss aura scene"
    ],

    // 🌤 Positivo + Baixa Energia
    Serenidade: [
        "anime peaceful sunset scene",
        "anime soft smile wind blowing",
        "anime calm nature landscape"
    ],

    ConexaoAfetiva: [
        "anime warm hug emotional",
        "anime holding hands sunset",
        "anime heartfelt smile close up"
    ],

    // 🌙 Reflexivo
    NostalgiaProfunda: [
        "anime nostalgic flashback scene",
        "anime sad smile rain",
        "anime childhood memory scene"
    ],

    Contemplacao: [
        "anime looking at sky alone",
        "anime deep thought balcony scene",
        "anime quiet night city lights"
    ],

    // ⚡ Negativo + Alta Energia
    IrritacaoAtiva: [
        "anime frustrated shout scene",
        "anime intense glare close up",
        "anime argument dramatic scene"
    ],

    RaivaExplosiva: [
        "anime rage power up",
        "anime angry transformation scene",
        "anime screaming energy burst"
    ],

    // 🌧 Negativo + Baixa Energia
    Desanimo: [
        "anime sitting alone rain",
        "anime crying softly night",
        "anime emotional breakdown scene"
    ],

    VulnerabilidadeEmocional: [
        "anime emotional confession scene",
        "anime tears close up",
        "anime vulnerable moment soft lighting"
    ]
};
const renameSentiment: Record<string, string> = {
    EuforiaAtiva: "Euforia Ativa",
    ConfiancaDominante: "Confianca Dominante",
    Serenidade: "Serenidade",
    ConexaoAfetiva: "Conexao Afetiva",
    NostalgiaProfunda: "Nostalgia Profunda",
    Contemplacao: "Contemplacao",
    IrritacaoAtiva: "Irritacao Ativa",
    RaivaExplosiva: "Raiva Explosiva",
    Desanimo: "Desanimo",
    VulnerabilidadeEmocional: "Vulnerabilidade Emocional",
}
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
    const tracksAjustadas = data.tracksAnalyzeds.map((track) => ({
        ...track,
        // Se houver tradução no renameSentiment, usa ela. Senão, mantém o original.
        dominantSentiment: renameSentiment[track.dominantSentiment] ?? track.dominantSentiment
    }));

    // 3. Retorna o objeto completo com o sentimento principal e a lista de tracks tratada
    return {
        ...data,
        sentiment: renameSentiment[data.sentiment] ?? data.sentiment,
        url_gif: gifUrl,
        tracksAnalyzeds: tracksAjustadas
    };
}


async function getGifByMood(sentiment: string): Promise<string> {
    const searchTerms = animeSearchMap[sentiment] ?? ["anime neutral mood"]

    const randomTag =
        searchTerms[Math.floor(Math.random() * searchTerms.length)]

    const { data } = await gf.random({
        tag: `${randomTag}`,
        type: "gifs",
        rating: "pg-13"
    })

    return data.images.fixed_height.webp
}