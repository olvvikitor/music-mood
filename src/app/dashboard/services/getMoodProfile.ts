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
// DISPLAY NAMES
// ---------------------------------------------------------------------------
export const moodDisplayName: Record<Mood, string> = {
    EuforiaAtiva:             "pilhado",
    ConfiancaDominante:       "ta numa marra ein?",
    RockEletrizante:          "adrenalina pura",
    TensaoCriativa:           "caos controlado",
    AmorCalmo:                "apaixonadx",
    ConexaoAfetiva:           "love love",
    NostalgiaFeliz:           "saudade boa",
    Serenidade:               "de boa",
    PazInterior:              "zerado",
    Contemplacao:             "viajando",
    TensaoDramatica:          "pressentindo",
    Frustracao:               "de cara",
    IrritacaoAtiva:           "p da vida",
    RaivaExplosiva:           "surtando",
    NostalgiaProfunda:        "chorando no banheiro",
    Desanimo:                 "quebrado",
    VulnerabilidadeEmocional: "delulu",
    Ambivalencia:             "tô confuso",
    Estupor:                  "travado",
};

export function getDisplayName(sentiment: string): string {
    return moodDisplayName[sentiment as Mood] ?? sentiment;
}

// ---------------------------------------------------------------------------
// ANIME CHARACTER MAP
//
// Filosofia de query pro Giphy:
//   ✅ "[personagem] [emoção simples]"       → bem indexado
//   ✅ "[personagem] [nome do anime]"        → bem indexado
//   ✅ "[personagem] happy/angry/sad/cry"    → bem indexado
//   ❌ cena narrativa específica             → raramente indexada
//   ❌ nomes de técnicas (baryon mode, etc)  → não indexados
//
// Cada mood tem:
//   high → score >= 0.65  (personagens/momentos de alta intensidade emocional)
//   low  → score <  0.65  (mesmos personagens ou universo em tom mais suave)
// ---------------------------------------------------------------------------
type QueryPool = { high: string[]; low: string[] };

