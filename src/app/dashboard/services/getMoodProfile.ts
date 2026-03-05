import api from "@/shared/services/apiService"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { CoreAxes, Mood } from "../types/music";

export type MoodProfileResponse = {
    moodScore: number;
    id: string;
    userId: string;
    sentiment: string;
    url_gif: string,
    emotions: EmotionalVector;
    reasoning:string;
    analyzedAt: Date;
    coreAxes:CoreAxes
    tracksAnalyzeds: {
        music: string,
        id: string,
        img_url: string
        artist: string,
        emotionalVector: EmotionalVector,
        moodScore: number,
        reasoning:string
        dominantSentiment: string,
        coreAxes:CoreAxes
    }[];
}
const animeSearchMap: Record<string, string[]> = {
    // 🔥 Positivo + Alta Energia
    EuforiaAtiva: [
        "dragon ball super saiyan transformation",
        "luffy gear 5 animation",
        "jujutsu kaisen satoru gojo hollow purple",
        "promare burning rescue energy",
        "demon slayer tanjiro hinokami kagura"
    ],

    ConfiancaDominante: [
        "madara uchiha badass moment",
        "bleach aizen calm smile",
        "death note light yagami god complex",
        "code geass lelouch commanding",
        "gilgamesh fate series laugh"
    ],

    // 🌤 Positivo + Baixa Energia
    Serenidade: [
        "studio ghibli landscape wind",
        "mushishi forest scene",
        "hyouka chitanda peaceful",
        "your name balcony view sunset",
        "naruto field of flowers peace"
    ],

    ConexaoAfetiva: [
        "spy x family anya loid hug",
        "kimi ni todoke heartfelt smile",
        "clannad after story hug",
        "one piece crew banquet laugh",
        "horimiya sweet moment"
    ],

    // 🌙 Reflexivo
    NostalgiaProfunda: [
        "cowboy bebop see you space cowboy",
        "naruto swing alone scene",
        "fullmetal alchemist rain scene",
        "spirited away train ride lights",
        "5 centimeters per second train station"
    ],

    Contemplacao: [
        "evangelion shinji looking at stars",
        "vinland saga thorfinn looking at horizon",
        "violet evergarden writing letter",
        "attack on titan eren looking at sea",
        "berserk guts bonfire of dreams"
    ],

    // ⚡ Negativo + Alta Energia
    IrritacaoAtiva: [
        "black clover asta shouting frustrated",
        "fullmetal alchemist edward short temper",
        "bakugo boku no hero yelling",
        "kill la kill ryuko angry transformation"
    ],

    RaivaExplosiva: [
        "hunter x hunter rage",
        "naruto rage",
        "dragon ball rage screaming",
        "attack on titan rage scene",
        "anime fight scenes"
    ],

    // 🌧 Negativo + Baixa Energia
    Desanimo: [
        "march comes in like a lion depression",
        "tokyo ghoul kaneki walking in rain",
        "cowboy bebop spike rain blue",
        "shigatsu wa kimi no uso monochrome",
        "neon genesis evangelion hospital scene"
    ],

    VulnerabilidadeEmocional: [
        "one piece nami help me luffy",
        "violet evergarden crying emotional",
        "my hero academia deku crying midoriya",
        "demon slayer nezuko vulnerable moment"
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
    const searchTerms = animeSearchMap[sentiment] ?? ["anime aesthetic"]

    const randomTag =
        searchTerms[Math.floor(Math.random() * searchTerms.length)]

    const { data: results } = await gf.search(randomTag, {
        sort: 'relevant', // Garante o GIF mais relevante
        limit: 1,         // Pega apenas o melhor resultado
        type: "gifs",
        rating: "pg-13"
    });

// Verifica se retornou algo, senão usa um fallback
    return results.length > 0 
        ? results[0].images.fixed_height.webp 
        : "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJid3p6ZzR0bmZ6eGZ6ZzR0bmZ6eGZ6ZzR0bmZ6eGZ6ZzR0JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/1136UBdSNn6PPa/giphy.gif";
    }