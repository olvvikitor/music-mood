import api from "@/shared/services/apiService"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { CoreAxes, Mood } from "../types/music";

export type MoodProfileResponse = {
    moodScore: number;
    id: string;
    userId: string;
    sentiment: string;
    url_gif: string;
    emotions: EmotionalVector;
    reasoning: string;
    analyzedAt: Date;
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
// DISPLAY NAMES — label interno → texto que o usuário vê
// Tom: gíria BR / shareável
// ---------------------------------------------------------------------------
export const moodDisplayName: Record<Mood, string> = {
    // 🔥 Positivo + Alta Energia
    EuforiaAtiva:             "tô voando",
    ConfiancaDominante:       "na minha era",
    RockEletrizante:          "adrenalina pura",
    TensaoCriativa:           "caos controlado",

    // 🌤 Positivo + Baixa Energia
    AmorCalmo:                "apaixonadx",
    ConexaoAfetiva:           "no calor do abraço",
    NostalgiaFeliz:           "saudade boa",
    Serenidade:               "na paz",
    PazInterior:              "zerado",
    Contemplacao:             "viajando",

    // ⚡ Negativo + Alta Energia
    TensaoDramatica:          "pressentindo",
    Frustracao:               "engolindo seco",
    IrritacaoAtiva:           "tô no limite",
    RaivaExplosiva:           "surtando",

    // 🌧 Negativo + Baixa Energia
    NostalgiaProfunda:        "chorando no banheiro",
    Desanimo:                 "apagado",

    // 🌀 Centro / Transição
    VulnerabilidadeEmocional: "alma aberta",
    Ambivalencia:             "tô confuso",
    Estupor:                  "travado",
};

// Helper — retorna o display name ou o label original como fallback
export function getDisplayName(sentiment: string): string {
    return moodDisplayName[sentiment as Mood] ?? sentiment;
}

// ---------------------------------------------------------------------------
// ANIME GIF MAP — label interno → queries pro Giphy
// ---------------------------------------------------------------------------
const animeSearchMap: Record<string, string[]> = {
    // 🔥 Positivo + Alta Energia
    EuforiaAtiva: [
        "dragon ball super saiyan transformation",
        "luffy gear 5 animation",
        "jujutsu kaisen satoru gojo hollow purple",
        "promare burning rescue energy",
        "demon slayer tanjiro hinokami kagura",
    ],
    ConfiancaDominante: [
        "madara uchiha badass moment",
        "bleach aizen calm smile",
        "death note light yagami god complex",
        "code geass lelouch commanding",
        "gilgamesh fate series laugh",
    ],
    RockEletrizante: [
        "gurren lagann fight scene",
        "kill la kill transformation",
        "my hero academia plus ultra",
        "black clover asta magic burst",
        "chainsaw man denji power up",
    ],
    TensaoCriativa: [
        "steins gate okabe genius",
        "death note l thinking",
        "mob psycho 100 psychic focus",
        "paranoia agent running",
        "serial experiments lain awakening",
    ],

    // 🌤 Positivo + Baixa Energia
    AmorCalmo: [
        "kaguya sama love confession",
        "horimiya soft moment",
        "your lie in april piano scene",
        "toradora taiga gentle smile",
        "clannad couple walking",
    ],
    ConexaoAfetiva: [
        "spy x family anya loid hug",
        "kimi ni todoke heartfelt smile",
        "clannad after story hug",
        "one piece crew banquet laugh",
        "horimiya sweet moment",
    ],
    NostalgiaFeliz: [
        "anohana childhood friends",
        "studio ghibli nostalgic scene",
        "digimon adventure kids running",
        "cardcaptor sakura happy",
        "pokemon ash pikachu reunion",
    ],
    Serenidade: [
        "studio ghibli landscape wind",
        "mushishi forest scene",
        "hyouka chitanda peaceful",
        "your name balcony view sunset",
        "naruto field of flowers peace",
    ],
    PazInterior: [
        "studio ghibli totoro rain quiet",
        "made in abyss peaceful surface",
        "mushishi calm nature",
        "kino no tabi quiet journey",
        "wolf children forest scene",
    ],
    Contemplacao: [
        "evangelion shinji looking at stars",
        "vinland saga thorfinn looking at horizon",
        "violet evergarden writing letter",
        "attack on titan eren looking at sea",
        "berserk guts bonfire of dreams",
    ],

    // ⚡ Negativo + Alta Energia
    TensaoDramatica: [
        "attack on titan final season tension",
        "demon slayer upper moon battle",
        "jujutsu kaisen mahito fight",
        "berserk eclipse scene",
        "code geass dramatic moment",
    ],
    Frustracao: [
        "evangelion shinji frustrated",
        "fullmetal alchemist edward frustrated wall",
        "oregairu hachiman bitter monologue",
        "welcome to nhk paranoia",
        "tatami galaxy running",
    ],
    IrritacaoAtiva: [
        "black clover asta shouting frustrated",
        "fullmetal alchemist edward short temper",
        "bakugo boku no hero yelling",
        "kill la kill ryuko angry transformation",
    ],
    RaivaExplosiva: [
        "hunter x hunter gon rage transformation",
        "naruto nine tails rage",
        "dragon ball vegeta limit break",
        "attack on titan eren rage",
        "berserk guts berserker armor",
    ],

    // 🌧 Negativo + Baixa Energia
    NostalgiaProfunda: [
        "cowboy bebop see you space cowboy",
        "naruto swing alone scene",
        "fullmetal alchemist rain scene",
        "spirited away train ride lights",
        "5 centimeters per second train station",
    ],
    Desanimo: [
        "march comes in like a lion depression",
        "tokyo ghoul kaneki walking in rain",
        "cowboy bebop spike rain blue",
        "shigatsu wa kimi no uso monochrome",
        "neon genesis evangelion hospital scene",
    ],

    // 🌀 Centro / Transição
    VulnerabilidadeEmocional: [
        "one piece nami help me luffy",
        "violet evergarden crying emotional",
        "my hero academia deku crying midoriya",
        "demon slayer nezuko vulnerable moment",
    ],
    Ambivalencia: [
        "neon genesis evangelion rei expressionless",
        "oregairu hachiman staring window",
        "monogatari series ambiguous expression",
        "tatami galaxy loop confusion",
        "ping pong the animation stare",
    ],
    Estupor: [
        "mob psycho 100 mob blank expression",
        "tokyo ghoul kaneki blank stare",
        "welcome to nhk dissociation",
        "serial experiments lain numbness",
        "mushishi quiet stillness",
    ],
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
    const data: MoodProfileResponse = await api.get('user/mood').then((response) => response.data);
    const gifUrl = await getGifByMood(data.sentiment);

    const tracksAjustadas = data.tracksAnalyzeds.map((track) => ({
        ...track,
        dominantSentiment: getDisplayName(track.dominantSentiment),
    }));

    return {
        ...data,
        sentiment: getDisplayName(data.sentiment),
        url_gif: gifUrl,
        tracksAnalyzeds: tracksAjustadas,
    };
}

async function getGifByMood(sentiment: string): Promise<string> {
    const searchTerms = animeSearchMap[sentiment] ?? ["anime aesthetic"];
    const randomTag = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const { data: results } = await gf.search(randomTag, {
        sort: 'relevant',
        limit: 1,
        type: "gifs",
        rating: "pg-13",
    });

    return results.length > 0
        ? results[0].images.fixed_height.webp
        : "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJid3p6ZzR0bmZ6eGZ6ZzR0bmZ6eGZ6ZzR0bmZ6eGZ6ZzR0JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/1136UBdSNn6PPa/giphy.gif";
}