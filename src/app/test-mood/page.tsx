'use client';

import { useState, useCallback } from 'react';
import api from '@/shared/services/apiService';

type TrackResult = {
    id: string;
    music: string;
    artist: string;
    img_url: string;
    emotionalVector: Record<string, number>;
    dominantSentiment: string;
    moodScore: number;
    coreAxes: { polaridade: number; ativacao: number; quadrante: string };
    reasoning: string;
};

type EmotionProb = { label: string; probability: number };

type TestMoodResponse = {
    moodScore: number;
    dominantSentiment: string;
    emotionalVector: Record<string, number>;
    reasoning: string;
    coreAxes: { polaridade: number; ativacao: number; quadrante: string };
    tracks: TrackResult[];
    emotionProbabilities: EmotionProb[];
    tracksCount: number;
    source: string;
};

const EMOTION_COLORS: Record<string, string> = {
    Euforia: '#f59e0b',
    Confianca: '#22d3ee',
    Energia: '#f97316',
    Amor: '#ec4899',
    Paz: '#86efac',
    Reflexao: '#a78bfa',
    Tensao: '#ef4444',
    Revolta: '#dc2626',
    Frustracao: '#fb923c',
    Melancolia: '#60a5fa',
    Tristeza: '#3b82f6',
    Vazio: '#6b7280',
    Ambivalente: '#9ca3af',
};

const DIMENSION_COLORS: Record<string, string> = {
    Valencia: '#22d3ee',
    Energia: '#f97316',
    Dominancia: '#ef4444',
    Melancolia: '#60a5fa',
    Euforia: '#f59e0b',
    Tensao: '#dc2626',
    ConexaoSocial: '#ec4899',
    Introspeccao: '#a78bfa',
    Empoderamento: '#10b981',
    Vulnerabilidade: '#6b7280',
};

function BarChart({ value, maxValue = 1, color, label, showValue }: {
    value: number; maxValue?: number; color: string; label: string; showValue: string;
}) {
    const pct = Math.min((value / maxValue) * 100, 100);
    return (
        <div className="flex items-center gap-3 group">
            <span className="text-xs text-white/50 w-28 text-right shrink-0 font-mono">{label}</span>
            <div className="flex-1 h-5 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.max(pct, 1)}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
                />
            </div>
            <span className="text-xs font-mono text-white/70 w-14 shrink-0">{showValue}</span>
        </div>
    );
}

function QuadrantPlot({ polaridade, ativacao }: { polaridade: number; ativacao: number }) {
    const x = ((polaridade + 1) / 2) * 100;
    const y = ((1 - (ativacao + 1) / 2)) * 100;
    return (
        <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Quadrant labels */}
            <span className="absolute top-2 left-3 text-[10px] text-white/25">Negativo/Ativo</span>
            <span className="absolute top-2 right-3 text-[10px] text-white/25">Positivo/Ativo</span>
            <span className="absolute bottom-2 left-3 text-[10px] text-white/25">Negativo/Calmo</span>
            <span className="absolute bottom-2 right-3 text-[10px] text-white/25">Positivo/Calmo</span>
            {/* Axes */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            {/* Point */}
            <div
                className="absolute w-4 h-4 rounded-full shadow-lg transition-all duration-500"
                style={{
                    left: `calc(${x}% - 8px)`,
                    top: `calc(${y}% - 8px)`,
                    background: '#6fae9b',
                    boxShadow: '0 0 16px rgba(111,174,155,0.6), 0 0 40px rgba(111,174,155,0.2)',
                }}
            />
            {/* Axis labels */}
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-white/30">Polaridade →</span>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-white/30 -rotate-90">Ativação →</span>
        </div>
    );
}

