"use client";
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, Check, Play } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { MoodProfileResponse } from "../services/getMoodProfile";
import { UserResponseDto } from "@/shared/services/userService";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    mood: MoodProfileResponse;
    profile: UserResponseDto;
}

// ---------------------------------------------------------------------------
// Descrições por sentiment
// ---------------------------------------------------------------------------
const sentimentDescriptionMap: Record<string, string> = {
    "pilhado":               "Energia no talo. Sua playlist veio acelerada, confiante e sem freio.",
    "ta numa marra ein?":    "Mood de protagonismo total. Tudo que toca vira trilha de main character.",
    "adrenalina pura":       "Som intenso, rápido e pronto para virar o volume no talo.",
    "caos controlado":       "Mente criativa em modo turbo: tensão boa, foco forte e muita expressão.",
    "apaixonadx":            "Clima doce e envolvente. Dia de trilha romântica e coração quentinho.",
    "love love":             "Sua vibe pede conexão real: músicas de afeto, colo e proximidade.",
    "saudade boa":           "Nostalgia leve, sorriso no canto e lembranças que batem no tempo certo.",
    "de boa":                "Dia de calma elegante: som limpo, respiração funda e mente alinhada.",
    "zerado":                "Estado zen ativado. Playlist serena para desacelerar sem perder a vibe.",
    "viajando":              "Seu humor tá contemplativo: trilha para pensar longe e sentir fundo.",
    "pressentindo":          "Tem suspense no ar. Sua trilha mistura tensão e expectativa.",
    "de cara":               "Sentimento travado no peito, com batidas que seguram a emoção.",
    "p da vida":             "Nervos à flor da pele. Seu som entrega intensidade e impulso.",
    "surtando":              "Energia explosiva no topo. Dia de descarregar tudo na música.",
    "chorando no banheiro":  "Melancolia profunda, introspectiva e honesta. Dia de sentir sem filtro.",
    "quebrado":              "Vibe baixa e cansada. Playlist de acolhimento para recarregar.",
    "delulu":                "Momento vulnerável e verdadeiro. Sensibilidade guiando suas escolhas.",
    "tô confuso":            "Sentimentos misturados. Sua trilha alterna entre luz e sombra.",
    "travado":               "Modo pausa emocional. Som minimalista para organizar o que está por dentro.",
};

// ---------------------------------------------------------------------------
// Paleta de acento por sentiment
// ---------------------------------------------------------------------------
const moodAccent: Record<string, string> = {
    "pilhado":              "#ffaa00",
    "ta numa marra ein?":   "#a259ff",
    "adrenalina pura":      "#ff3c00",
    "caos controlado":      "#00b4ff",
    "apaixonadx":           "#ff6b9d",
    "love love":            "#ff80c0",
    "saudade boa":          "#7b9fff",
    "de boa":               "#00ffb3",
    "zerado":               "#00e5a0",
    "viajando":             "#8ab4ff",
    "pressentindo":         "#ffcc44",
    "de cara":              "#ff6060",
    "p da vida":            "#ff4500",
    "surtando":             "#ff00cc",
    "chorando no banheiro": "#4080ff",
    "quebrado":             "#888888",
    "delulu":               "#d580ff",
    "tô confuso":           "#aaaaaa",
    "travado":              "#666666",
};

// ---------------------------------------------------------------------------
// Detecção de plataforma
// ---------------------------------------------------------------------------
type Platform = "ios-safari" | "ios-other" | "android" | "desktop";

function detectPlatform(): Platform {
    if (typeof navigator === "undefined") return "desktop";
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
    const isAndroid = /android/i.test(ua);
    if (isIOS && isSafari) return "ios-safari";
    if (isIOS) return "ios-other";
    if (isAndroid) return "android";
    return "desktop";
}

const platformHint: Record<Platform, { dot: string; text: string }> = {
    "ios-safari": {
        dot: "#00ffb3",
        text: "iOS Safari — Story abre direto no share sheet nativo.",
    },
    "ios-other": {
        dot: "#ffaa00",
        text: "iOS Chrome — Story baixa a imagem. Abra o Instagram e poste como Story.",
    },
    android: {
        dot: "#ffaa00",
        text: "Android — Story baixa a imagem. Poste no Instagram em seguida.",
    },
    desktop: {
        dot: "#4488ff",
        text: "Desktop — Baixe o poster e publique no Instagram manualmente.",
    },
};

