"use client";
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, Check, Play } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { MoodProfileResponse } from "../services/getMoodProfile";
import { UserResponseDto } from "@/shared/services/userService";
import { getMoodDisplayName, getMoodProfile } from "@/shared/lib/moodHelpers";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    mood: MoodProfileResponse;
    profile: UserResponseDto;
}

// ---------------------------------------------------------------------------
// Deteccao de plataforma
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
        dot: "#6fae9b",
        text: "iOS Safari - Story abre o compartilhamento nativo (escolha Instagram).",
    },
    "ios-other": {
        dot: "#6fae9b",
        text: "iOS (Chrome/Outros) - Story tenta compartilhamento nativo; se falhar, baixa a imagem.",
    },
    android: {
        dot: "#6fae9b",
        text: "Android - Story tenta compartilhamento nativo; se falhar, baixa a imagem.",
    },
    desktop: {
        dot: "#4488ff",
        text: "Desktop - Baixe o poster e publique no Instagram manualmente.",
    },
};

// ---------------------------------------------------------------------------
// htmlToImage com retry (CORS do Giphy pode falhar na 1a passagem)
// ---------------------------------------------------------------------------
async function generatePosterImage(
    el: HTMLDivElement,
    format: "png" | "jpeg" = "png",
): Promise<string | null> {
    const commonOptions = {
        fetchRequestInit: { cache: "no-cache" as RequestCache },
    };

    try {
        if (format === "jpeg") {
            return await htmlToImage.toJpeg(el, {
                ...commonOptions,
                quality: 0.9,
                pixelRatio: 1.5,
            });
        }

        return await htmlToImage.toPng(el, {
            ...commonOptions,
            quality: 1,
            pixelRatio: 2,
        });
    } catch {
        try {
            if (format === "jpeg") {
                return await htmlToImage.toJpeg(el, {
                    ...commonOptions,
                    quality: 0.86,
                    pixelRatio: 1.25,
                });
            }

            return await htmlToImage.toPng(el, {
                ...commonOptions,
                quality: 1,
                pixelRatio: 1.6,
            });
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
    const posterRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [dlState, setDlState] = useState<BtnState>("idle");
    const [storyState, setStoryState] = useState<BtnState>("idle");

    const platform = detectPlatform();
    const hint = platformHint[platform];

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        if (!isOpen) { setDlState("idle"); setStoryState("idle"); }
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const moodProfile = getMoodProfile(mood.sentiment);
    const description = moodProfile.description;
    const accent = moodProfile.accent;
    const score = Math.round((mood.moodScore ?? 0) * 100);
    const moodWords = getMoodDisplayName(mood.sentiment, "-").split(" ");
    const isBusy = dlState === "loading" || storyState === "loading";

    async function buildImage(format: "png" | "jpeg" = "png"): Promise<string | null> {
        if (!posterRef.current) return null;
        return generatePosterImage(posterRef.current, format);
    }

    function triggerDownload(dataUrl: string) {
        const a = document.createElement("a");
        a.download = `musicmood-${profile.display_name.toLowerCase().replace(/\s+/g, "-")}.png`;
        a.href = dataUrl;
        a.click();
    }

    async function handleDownload() {
        setDlState("loading");
        const dataUrl = await buildImage("png");
        if (!dataUrl) { setDlState("error"); return; }
        triggerDownload(dataUrl);
        setDlState("success");
        setTimeout(() => setDlState("idle"), 2500);
    }

    async function handleStory() {
        setStoryState("loading");
        const dataUrl = await buildImage("jpeg");
        if (!dataUrl) { setStoryState("error"); return; }

        if (platform !== "desktop" && typeof navigator !== "undefined" && typeof navigator.share === "function") {
            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], "musicmood.jpg", { type: blob.type || "image/jpeg" });

                const hasCanShare = typeof navigator.canShare === "function";
                const canShareFile = hasCanShare ? navigator.canShare({ files: [file] }) : true;

                if (canShareFile) {
                    await navigator.share({
                        files: [file],
                        title: "Minha Vibe no MusicMood",
                        text: "Compartilhando minha vibe do dia",
                    });
                    setStoryState("success");
                    setTimeout(() => setStoryState("idle"), 2500);
                    return;
                }

                // Alguns browsers falham no canShare/files; tenta abrir share sheet sem arquivo.
                await navigator.share({
                    title: "Minha Vibe no MusicMood",
                    text: "Compartilhando minha vibe do dia",
                });
                setStoryState("success");
                setTimeout(() => setStoryState("idle"), 2500);
                return;
            } catch (error) {
                // Cancelamento manual do share sheet
                if (error instanceof DOMException && error.name === "AbortError") {
                    setStoryState("idle");
                    return;
                }
            }
        }

        // Android / iOS Chrome / Desktop -> download direto
        triggerDownload(dataUrl);
        setStoryState("success");
        setTimeout(() => setStoryState("idle"), 2500);
    }

    // Helpers de label/icone por estado
    const dlLabel = dlState === "loading" ? "Gerando..." : dlState === "success" ? "Baixado!" : "Baixar";
    const storyLabel = storyState === "loading" ? "Gerando..." : storyState === "success" ? "Pronto!" : "Story";

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-center sm:items-center justify-center bg-black/80 backdrop-blur-xl overflow-y-auto"
              onClick={onClose}

        >
            <div
                className="relative w-full max-w-sm mx-auto rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
                style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fechar */}


                {/* POSTER capturado pelo htmlToImage */}
                <div
                    ref={posterRef}
                    className="w-full relative overflow-hidden flex flex-col"
                    style={{ aspectRatio: "9/16", maxHeight: 360, background: "#05050a" }}
                >
                    {/* GIF */}
                    <img
                        src={mood.image_mood}
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
                        <button
                            onClick={onClose}

                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                            <X className="w-4 h-4 text-white/60" />
                        </button>
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
                                    className="text-[10px] uppercase tracking-widest"
                                    style={{ color: "rgba(255,255,255,.4)" }}
                                >
                                    score
                                </span>
                            </div>

                            {/* Equalizer estatico (htmlToImage nao anima) */}
                            <div className="flex items-end gap-0.75" style={{ height: 16 }}>
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

                {/* ACTIONS */}
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
                            className="shrink-0 w-2 h-2 rounded-full mt-1.25"
                            style={{ background: hint.dot }}
                        />
                        <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,.5)" }}>
                            {hint.text}
                        </p>
                    </div>

                    {/* Botoes */}
                    <div className="grid grid-cols-2 gap-3">

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            disabled={isBusy}
                            className="h-12 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                            style={{
                                background: dlState === "success" ? "rgba(111,174,155,.12)" : "rgba(255,255,255,.08)",
                                border: `1px solid ${dlState === "success" ? "rgba(111,174,155,.3)" : "rgba(255,255,255,.12)"}`,
                                color: dlState === "success" ? "#6fae9b" : "rgba(255,255,255,.8)",
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
                            className="h-12 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60"
                            style={{
                                background: storyState === "success"
                                    ? "rgba(111,174,155,.12)"
                                    : "linear-gradient(135deg, #f72585, #ff6b35)",
                                border: storyState === "success" ? "1px solid rgba(111,174,155,.3)" : "none",
                                color: storyState === "success" ? "#6fae9b" : "#fff",
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

                    {/* Descricao do mood */}
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