export default function TestMoodPage() {
    const [result, setResult] = useState<TestMoodResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<'today' | 'limit'>('today');
    const [limit, setLimit] = useState(20);
    const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

    const runTest = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = source === 'limit' ? `?limit=${limit}` : '';
            const res = await api.get<TestMoodResponse>(`user/testMood${params}`);
            setResult(res.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Erro ao testar');
        } finally {
            setLoading(false);
        }
    }, [source, limit]);

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <a href="/dashboard" className="text-xs text-white/40 hover:text-white/60 transition-colors mb-4 inline-block">
                        ← Voltar ao Dashboard
                    </a>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                        🧪 Teste do Algoritmo de Mood
                    </h1>
                    <p className="text-sm text-white/50 mt-1">
                        Executa a classificação sem gerar imagem e sem salvar. Ideal para debug.
                    </p>
                </div>

                {/* Controls */}
                <div className="glass-card p-5 mb-6">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">Fonte</label>
                            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                <button
                                    onClick={() => setSource('today')}
                                    className="px-4 py-2 text-xs font-medium transition-all"
                                    style={{
                                        background: source === 'today' ? 'rgba(111,174,155,0.2)' : 'transparent',
                                        color: source === 'today' ? '#6fae9b' : 'rgba(255,255,255,0.5)',
                                    }}
                                >
                                    Músicas de Hoje
                                </button>
                                <button
                                    onClick={() => setSource('limit')}
                                    className="px-4 py-2 text-xs font-medium transition-all"
                                    style={{
                                        background: source === 'limit' ? 'rgba(111,174,155,0.2)' : 'transparent',
                                        color: source === 'limit' ? '#6fae9b' : 'rgba(255,255,255,0.5)',
                                    }}
                                >
                                    Últimas N
                                </button>
                            </div>
                        </div>

                        {source === 'limit' && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">Quantidade</label>
                                <input
                                    type="number"
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                    min={1}
                                    max={100}
                                    className="w-20 px-3 py-2 rounded-xl text-sm text-white/90 outline-none"
                                    style={{ background: 'var(--surface-input)', border: '1px solid rgba(255,255,255,0.08)' }}
                                />
                            </div>
                        )}

                        <button
                            onClick={runTest}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{
                                background: loading ? 'rgba(111,174,155,0.1)' : 'linear-gradient(135deg, #6fae9b, #5a9a87)',
                                color: loading ? 'rgba(255,255,255,0.4)' : '#fff',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(111,174,155,0.3)',
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                                    Analisando...
                                </span>
                            ) : '▶ Executar Teste'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="glass-card p-4 mb-6" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}>
                        <p className="text-sm text-red-400">⚠ {error}</p>
                    </div>
                )}

                {result && (
                    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="glass-card p-4 text-center">
                                <div className="text-[11px] uppercase tracking-wider text-white/35 mb-1">Mood Score</div>
                                <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#6fae9b' }}>
                                    {(result.moodScore * 100).toFixed(0)}%
                                </div>
                            </div>
                            <div className="glass-card p-4 text-center">
                                <div className="text-[11px] uppercase tracking-wider text-white/35 mb-1">Sentimento</div>
                                <div className="text-lg font-bold" style={{
                                    fontFamily: 'var(--font-display)',
                                    color: EMOTION_COLORS[result.dominantSentiment] || '#6fae9b'
                                }}>
                                    {result.dominantSentiment}
                                </div>
                            </div>
                            <div className="glass-card p-4 text-center">
                                <div className="text-[11px] uppercase tracking-wider text-white/35 mb-1">Quadrante</div>
                                <div className="text-sm font-semibold text-white/80">{result.coreAxes.quadrante}</div>
                            </div>
                            <div className="glass-card p-4 text-center">
                                <div className="text-[11px] uppercase tracking-wider text-white/35 mb-1">Faixas</div>
                                <div className="text-2xl font-bold text-white/80">{result.tracksCount}</div>
                                <div className="text-[10px] text-white/30">{result.source}</div>
                            </div>
                        </div>

                        {/* Core Axes + Quadrant */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="glass-card p-5">
                                <h3 className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-4">Eixos Principais</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-white/50">Polaridade</span>
                                            <span className="font-mono text-white/70">{result.coreAxes.polaridade.toFixed(3)}</span>
                                        </div>
                                        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                            <div className="h-full rounded-full transition-all duration-700" style={{
                                                width: `${((result.coreAxes.polaridade + 1) / 2) * 100}%`,
                                                background: result.coreAxes.polaridade >= 0
                                                    ? 'linear-gradient(90deg, #6fae9b88, #6fae9b)'
                                                    : 'linear-gradient(90deg, #ef444488, #ef4444)',
                                            }} />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-white/25 mt-0.5">
                                            <span>-1 (Negativo)</span><span>+1 (Positivo)</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-white/50">Ativação</span>
                                            <span className="font-mono text-white/70">{result.coreAxes.ativacao.toFixed(3)}</span>
                                        </div>
                                        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                            <div className="h-full rounded-full transition-all duration-700" style={{
                                                width: `${((result.coreAxes.ativacao + 1) / 2) * 100}%`,
                                                background: 'linear-gradient(90deg, #a78bfa88, #f59e0b)',
                                            }} />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-white/25 mt-0.5">
                                            <span>-1 (Calmo)</span><span>+1 (Ativo)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card p-5">
                                <h3 className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-4">Mapa de Quadrante</h3>
                                <QuadrantPlot polaridade={result.coreAxes.polaridade} ativacao={result.coreAxes.ativacao} />
                            </div>
                        </div>

                        {/* Emotion Probabilities */}
                        <div className="glass-card p-5">
                            <h3 className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-4">Probabilidades de Emoção (Clusters)</h3>
                            <div className="space-y-1.5">
                                {result.emotionProbabilities.map((ep) => (
                                    <BarChart
                                        key={ep.label}
                                        label={ep.label}
                                        value={ep.probability}
                                        color={EMOTION_COLORS[ep.label] || '#6b7280'}
                                        showValue={`${(ep.probability * 100).toFixed(1)}%`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Emotional Vector */}
                        <div className="glass-card p-5">
                            <h3 className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-4">Vetor Emocional Agregado</h3>
                            <div className="space-y-1.5">
                                {Object.entries(result.emotionalVector)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([dim, val]) => (
                                        <BarChart
                                            key={dim}
                                            label={dim}
                                            value={val}
                                            color={DIMENSION_COLORS[dim] || '#6b7280'}
                                            showValue={val.toFixed(3)}
                                        />
                                    ))}
                            </div>
                        </div>

                        {/* Tracks */}
                        {result.tracks.length > 0 && (
                            <div className="glass-card p-5">
                                <h3 className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-4">
                                    Faixas Analisadas ({result.tracks.length})
                                </h3>
                                <div className="space-y-1">
                                    {result.tracks.map((track) => (
                                        <div key={track.id}>
                                            <button
                                                onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left hover:bg-white/[0.03]"
                                            >
                                                {track.img_url && (
                                                    <img src={track.img_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-white/90 truncate">{track.music}</div>
                                                    <div className="text-xs text-white/40 truncate">{track.artist}</div>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <div className="text-xs font-semibold" style={{ color: EMOTION_COLORS[track.dominantSentiment] || '#6fae9b' }}>
                                                        {track.dominantSentiment}
                                                    </div>
                                                    <div className="text-[10px] text-white/30">
                                                        {(track.moodScore * 100).toFixed(0)}%
                                                    </div>
                                                </div>
                                                <span className="text-white/20 text-xs shrink-0">
                                                    {expandedTrack === track.id ? '▲' : '▼'}
                                                </span>
                                            </button>
                                            {expandedTrack === track.id && (
                                                <div className="ml-14 mr-4 mb-3 p-3 rounded-xl space-y-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                    <div className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Vetor Emocional</div>
                                                    {Object.entries(track.emotionalVector)
                                                        .sort(([, a], [, b]) => b - a)
                                                        .map(([dim, val]) => (
                                                            <BarChart
                                                                key={dim}
                                                                label={dim}
                                                                value={val}
                                                                color={DIMENSION_COLORS[dim] || '#6b7280'}
                                                                showValue={val.toFixed(2)}
                                                            />
                                                        ))}
                                                    <div className="text-[10px] text-white/30 mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                                        <span className="text-white/50">Eixos:</span> pol={track.coreAxes.polaridade.toFixed(3)} | ativ={track.coreAxes.ativacao.toFixed(3)} | {track.coreAxes.quadrante}
                                                    </div>
                                                    {track.reasoning && (
                                                        <div className="text-[10px] text-white/30 italic mt-1">
                                                            {track.reasoning}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Raw JSON (collapsible) */}
                        <details className="glass-card">
                            <summary className="p-4 text-xs text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                                📋 JSON Bruto (debug)
                            </summary>
                            <pre className="p-4 pt-0 text-[11px] text-white/50 overflow-x-auto custom-scrollbar whitespace-pre-wrap break-all">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}
