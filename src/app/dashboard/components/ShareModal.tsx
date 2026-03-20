import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Instagram, Download, Sparkles, Music2 } from 'lucide-react';
import { MoodProfileResponse } from '../services/getMoodProfile';
import { UserResponseDto } from '@/shared/services/userService';
import { emotionStyles } from '@/shared/lib/moodHelpers';
import * as htmlToImage from 'html-to-image';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    mood: MoodProfileResponse;
    profile: UserResponseDto;
}

const sentimentDescriptionMap: Record<string, string> = {
    "tô voando": "Hoje sua playlist esta no maximo: energia alta, confianca la em cima e zero freio.",
    "na minha era": "Mood de protagonismo total. Tudo que toca vira trilha de main character.",
    "adrenalina pura": "Seu som veio acelerado, intenso e pronto para virar o volume no talo.",
    "caos controlado": "Mente criativa em modo turbo: tensao boa, foco forte e muita expressao.",
    "apaixonadx": "Clima doce e envolvente. Dia de trilha romatica e coracao quentinho.",
    "no calor do abraço": "Sua vibe pede conexao real: musicas de afeto, colo e proximidade.",
    "saudade boa": "Nostalgia leve, sorriso no canto e lembrancas que batem no tempo certo.",
    "na paz": "Dia de calma elegante: som limpo, respiracao funda e mente alinhada.",
    "zerado": "Estado zen ativado. Playlist serena para desacelerar sem perder a vibe.",
    "viajando": "Seu humor ta contemplativo: trilha para pensar longe e sentir fundo.",
    "pressentindo": "Tem suspense no ar. Sua trilha mistura tensao e expectativa.",
    "engolindo seco": "Sentimento travado no peito, com batidas que seguram a emocao.",
    "tô no limite": "Nervos a flor da pele. Seu som entrega intensidade e impulso.",
    "surtando": "Energia explosiva no topo. Dia de descarregar tudo na musica.",
    "chorando no banheiro": "Melancolia profunda, introspectiva e honesta. Dia de sentir sem filtro.",
    "apagado": "Vibe baixa e cansada. Playlist de acolhimento para recarregar.",
    "alma aberta": "Momento vulneravel e verdadeiro. Sensibilidade guiando suas escolhas.",
    "tô confuso": "Sentimentos misturados. Sua trilha alterna entre luz e sombra.",
    "travado": "Modo pausa emocional. Som minimalista para organizar o que esta por dentro.",
};

