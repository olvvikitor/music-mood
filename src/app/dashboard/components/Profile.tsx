"use client"
import { type ChangeEvent, useState } from "react";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useProfile } from "../hooks/useProfile";
import { Camera, RotateCw, Share2 } from 'lucide-react';
import { useMoodProfile } from "../hooks/useMoodProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRefreshMoodStudios, getRefreshProfile, type RefreshMoodStudio } from "../services/getRefreshProfileService";
import NProgress from "nprogress";
import { ShareModal } from "./ShareModal";
import { StudioPickerModal } from "./StudioPickerModal";
import { updateFacePhotoService } from "@/shared/services/updateFacePhotoService";
import { getMoodDisplayName, getMoodProfile } from "@/shared/lib/moodHelpers";
import { getCreditBalance } from "@/shared/services/creditService";
import { CreditModal } from "@/shared/components/CreditModal";

export default function Profile() {
    const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const { data: mood, isLoading: moodLoading, isError: moodError } = useMoodProfile();
    const queryClient = useQueryClient();

    const [isShareOpen,    setIsShareOpen]    = useState(false);
    const [gifLoaded,      setGifLoaded]      = useState(false);
    const [gifFailed,      setGifFailed]      = useState(false);
    const [facePhotoError, setFacePhotoError] = useState("");
    const [isStudioOpen,   setIsStudioOpen]   = useState(false);
    const [selectedStudioId, setSelectedStudioId] = useState<string>("");
    const [isCreditOpen, setIsCreditOpen] = useState(false);
    const [noCredits, setNoCredits] = useState(false);

    const { data: creditData, refetch: refetchBalance } = useQuery({
        queryKey: ["creditBalance"],
        queryFn: getCreditBalance,
        staleTime: 30_000,
    });
    const balance = creditData?.balance ?? 0;

    // Studios disponíveis
    const { data: studios = [], isLoading: studiosLoading, isError: studiosError, refetch: refetchStudios } = useQuery({
        queryKey: ["refreshMoodStudios"],
        queryFn: getRefreshMoodStudios,
        enabled: false,
        staleTime: 1000 * 60 * 10,
    });

    const { mutate: refreshUser, isPending } = useMutation({
        mutationFn: (studioId?: string) => getRefreshProfile(studioId),
        onMutate: () => NProgress.start(),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['moodProfile'] });
            await refetchBalance();
        },
        onSettled: () => {
            NProgress.done();
            setIsStudioOpen(false);
        },
    });

    const { mutateAsync: updateFacePhoto, isPending: isUpdatingFacePhoto } = useMutation({
        mutationFn: updateFacePhotoService,
        onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['userProfile'] }); },
    });

    if (profileLoading || moodLoading) return <LoadingComponent type="profile" />;
    if (moodError || profileError || !mood || !profile) return (
        <ErrorComponent type="profile" retry={() => refreshUser(undefined)} />
    );

    const sentimentDisplay = getMoodDisplayName(mood?.sentiment, "—");
    const accent = getMoodProfile(mood?.sentiment).accent;
    const moodScore = Math.round((mood?.moodScore ?? 0) * 100);

    const handleFacePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        event.target.value = "";
        if (!selectedFile) return;
        if (!/^image\/(jpeg|png|webp)$/.test(selectedFile.type)) { setFacePhotoError("Envie apenas JPEG, PNG ou WEBP."); return; }
        if (selectedFile.size > 5 * 1024 * 1024) { setFacePhotoError("A imagem deve ter no máximo 5MB."); return; }
        setFacePhotoError("");
        try { await updateFacePhoto(selectedFile); }
        catch { setFacePhotoError("Não foi possível atualizar a foto agora."); }
    };

    const openStudio = () => {
        setIsStudioOpen(true);
        void refetchStudios().then(result => {
            const list = result.data ?? [];
            if (!selectedStudioId && list.length > 0) setSelectedStudioId(list[0].id);
        });
    };

    const handleRefreshClick = () => {
        if (balance <= 0) {
            setNoCredits(true);
            setIsCreditOpen(true);
            return;
        }

        setNoCredits(false);
        openStudio();
    };

    return (
        <>
            <div className="glass-card glass-card-hover h-full flex flex-col overflow-hidden relative" style={{ minHeight: 430 }}>

                {/* ── Imagem do mood ── */}
                <div className="flex-1 mx-3 my-3 rounded-2xl overflow-hidden relative" style={{ background: "#05050a", minHeight: 390 }}>
                    {!gifFailed ? (
                        <>
                            <img
                                src={mood.image_mood}
                                alt="Mood"
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${gifLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                                style={{ objectPosition: "top center" }}
                                onLoad={() => setGifLoaded(true)}
                                onError={() => { setGifFailed(true); setGifLoaded(false); }}
                            />
                            {!gifLoaded && (
                                <div className="absolute inset-0 animate-pulse"
                                    style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01), rgba(255,255,255,0.05))" }} />
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "radial-gradient(circle at 20% 20%, rgba(111,174,155,0.24), transparent 55%), radial-gradient(circle at 80% 80%, rgba(176,106,133,0.22), transparent 60%), #0b0b11" }}>
                            <p className="text-xs uppercase tracking-[0.18em] text-white/70"
                                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                {sentimentDisplay}
                            </p>
                        </div>
                    )}

                    <div className="absolute inset-0"
                        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 38%, transparent 52%, rgba(0,0,0,.88) 100%)" }} />
                    <div className="absolute inset-0"
                        style={{ background: `radial-gradient(ellipse 60% 40% at 80% 15%, ${accent}33 0%, transparent 60%)` }} />
                    <div className="absolute inset-0 opacity-[0.10] mix-blend-soft-light mood-noise" />

                    {/* Topo do card */}
                    <div className="relative z-10 flex items-center gap-2.5 px-5 pt-5">
                        <img src={profile.img_profile} alt="Avatar"
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                            style={{ border: "1.5px solid rgba(255,255,255,.25)" }} />
                        <span className="flex-1 text-[11px] uppercase tracking-[.12em] truncate"
                            style={{ color: "rgba(255,255,255,.6)" }}>
                            {profile.display_name}
                        </span>
                        <span className="text-[11px] uppercase tracking-[.18em]"
                            style={{ color: "rgba(255,255,255,.28)" }}>
                            MusicMood
                        </span>
                    </div>

                    {/* Rodapé do card */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-6">
                        <p className="text-[9px] uppercase tracking-[.22em] mb-2"
                            style={{ color: "rgba(255,255,255,.38)" }}>
                            se sentindo 
                        </p>
                        <p className="font-black italic leading-[1.06] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ fontSize: "clamp(24px, 6.4vw, 34px)", color: "#fff", textShadow: "0 2px 24px rgba(0,0,0,.8)" }}>
                            {sentimentDisplay}
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-2 rounded-full px-3 py-1"
                                style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)" }}>
                                <span className="text-[12px] font-bold text-white">{moodScore}%</span>
                                <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,.4)" }}>score</span>
                            </div>
                            <div className="flex items-end gap-0.75" style={{ height: 16 }}>
                                {[38, 80, 100, 62, 88].map((h, i) => (
                                    <div key={i} style={{ width: 3, height: `${h}%`, borderRadius: "2px 2px 0 0", background: accent, opacity: 0.8 }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Barra de ações ── */}
                <div className="px-4 pb-3 flex items-center gap-2 relative z-10">

                    {/* Câmera */}
                    <label
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                        style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)", opacity: isUpdatingFacePhoto ? 0.7 : 1 }}
                        title="Atualizar foto do rosto">
                        <Camera className={`w-4.5 h-4.5 text-white/65 ${isUpdatingFacePhoto ? 'animate-pulse' : ''}`} />
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                            disabled={isUpdatingFacePhoto}
                            onChange={event => { void handleFacePhotoChange(event); }} />
                    </label>

                    {/* Compartilhar */}
                    <button onClick={() => setIsShareOpen(true)}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                        style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}
                        title="Compartilhar">
                        <Share2 className="w-4.5 h-4.5 text-white/65" />
                    </button>

                    {/* Gerar imagem */}
                    <button
                        onClick={handleRefreshClick}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ml-auto"
                        style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}
                        title="Gerar nova imagem">
                        <RotateCw className={`w-4.5 h-4.5 text-white/65 ${isPending ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {facePhotoError && (
                    <div className="px-4 pb-3 -mt-1"><p className="text-[10px] text-rose-300">{facePhotoError}</p></div>
                )}
            </div>

            {/* ── Modais ── */}
            {profile && mood && (
                <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} mood={mood} profile={profile} />
            )}

            {isStudioOpen && (
                <StudioPickerModal
                    studios={studios}
                    loading={studiosLoading}
                    error={studiosError}
                    selectedId={selectedStudioId}
                    onSelect={s => setSelectedStudioId(s.id)}
                    onConfirm={() => refreshUser(selectedStudioId || undefined)}
                    onClose={() => !isPending && setIsStudioOpen(false)}
                    isPending={isPending}
                />
            )}

            {isCreditOpen && (
                <CreditModal
                    noCredits={noCredits}
                    onClose={() => setIsCreditOpen(false)}
                    onPurchased={() => void refetchBalance()}
                />
            )}

            <style jsx>{`
                .mood-noise {
                    background-image: radial-gradient(rgba(255,255,255,0.38) 0.6px, transparent 0.6px);
                    background-size: 3px 3px;
                }
            `}</style>
        </>
    );
}
