"use client"
import { useState, useRef } from "react";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useProfile } from "../hooks/useProfile";
import { RotateCw, Sparkles } from 'lucide-react';
import { useMoodProfile } from "../hooks/useMoodProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRefreshProfile } from "../services/getRefreshProfileService";
import NProgress from "nprogress";
import { EmotionalChart } from "@/shared/components/EmotionalCharts";


export default function Profile() {
    const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const { data: mood, isLoading: moodLoading, isError: moodError } = useMoodProfile();
    const queryCliente = useQueryClient();
    const [slide, setSlide] = useState(0);
    const totalSlides = 2;

    // Touch swipe
    const touchStartX = useRef<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            setSlide(prev => diff > 0
                ? Math.min(prev + 1, totalSlides - 1)
                : Math.max(prev - 1, 0)
            );
        }
        touchStartX.current = null;
    };

    // Arrow keys
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight") setSlide(prev => Math.min(prev + 1, totalSlides - 1));
        if (e.key === "ArrowLeft")  setSlide(prev => Math.max(prev - 1, 0));
    }; // 0 = GIF, 1 = gráfico

    const { mutate: refreshUser, isPending } = useMutation({
        mutationFn: getRefreshProfile,
        onMutate: () => { NProgress.start(); },
        onSuccess: async () => {
            await queryCliente.invalidateQueries({ queryKey: ['moodProfile'] });
        },
        onSettled: () => { NProgress.done(); }
    });

    if (profileLoading || moodLoading) return <LoadingComponent type="profile" />;
    if (moodError || profileError || !mood || !profile) return <ErrorComponent type="profile" />;

    return (
        <div className="glass-card p-6 md:p-7 flex flex-col gap-6 relative overflow-hidden group h-fit shadow-2xl">

            {/* Brilho de fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full -mr-16 -mt-16" />

            {/* HEADER */}
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-emerald-500/20 p-0.5">
                        <img src={profile.img_profile} className="w-full h-full rounded-full object-cover" alt="Avatar" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xs font-bold text-white/90 truncate max-w-30">{profile.display_name}</h2>
                        <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Premium</p>
                    </div>
                </div>

                <button
                    onClick={() => refreshUser()}
                    className="p-2 rounded-lg border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all active:scale-95"
                >
                    <RotateCw className={`w-3.5 h-3.5 text-emerald-500 ${isPending ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* MOOD ATUAL */}
            <div className="flex flex-col items-center gap-1 text-center relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500">Mood Atual</p>
                </div>
                <span className="text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-emerald-400 transition-colors duration-500">
                    {mood.sentiment}
                </span>
            </div>

            {/* CARROSSEL */}
            <div
                className="relative z-10 flex flex-col items-center gap-3 outline-none"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >

                {/* Slides */}
                <div className="relative w-full overflow-hidden h-80">
                    <div
                        className="flex h-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${slide * 100}%)` }}
                    >
                        {/* Slide 0 — GIF */}
                        <div className="w-full h-full shrink-0 flex justify-center items-center">
                            <div className="relative group/gif">
                                <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-75 group-hover/gif:scale-95 transition-transform duration-700 opacity-50" />
                                <div className="w-44 h-44 rounded-4xl overflow-hidden relative border border-white/10 shadow-xl transform transition-transform duration-500 group-hover/gif:-rotate-1">
                                    <img src={mood.url_gif} className="w-full h-full object-cover" alt="GIF de Humor" />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Slide 1 — Gráfico 2D */}
                        <div className="w-full h-full shrink-0 px-2 overflow-y-auto">
                            <EmotionalChart coreAxes={mood.coreAxes} />
                        </div>
                    </div>
                </div>

                {/* Indicadores / navegação */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSlide(0)}
                        className={`transition-all duration-300 rounded-full ${
                            slide === 0
                                ? "w-5 h-1.5 bg-emerald-400"
                                : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                    />
                    <button
                        onClick={() => setSlide(1)}
                        className={`transition-all duration-300 rounded-full ${
                            slide === 1
                                ? "w-5 h-1.5 bg-emerald-400"
                                : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                    />
                </div>
            </div>

            {/* FOOTER */}
            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-slate-500">
                <span>Sincronizado</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
        </div>
    );
}