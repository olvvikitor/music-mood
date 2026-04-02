"use client"
import { type ChangeEvent, useRef, useState } from "react";
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
import { DailyMoodProgressCard } from "./DailyMoodProgressCard";
import { MoodPrincipalCard } from "./MoodPrincipalCard";

export default function Profile() {
    const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const { data: mood, isLoading: moodLoading, isError: moodError } = useMoodProfile();
    const queryClient = useQueryClient();

    const [isShareOpen,    setIsShareOpen]    = useState(false);
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

    const now = new Date();
    const isMoodUnlocked = now.getHours() >= 19;
    const [activeSlide, setActiveSlide] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

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
        if (!isMoodUnlocked) {
            return;
        }

        if (balance <= 0) {
            setNoCredits(true);
            setIsCreditOpen(true);
            return;
        }

        setNoCredits(false);
        openStudio();
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null || touchStartY.current === null) {
            return;
        }

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX.current;
        const deltaY = touch.clientY - touchStartY.current;

        touchStartX.current = null;
        touchStartY.current = null;

        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        const passedThreshold = Math.abs(deltaX) > 40;
        if (!isHorizontalSwipe || !passedThreshold) {
            return;
        }

        if (deltaX < 0) {
            setActiveSlide(prev => Math.min(prev + 1, 1));
            return;
        }

        setActiveSlide(prev => Math.max(prev - 1, 0));
    };

    const lastMoodCard = (
        <div className="glass-card glass-card-hover h-full flex flex-col overflow-hidden relative" style={{ minHeight: 520 }}>
                <MoodPrincipalCard
                    moodImage={mood.image_mood}
                    sentimentDisplay={sentimentDisplay}
                    accent={accent}
                    moodScore={moodScore}
                    profileImage={profile.img_profile}
                    displayName={profile.display_name}
                    topRightText="MusicMood"
                    minHeight={470}
                />

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
                        style={{
                            background: "var(--surface-card-alt)",
                            border: "1px solid var(--border-medium)",
                            opacity: isMoodUnlocked ? 1 : 0.45,
                            cursor: isMoodUnlocked ? "pointer" : "not-allowed",
                        }}
                        title={isMoodUnlocked ? "Gerar nova imagem" : "Atualizacao disponivel as 19h"}
                        disabled={!isMoodUnlocked}>
                        <RotateCw className={`w-4.5 h-4.5 text-white/65 ${isPending ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {facePhotoError && (
                    <div className="px-4 pb-3 -mt-1"><p className="text-[10px] text-rose-300">{facePhotoError}</p></div>
                )}
        </div>
    );

    return (
        <>
            <div className="relative w-full">
                <div
                    className="p-1 rounded-xl mb-3 grid grid-cols-2 gap-1"
                    style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-subtle)" }}
                >
                    <button
                        onClick={() => setActiveSlide(0)}
                        className="px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all"
                        style={{
                            background: activeSlide === 0 ? "var(--surface-card)" : "transparent",
                            color: activeSlide === 0 ? "var(--text-primary)" : "var(--text-muted)",
                            border: activeSlide === 0 ? "1px solid var(--border-medium)" : "1px solid transparent",
                        }}
                    >
                        Ultimo humor
                    </button>

                    <button
                        onClick={() => setActiveSlide(1)}
                        className="px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all"
                        style={{
                            background: activeSlide === 1 ? "var(--surface-card)" : "transparent",
                            color: activeSlide === 1 ? "var(--text-primary)" : "var(--text-muted)",
                            border: activeSlide === 1 ? "1px solid var(--border-medium)" : "1px solid transparent",
                        }}
                    >
                        Em construcao
                    </button>
                </div>

                <div
                    className="overflow-hidden rounded-3xl w-full"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    style={{ touchAction: "pan-y" }}
                >
                    <div
                        className="flex w-full transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                    >
                        <div className="w-full shrink-0">{lastMoodCard}</div>
                        <div className="w-full shrink-0"><DailyMoodProgressCard /></div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-3">
                    {[0, 1].map(index => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            aria-label={index === 0 ? "Mostrar ultimo humor" : "Mostrar card em construcao"}
                            className="h-2.5 rounded-full transition-all"
                            style={{
                                width: activeSlide === index ? 22 : 10,
                                background: activeSlide === index ? "#00c4a0" : "var(--border-medium)",
                            }}
                        />
                    ))}
                </div>
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
        </>
    );
}