const animeQueryMap: Record<string, QueryPool> = {

    // ─── 🔥 EuforiaAtiva — pilhado ────────────────────────────────────────
    // Luffy (One Piece), Goku (DBZ), Naruto, Deku (MHA), Asta (Black Clover)
    EuforiaAtiva: {
        high: [
            "luffy gear 5",
            "goku super saiyan",
            "naruto nine tails",
            "deku smiling my hero academia",
            "asta power black clover",
        ],
        low: [
            "luffy laughing one piece",
            "goku happy dragon ball",
            "naruto happy",
            "deku excited boku no hero",
            "gon happy hunter x hunter",
        ],
    },

    // ─── 😎 ConfiancaDominante — ta numa marra ein? ────────────────────────
    // Aizen (Bleach), Light Yagami (Death Note), Lelouch (Code Geass),
    // Levi (AoT), Gilgamesh (Fate)
    ConfiancaDominante: {
        high: [
            "aizen bleach smile",
            "light yagami death note",
            "lelouch code geass",
            "gilgamesh fate",
            "madara uchiha naruto",
        ],
        low: [
            "levi ackerman attack on titan",
            "kurapika hunter x hunter",
            "senku dr stone",
            "shikamaru naruto thinking",
            "hachiman oregairu",
        ],
    },

    // ─── ⚡ RockEletrizante — adrenalina pura ─────────────────────────────
    // Simon (Gurren Lagann), Ryuko (Kill la Kill), Denji (Chainsaw Man),
    // Tanjiro (Demon Slayer), Yuji (JJK)
    RockEletrizante: {
        high: [
            "gurren lagann fight",
            "kill la kill ryuko",
            "chainsaw man denji",
            "tanjiro demon slayer fight",
            "jujutsu kaisen fight",
        ],
        low: [
            "gurren lagann",
            "kill la kill satsuki",
            "tanjiro demon slayer",
            "my hero academia deku run",
            "fire force shinra",
        ],
    },

    // ─── 🧠 TensaoCriativa — caos controlado ──────────────────────────────
    // L (Death Note), Okabe (Steins;Gate), Lain (SEL), Mob (Mob Psycho), Oreki (Hyouka)
    TensaoCriativa: {
        high: [
            "l death note",
            "okabe steins gate",
            "mob psycho 100 explosion",
            "serial experiments lain",
            "light yagami thinking death note",
        ],
        low: [
            "l death note thinking",
            "okabe steins gate lab",
            "mob psycho 100 mob",
            "hyouka oreki",
            "ping pong anime",
        ],
    },

    // ─── 💕 AmorCalmo — apaixonadx ───────────────────────────────────────
    // Kaguya (Kaguya-sama), Hori/Miyamura (Horimiya),
    // Kaori (Shigatsu), Taiga (Toradora), Sawako (Kimi ni Todoke)
    AmorCalmo: {
        high: [
            "kaguya sama love",
            "your lie in april",
            "toradora taiga",
            "horimiya",
            "clannad",
        ],
        low: [
            "horimiya cute",
            "kimi ni todoke sawako",
            "spy x family anya",
            "toradora",
            "clannad nagisa",
        ],
    },

    // ─── 🤝 ConexaoAfetiva — love love ───────────────────────────────────
    // Luffy e tripulação (One Piece), Deku e amigos (MHA),
    // Hinata (Haikyuu), Fairy Tail, Anya (Spy x Family)
    ConexaoAfetiva: {
        high: [
            "one piece nakama luffy",
            "fairy tail hug",
            "my hero academia friends",
            "haikyuu celebrate",
            "naruto sasuke friends",
        ],
        low: [
            "spy x family anya loid",
            "k-on girls",
            "cardcaptor sakura",
            "one piece crew",
            "kimi ni todoke friends",
        ],
    },

    // ─── 🌸 NostalgiaFeliz — saudade boa ─────────────────────────────────
    // Ash/Pikachu (Pokémon), Chihiro (Sen to Chihiro),
    // Menma (AnoHana), Kiki (Majo), Sakura (CCS)
    NostalgiaFeliz: {
        high: [
            "pokemon ash pikachu",
            "anohana menma",
            "spirited away chihiro",
            "your lie in april",
            "digimon adventure",
        ],
        low: [
            "kiki delivery service",
            "cardcaptor sakura happy",
            "my neighbor totoro",
            "pokemon pikachu cute",
            "digimon kids",
        ],
    },

    // ─── 🌿 Serenidade — de boa ───────────────────────────────────────────
    // Totoro (Ghibli), Chitanda (Hyouka), Ginko (Mushishi),
    // Mitsuha (Kimi no Na wa), Handa (Barakamon)
    Serenidade: {
        high: [
            "your name anime",
            "spirited away",
            "violet evergarden",
            "wolf children",
            "weathering with you",
        ],
        low: [
            "my neighbor totoro",
            "mushishi anime",
            "hyouka chitanda",
            "barakamon",
            "natsume yuujinchou",
        ],
    },

    // ─── 🧘 PazInterior — zerado ─────────────────────────────────────────
    // Totoro (Ghibli), Ginko (Mushishi), Kino (Kino no Tabi),
    // Rakka (Haibane Renmei), Riko (Made in Abyss)
    PazInterior: {
        high: [
            "spirited away train",
            "made in abyss",
            "kino no tabi",
            "haibane renmei",
            "mushishi nature",
        ],
        low: [
            "my neighbor totoro sleep",
            "mushishi calm",
            "spirited away peaceful",
            "wolf children snow",
            "natsume yuujinchou fireflies",
        ],
    },

    // ─── 🌌 Contemplacao — viajando ──────────────────────────────────────
    // Eren (AoT), Spike (Cowboy Bebop), Thorfinn (Vinland Saga),
    // Shinji (NGE), Violet (Violet Evergarden)
    Contemplacao: {
        high: [
            "attack on titan eren",
            "cowboy bebop spike",
            "vinland saga",
            "evangelion shinji",
            "berserk guts",
        ],
        low: [
            "violet evergarden writing",
            "mushishi ginko",
            "evangelion shinji train",
            "natsume yuujinchou night",
            "serial experiments lain window",
        ],
    },

    // ─── 😰 TensaoDramatica — pressentindo ───────────────────────────────
    // Eren (AoT), Guts (Berserk), Lelouch (Code Geass),
    // Kaneki (Tokyo Ghoul), Light (Death Note)
    TensaoDramatica: {
        high: [
            "attack on titan eren angry",
            "berserk guts fight",
            "demon slayer akaza",
            "jujutsu kaisen sukuna",
            "code geass lelouch dramatic",
        ],
        low: [
            "attack on titan serious",
            "code geass lelouch chess",
            "fullmetal alchemist serious",
            "tokyo ghoul kaneki",
            "death note light",
        ],
    },

    // ─── 😤 Frustracao — de cara ──────────────────────────────────────────
    // Edward (FMA), Shinji (NGE), Hachiman (Oregairu),
    // Deku (MHA), Asta (Black Clover)
    Frustracao: {
        high: [
            "fullmetal alchemist edward angry",
            "evangelion shinji frustrated",
            "my hero academia deku cry",
            "black clover asta yell",
            "oregairu hachiman bitter",
        ],
        low: [
            "evangelion shinji sad",
            "oregairu hachiman",
            "welcome to nhk",
            "tatami galaxy",
            "march comes like lion rei sad",
        ],
    },

    // ─── 😠 IrritacaoAtiva — p da vida ───────────────────────────────────
    // Bakugo (MHA), Asuka (NGE), Taiga (Toradora),
    // Ryuko (Kill la Kill), Edward (FMA)
    IrritacaoAtiva: {
        high: [
            "bakugo angry my hero academia",
            "kill la kill ryuko angry",
            "fullmetal alchemist edward yell",
            "asuka evangelion angry",
            "black clover asta scream",
        ],
        low: [
            "bakugo annoyed",
            "asuka evangelion",
            "toradora taiga angry",
            "fruits basket kyo",
            "haruhi suzumiya angry",
        ],
    },

    // ─── 💢 RaivaExplosiva — surtando ────────────────────────────────────
    // Gon (HxH), Vegeta (DBZ), Guts (Berserk),
    // Eren (AoT), Naruto (kyuubi)
    RaivaExplosiva: {
        high: [
            "gon rage hunter x hunter",
            "naruto angry kyuubi",
            "vegeta rage dragon ball",
            "attack on titan eren rage",
            "berserk guts angry",
        ],
        low: [
            "vegeta dragon ball",
            "guts berserk",
            "eren attack on titan serious",
            "mugen samurai champloo",
            "roy mustang fullmetal alchemist",
        ],
    },

    // ─── 😢 NostalgiaProfunda — chorando no banheiro ─────────────────────
    // Spike (Cowboy Bebop), Kaori (Shigatsu), Menma (AnoHana),
    // Guts (Berserk), Violet (Violet Evergarden)
    NostalgiaProfunda: {
        high: [
            "cowboy bebop spike sad",
            "your lie in april cry",
            "anohana cry",
            "violet evergarden cry",
            "clannad after story cry",
        ],
        low: [
            "cowboy bebop spike",
            "spirited away train night",
            "fullmetal alchemist sad",
            "naruto sad alone",
            "violet evergarden sad",
        ],
    },

    // ─── 💀 Desanimo — quebrado ───────────────────────────────────────────
    // Rei (Sangatsu no Lion), Shinji (NGE), Kaneki (Tokyo Ghoul),
    // Sato (Welcome to NHK), Kousei (Shigatsu)
    Desanimo: {
        high: [
            "march comes like lion rei depressed",
            "evangelion shinji depressed",
            "tokyo ghoul kaneki sad",
            "welcome to nhk depressed",
            "cowboy bebop sad",
        ],
        low: [
            "march comes like lion rei",
            "cowboy bebop spike floor",
            "shigatsu wa kimi no uso sad",
            "tokyo ghoul kaneki rain",
            "serial experiments lain sad",
        ],
    },

    // ─── 🥺 VulnerabilidadeEmocional — delulu ────────────────────────────
    // Violet (Violet Evergarden), Nami (One Piece),
    // Tohru (Fruits Basket), Deku (MHA), Shoya (A Silent Voice)
    VulnerabilidadeEmocional: {
        high: [
            "violet evergarden cry",
            "one piece nami cry",
            "your lie in april emotional",
            "my hero academia deku cry",
            "a silent voice emotional",
        ],
        low: [
            "violet evergarden gentle",
            "fruits basket tohru",
            "clannad nagisa",
            "demon slayer nezuko",
            "kimi ni todoke sawako cry",
        ],
    },

    // ─── 😶 Ambivalencia — tô confuso ────────────────────────────────────
    // Rei (NGE), Hachiman (Oregairu), Lain (SEL),
    // Hitagi (Monogatari), Peco (Ping Pong)
    Ambivalencia: {
        high: [
            "evangelion rei expressionless",
            "serial experiments lain confused",
            "monogatari series",
            "tatami galaxy",
            "paranoia agent",
        ],
        low: [
            "oregairu hachiman thinking",
            "ping pong anime peco",
            "natsume yuujinchou",
            "haibane renmei",
            "serial experiments lain",
        ],
    },

    // ─── 😑 Estupor — travado ─────────────────────────────────────────────
    // Mob (Mob Psycho), Shinji (NGE), Kaneki (Tokyo Ghoul),
    // Sato (Welcome to NHK), Lain (SEL)
    Estupor: {
        high: [
            "mob psycho 100 blank",
            "evangelion shinji blank",
            "tokyo ghoul kaneki blank",
            "welcome to nhk blank",
            "serial experiments lain blank",
        ],
        low: [
            "mob psycho 100 mob",
            "mushishi quiet",
            "oregairu hachiman blank",
            "march comes like lion rei",
            "natsume yuujinchou alone",
        ],
    },
};