export function ShareModal({ isOpen, onClose, mood, profile }: ShareModalProps) {
    const posterRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const sentimentDisplay = mood.sentiment || "Minha Vibe";
    const sentimentKey = mood.sentiment?.toLowerCase() || "alma aberta";
    const badgeStyle = emotionStyles[sentimentKey] || emotionStyles["alma aberta"];
    const sentimentDescription = sentimentDescriptionMap[sentimentKey] ||
        "Seu som do dia mistura emocao e movimento. Compartilhe essa fase da sua trilha.";

    const bgMatch = badgeStyle.match(/bg-([^\s\/]+)/);
    const glowColorClass = bgMatch ? `bg-${bgMatch[1]}` : "bg-brand-primary";

    const generateImage = async (): Promise<string | null> => {
        if (!posterRef.current) return null;
        setIsGenerating(true);
        try {
            return await htmlToImage.toPng(posterRef.current, {
                quality: 1,
                pixelRatio: 2,
            });
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadImage = async () => {
        const dataUrl = await generateImage();
        if (!dataUrl) return;
        const link = document.createElement('a');
        link.download = `musicmood-${profile.display_name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
    };

    const shareToInstagram = async () => {
        const dataUrl = await generateImage();
        if (!dataUrl) return;

        // Converte dataUrl para Blob e tenta Web Share API (suportado em mobile)
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'musicmood.png', { type: 'image/png' });

        if (navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Minha Vibe no MusicMood',
                });
            } catch {
                // Usuário cancelou o share — baixa como fallback
                downloadImage();
            }
        } else {
            // Desktop: baixa a imagem para o usuário postar manualmente
            await downloadImage();
            alert('Imagem baixada! Abra o Instagram e poste como Story.');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
            <div className="fixed inset-0 min-h-full" onClick={onClose} />

            <div className="min-h-dvh w-full flex items-start sm:items-center justify-center p-3 sm:p-5 lg:p-8">
                <button
                    onClick={onClose}
                    className="fixed top-3.5 right-3.5 sm:top-4 sm:right-4 z-110 p-2.5 sm:p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_minmax(320px,1fr)] gap-4 lg:gap-6 items-start">
                    <div className="mx-auto w-full max-w-85 lg:max-w-90">
                        {/* THE POSTER (9:16) */}
                        <div
                            ref={posterRef}
                            className={`w-full aspect-9/16 rounded-4xl overflow-hidden relative flex flex-col p-4 sm:p-5 lg:p-6 shadow-2xl ${glowColorClass}/20 border border-white/20`}
                            style={{ background: 'linear-gradient(to bottom right, #050505, #121212)' }}
                        >
                            <div className={`absolute top-0 right-0 w-64 h-64 ${glowColorClass}/30 blur-[80px] rounded-full mix-blend-screen pointer-events-none`} />
                            <div className={`absolute bottom-0 left-0 w-64 h-64 ${glowColorClass}/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none`} />

                            <div className="flex justify-between items-start relative z-10 w-full mb-3 sm:mb-4 gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <img src={profile.img_profile} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 shadow-lg object-cover shrink-0" alt="Avatar" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-white/60 text-[8px] sm:text-[9px] uppercase tracking-widest font-black truncate">Trilha de hoje no MusicMood</span>
                                        <span className="text-white font-black italic tracking-tight text-sm sm:text-base truncate">{profile.display_name}</span>
                                    </div>
                                </div>
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 text-white shrink-0" />
                            </div>

                            <div className="flex-1 w-full relative rounded-3xl overflow-hidden my-2 shadow-2xl border border-white/10 group">
                                <img
                                    src={mood.url_gif}
                                    alt="Universe"
                                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[2s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

                                <div className="absolute bottom-3 sm:bottom-5 left-3 right-3 sm:left-5 sm:right-5">
                                    <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full bg-black/35 border border-white/20 backdrop-blur-sm max-w-full">
                                        <Music2 className="w-3 h-3 text-white/80 shrink-0" />
                                        <h3 className="text-white/70 font-black uppercase text-[8px] sm:text-[10px] tracking-[0.2em] truncate">
                                            Sentimento Sonoro
                                        </h3>
                                    </div>
                                    <h2 className="text-[28px] sm:text-4xl md:text-5xl font-black italic text-white uppercase leading-[0.95] drop-shadow-2xl font-sans tracking-tighter text-balance" style={{ textShadow: "0 0 40px rgba(0,0,0,0.8)" }}>
                                        {sentimentDisplay}
                                    </h2>
                                </div>
                            </div>

                            <div className="relative z-10 w-full mt-3 sm:mt-4 flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <div className="flex flex-col gap-1.5 w-full min-w-0">
                                    <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-[0.16em] font-bold">Descricao do sentimento do dia</span>
                                    <p className="text-[11px] sm:text-xs leading-relaxed text-white/80 line-clamp-4">
                                        {sentimentDescription}
                                    </p>
                                </div>

                                <div className="shrink-0 text-[11px] sm:text-[12px] font-black italic tracking-tighter text-white">
                                    MUSIC<span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">MOOD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:self-stretch flex flex-col gap-3 sm:gap-4">
                        <div className="glass-card border border-white/10 rounded-3xl p-4 sm:p-5">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                                Compartilhar no Instagram
                            </p>
                            <h4 className="text-lg sm:text-xl text-white font-800 leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                                Poster pronto para Story com o sentimento musical do dia.
                            </h4>
                            <p className="mt-2 text-sm text-white/65 leading-relaxed">
                                No celular, use o botao <span className="text-white/85 font-semibold">Story</span> para compartilhar direto.
                                No desktop, baixe a arte e publique no Instagram manualmente.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
                            <button
                                onClick={downloadImage}
                                disabled={isGenerating}
                                className="w-full bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] md:text-[11px] py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {isGenerating ? "Gerando..." : "Baixar Poster"}
                            </button>

                            <button
                                onClick={shareToInstagram}
                                disabled={isGenerating}
                                className="w-full bg-linear-to-tr from-pink-500 via-rose-500 to-orange-500 hover:opacity-90 active:scale-95 text-white font-black uppercase tracking-widest text-[10px] md:text-[11px] py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Instagram className="w-4 h-4" />
                                Story
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