// ---------------------------------------------------------------------------
// htmlToImage com retry (CORS do Giphy pode falhar na 1ª passagem)
// ---------------------------------------------------------------------------
async function generatePosterPng(el: HTMLDivElement): Promise<string | null> {
    const options: Parameters<typeof htmlToImage.toPng>[1] = {
        quality: 1,
        pixelRatio: 2,
        fetchRequestInit: { cache: "no-cache" },
    };
    try {
        return await htmlToImage.toPng(el, options);
    } catch {
        try {
            return await htmlToImage.toPng(el, options);
        } catch (err) {
            console.error("[ShareModal] htmlToImage falhou:", err);
            return null;
        }
    }
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
type BtnState = "idle" | "loading" | "success" | "error";

export function ShareModal({ isOpen, onClose, mood, profile }: ShareModalProps) {
    const posterRef                     = useRef<HTMLDivElement>(null);
    const [mounted, setMounted]         = useState(false);
    const [dlState, setDlState]         = useState<BtnState>("idle");
    const [storyState, setStoryState]   = useState<BtnState>("idle");

    const platform  = detectPlatform();
    const hint      = platformHint[platform];

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        if (!isOpen) { setDlState("idle"); setStoryState("idle"); }
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const sentimentKey  = mood.sentiment?.toLowerCase() ?? "de boa";
    const description   = sentimentDescriptionMap[sentimentKey]
        ?? "Sua vibe do dia em forma de trilha sonora.";
    const accent        = moodAccent[sentimentKey] ?? "#a259ff";
    const score         = Math.round((mood.moodScore ?? 0) * 100);
    const moodWords     = (mood.sentiment ?? "—").split(" ");
    const isBusy        = dlState === "loading" || storyState === "loading";

    async function buildImage(): Promise<string | null> {
        if (!posterRef.current) return null;
        return generatePosterPng(posterRef.current);
    }

    function triggerDownload(dataUrl: string) {
        const a = document.createElement("a");
        a.download = `musicmood-${profile.display_name.toLowerCase().replace(/\s+/g, "-")}.png`;
        a.href = dataUrl;
        a.click();
    }

    async function handleDownload() {
        setDlState("loading");
        const dataUrl = await buildImage();
        if (!dataUrl) { setDlState("error"); return; }
        triggerDownload(dataUrl);
        setDlState("success");
        setTimeout(() => setDlState("idle"), 2500);
    }

    async function handleStory() {
        setStoryState("loading");
        const dataUrl = await buildImage();
        if (!dataUrl) { setStoryState("error"); return; }

        if (platform === "ios-safari" && navigator.canShare) {
            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], "musicmood.png", { type: "image/png" });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: "Minha Vibe no MusicMood" });
                    setStoryState("success");
                    setTimeout(() => setStoryState("idle"), 2500);
                    return;
                }
            } catch {
                // Usuário cancelou
                setStoryState("idle");
                return;
            }
        }

        // Android / iOS Chrome / Desktop → download direto
        triggerDownload(dataUrl);
        setStoryState("success");
        setTimeout(() => setStoryState("idle"), 2500);
    }

    // Helpers de label/ícone por estado
    const dlLabel       = dlState === "loading" ? "Gerando..." : dlState === "success" ? "Baixado!" : "Baixar";
    const storyLabel    = storyState === "loading" ? "Gerando..." : storyState === "success" ? "Pronto!" : "Story";

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center sm:items-center justify-center bg-black/80 backdrop-blur-xl overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm mx-auto rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
                style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                >
                    <X className="w-4 h-4 text-white/60" />
                </button>

                {/* ── POSTER capturado pelo htmlToImage ── */}
                <div
                    ref={posterRef}
                    className="w-full relative overflow-hidden flex flex-col"
                    style={{ aspectRatio: "9/16", maxHeight: 360, background: "#05050a" }}
                >
                    {/* GIF */}
                    <img
                        src={mood.url_gif}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: 0.75 }}
                        crossOrigin="anonymous"
                    />

                    {/* Overlay escuro */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 38%, transparent 52%, rgba(0,0,0,.88) 100%)",
                        }}
                    />

                    {/* Glow de acento por mood */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse 60% 40% at 80% 15%, ${accent}33 0%, transparent 60%)`,
                        }}
                    />

                    {/* Topo */}
                    <div className="relative z-10 flex items-center gap-2 px-5 pt-5">
                        <img
                            src={profile.img_profile}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                            style={{ border: "1.5px solid rgba(255,255,255,.25)" }}
                            crossOrigin="anonymous"
                        />
                        <span
                            className="flex-1 text-[11px] uppercase tracking-[.12em] truncate"
                            style={{ color: "rgba(255,255,255,.6)" }}
                        >
                            {profile.display_name}
                        </span>
                        <span
                            className="text-[10px] uppercase tracking-[.18em]"
                            style={{ color: "rgba(255,255,255,.28)" }}
                        >
                            MusicMood
                        </span>
                    </div>

                    {/* Base */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5">
                        <p
                            className="text-[9px] uppercase tracking-[.22em] mb-2"
                            style={{ color: "rgba(255,255,255,.38)" }}
                        >
                            vibe atual
                        </p>

                        <p
                            className="font-black italic leading-[.92] tracking-tight"
                            style={{
                                fontSize: "clamp(32px, 9vw, 44px)",
                                color: "#fff",
                                textShadow: "0 2px 24px rgba(0,0,0,.8)",
                            }}
                        >
                            {moodWords.map((w, i) => (
                                <span key={i} style={{ display: "block" }}>{w}</span>
                            ))}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                            <div
                                className="flex items-center gap-2 rounded-full px-3 py-1"
                                style={{
                                    background: "rgba(255,255,255,.1)",
                                    border: "1px solid rgba(255,255,255,.15)",
                                }}
                            >
                                <span className="text-[12px] font-bold text-white">{score}%</span>
                                <span
                                    className="text-[10px] uppercase tracking-[.1em]"
                                    style={{ color: "rgba(255,255,255,.4)" }}
                                >
                                    score
                                </span>
                            </div>

                            {/* Equalizer estático (htmlToImage não anima) */}
                            <div className="flex items-end gap-[3px]" style={{ height: 16 }}>
                                {[38, 80, 100, 62, 88].map((h, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: 3,
                                            height: `${h}%`,
                                            borderRadius: "2px 2px 0 0",
                                            background: accent,
                                            opacity: 0.8,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ACTIONS ── */}
                <div className="flex flex-col gap-3 px-5 py-5">

                    {/* Platform hint */}
                    <div
                        className="flex items-start gap-3 rounded-2xl px-4 py-3"
                        style={{
                            background: "rgba(255,255,255,.04)",
                            border: "1px solid rgba(255,255,255,.08)",
                        }}
                    >
                        <div
                            className="shrink-0 w-2 h-2 rounded-full mt-[5px]"
                            style={{ background: hint.dot }}
                        />
                        <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,.5)" }}>
                            {hint.text}
                        </p>
                    </div>

                    {/* Botões */}
                    <div className="grid grid-cols-2 gap-3">

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            disabled={isBusy}
                            className="h-12 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[.1em] transition-all active:scale-95 disabled:opacity-50"
                            style={{
                                background: dlState === "success" ? "rgba(0,255,179,.12)" : "rgba(255,255,255,.08)",
                                border: `1px solid ${dlState === "success" ? "rgba(0,255,179,.3)" : "rgba(255,255,255,.12)"}`,
                                color: dlState === "success" ? "#00ffb3" : "rgba(255,255,255,.8)",
                            }}
                        >
                            {dlState === "loading"
                                ? <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }} />
                                : dlState === "success"
                                    ? <Check className="w-4 h-4" />
                                    : <Download className="w-4 h-4" />
                            }
                            {dlLabel}
                        </button>

                        {/* Story */}
                        <button
                            onClick={handleStory}
                            disabled={isBusy}
                            className="h-12 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[.1em] transition-all active:scale-95 disabled:opacity-60"
                            style={{
                                background: storyState === "success"
                                    ? "rgba(0,255,179,.12)"
                                    : "linear-gradient(135deg, #f72585, #ff6b35)",
                                border: storyState === "success" ? "1px solid rgba(0,255,179,.3)" : "none",
                                color: storyState === "success" ? "#00ffb3" : "#fff",
                                boxShadow: storyState !== "success" ? "0 4px 20px rgba(247,37,133,.35)" : "none",
                            }}
                        >
                            {storyState === "loading"
                                ? <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }} />
                                : storyState === "success"
                                    ? <Check className="w-4 h-4" />
                                    : <Play className="w-4 h-4 fill-white" />
                            }
                            {storyLabel}
                        </button>
                    </div>

                    {/* Descrição do mood */}
                    <p
                        className="text-[11px] leading-relaxed text-center px-1"
                        style={{ color: "rgba(255,255,255,.28)" }}
                    >
                        {description}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}