// ---------------------------------------------------------------------------
// Fallback — queries simples e bem indexadas no Giphy
// ---------------------------------------------------------------------------
const fallbackQueries = [
    "anime sad rain",
    "studio ghibli peaceful",
    "cowboy bebop spike",
    "mushishi anime",
    "violet evergarden",
];

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY!);

// ---------------------------------------------------------------------------
// Resolve chave interna a partir do sentiment display ou chave direta
// ---------------------------------------------------------------------------
function resolveSentimentKey(sentiment: string): string {
    if (animeQueryMap[sentiment]) return sentiment;

    const normalized = sentiment?.trim().toLowerCase();
    const mappedKey = Object.entries(moodDisplayName).find(
        ([, display]) => display.toLowerCase() === normalized,
    )?.[0];

    return mappedKey ?? sentiment;
}

// ---------------------------------------------------------------------------
// Busca GIF — pool por intensidade + offset aleatório para variedade real
// ---------------------------------------------------------------------------
export async function getGifByMood(
    sentiment: string,
    moodScore = 0.5,
): Promise<string> {
    const sentimentKey = resolveSentimentKey(sentiment);
    const pool         = animeQueryMap[sentimentKey];
    const isHighScore  = moodScore >= 0.65;

    const queries = pool
        ? (isHighScore ? pool.high : pool.low)
        : fallbackQueries;

    const randomQuery  = queries[Math.floor(Math.random() * queries.length)];
    const randomOffset = Math.floor(Math.random() * 16);

    try {
        const { data: results } = await gf.search(randomQuery, {
            sort:   "relevant",
            limit:  10,
            offset: randomOffset,
            type:   "gifs",
            rating: "pg-13",
        });

        if (results.length > 0) {
            const pick = results[Math.floor(Math.random() * Math.min(3, results.length))];
            return pick.images.fixed_height.webp;
        }
    } catch (err) {
        console.warn("[getGifByMood] Giphy error:", err);
    }

    return "https://media.giphy.com/media/1136UBdSNn6PPa/giphy.gif";
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

    const gifUrl = await getGifByMood(data.sentiment, data.moodScore);

    const tracksAjustadas = data.tracksAnalyzeds.map((track) => ({
        ...track,
        dominantSentiment: getDisplayName(track.dominantSentiment),
    }));

    return {
        ...data,
        sentiment:       getDisplayName(data.sentiment),
        url_gif:         gifUrl,
        tracksAnalyzeds: tracksAjustadas,
    };
}