import { getMoodDisplayName } from "@/shared/lib/moodHelpers";
import type { MoodProfileResponse } from "../services/getMoodProfile";
import type { MoodHistoryItem, MoodWeekItem, UserStats } from "../services/profileStatsService";

export type DashboardInsight = {
    id: string;
    title: string;
    message: string;
    level: "positive" | "warning" | "info";
    confidence: number;
    cta?: string;
};

type InsightInput = {
    mood?: MoodProfileResponse | null;
    week?: MoodWeekItem[];
    history?: MoodHistoryItem[];
    stats?: UserStats | null;
};

function avg(values: number[]): number {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function toPct(value: number): number {
    return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

function buildTrendInsight(mood?: MoodProfileResponse | null, week: MoodWeekItem[] = []): DashboardInsight {
    const sorted = [...week].sort((a, b) => new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime());

    if (sorted.length >= 4) {
        const scores = sorted.map((item) => item.moodScore);
        const recent = scores.slice(-3);
        const prev = scores.slice(Math.max(0, scores.length - 6), Math.max(0, scores.length - 3));
        const recentAvg = avg(recent);
        const prevAvg = avg(prev.length ? prev : scores.slice(0, Math.max(1, scores.length - recent.length)));
        const delta = recentAvg - prevAvg;
        const deltaPts = Math.round(Math.abs(delta) * 100);

        if (delta > 0.03) {
            return {
                id: "trend",
                title: "Tendencia semanal",
                message: `Seu score medio subiu para ${toPct(recentAvg)}% (${deltaPts} pts acima da janela anterior).`,
                level: "positive",
                confidence: 0.85,
            };
        }

        if (delta < -0.03) {
            return {
                id: "trend",
                title: "Tendencia semanal",
                message: `Seu score medio caiu para ${toPct(recentAvg)}% (${deltaPts} pts abaixo da janela anterior).`,
                level: "warning",
                confidence: 0.85,
                cta: "Vale tentar um refresh com um estilo diferente para comparar o proximo ciclo.",
            };
        }

        return {
            id: "trend",
            title: "Tendencia semanal",
            message: `Seu score se manteve estavel em ${toPct(recentAvg)}% nos ultimos dias.`,
            level: "info",
            confidence: 0.8,
        };
    }

    const current = mood?.moodScore ?? 0;
    return {
        id: "trend",
        title: "Tendencia semanal",
        message: `Ainda sem base semanal suficiente. Score atual em ${toPct(current)}%.`,
        level: "info",
        confidence: 0.45,
    };
}

function buildPatternInsight(history: MoodHistoryItem[] = [], stats?: UserStats | null): DashboardInsight {
    if (!history.length) {
        return {
            id: "pattern",
            title: "Padrao dominante",
            message: "Registre mais moods para detectar padroes com confianca.",
            level: "info",
            confidence: 0.35,
        };
    }

    const counts = new Map<string, number>();
    history.forEach((item) => {
        const label = getMoodDisplayName(item.sentiment, item.sentiment || "-");
        counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    const [topLabel, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const ratio = Math.round((topCount / history.length) * 100);
    const topArtist = stats?.topArtists?.[0]?.name;

    return {
        id: "pattern",
        title: "Padrao dominante",
        message: topArtist
            ? `${topLabel} apareceu em ${ratio}% dos registros. Seu artista mais recorrente e ${topArtist}.`
            : `${topLabel} apareceu em ${ratio}% dos seus ultimos ${history.length} registros.`,
        level: ratio >= 50 ? "warning" : "info",
        confidence: Math.min(0.95, 0.55 + history.length / 50),
    };
}

function buildActionInsight(mood?: MoodProfileResponse | null): DashboardInsight {
    if (!mood) {
        return {
            id: "action",
            title: "Proxima acao",
            message: "Sem mood atual para recomendacao contextual.",
            level: "info",
            confidence: 0.3,
        };
    }

    const p = mood.coreAxes?.polaridade ?? 0;
    const a = mood.coreAxes?.ativacao ?? 0;

    if (p < -0.15 && a > 0.2) {
        return {
            id: "action",
            title: "Proxima acao",
            message: "Alta ativacao com polaridade baixa detectada. Foque em faixas mais estaveis antes do proximo refresh.",
            level: "warning",
            confidence: 0.82,
            cta: "Monte uma sequencia curta com tracks de menor tensao e compare em 30 minutos.",
        };
    }

    if (p > 0.15 && a > 0.2) {
        return {
            id: "action",
            title: "Proxima acao",
            message: "Momento favoravel para manter ritmo. Seu estado atual combina com exploracao de estilos mais energicos.",
            level: "positive",
            confidence: 0.82,
            cta: "Teste um refresh em outro studio para capturar variacoes do mesmo pico.",
        };
    }

    if (a < -0.1) {
        return {
            id: "action",
            title: "Proxima acao",
            message: "Ativacao baixa detectada. Priorize faixas progressivas para subir energia sem ruido emocional.",
            level: "info",
            confidence: 0.78,
            cta: "Use 2-3 tracks de transicao e gere novo mood para validar mudanca.",
        };
    }

    return {
        id: "action",
        title: "Proxima acao",
        message: "Estado equilibrado. O melhor ganho agora vem de consistencia nos proximos registros.",
        level: "info",
        confidence: 0.74,
        cta: "Mantenha o mesmo padrao por 2 dias para confirmar tendencia.",
    };
}

export function buildDashboardInsights(input: InsightInput): DashboardInsight[] {
    const week = input.week ?? [];
    const history = input.history ?? [];

    return [
        buildTrendInsight(input.mood, week),
        buildPatternInsight(history, input.stats),
        buildActionInsight(input.mood),
    ];
}
