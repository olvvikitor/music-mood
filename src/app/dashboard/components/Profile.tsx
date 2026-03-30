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
import { updateFacePhotoService } from "@/shared/services/updateFacePhotoService";
import { getMoodDisplayName } from "@/shared/lib/moodHelpers";

const moodAccent: Record<string, string> = {
    "pilhado": "#ffaa00",
    "ta numa marra ein?": "#8a7bb8",
    "adrenalina pura": "#ff3c00",
    "caos controlado": "#00b4ff",
    "apaixonadx": "#ff6b9d",
    "love love": "#ff80c0",
    "saudade boa": "#7b9fff",
    "de boa": "#6fae9b",
    "zerado": "#00e5a0",
    "viajando": "#8ab4ff",
    "pressentindo": "#ffcc44",
    "de cara": "#ff6060",
    "p da vida": "#ff4500",
    "surtando": "#ff00cc",
    "chorando no banheiro": "#4080ff",
    "quebrado": "#888888",
    "Deixa pra lá": "#d580ff",
    "to confuso": "#aaaaaa",
    "travado": "#666666",
};

function normalizeMoodAccentKey(value?: string): string {
    if (!value) return "";
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export default function Profile() {
    const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const { data: mood, isLoading: moodLoading, isError: moodError } = useMoodProfile();
    const queryClient = useQueryClient();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [gifLoaded, setGifLoaded] = useState(false);
    const [gifFailed, setGifFailed] = useState(false);
    const [facePhotoError, setFacePhotoError] = useState("");
    const [isStudioPickerOpen, setIsStudioPickerOpen] = useState(false);
    const [selectedStudioId, setSelectedStudioId] = useState<string>("");

    const logoByStudioKey: Record<string, string> = {
        kyoani: "/studio-logos/kyoani.svg",
        ghibli: "/studio-logos/ghibli.svg",
        ufotable: "/studio-logos/ufotable.svg",
        shaft: "/studio-logos/shaft.svg",
        trigger: "/studio-logos/trigger.svg",
    };

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
        },
        onSettled: () => {
            NProgress.done();
            setIsStudioPickerOpen(false);
        },
    });

    const { mutateAsync: updateFacePhoto, isPending: isUpdatingFacePhoto } = useMutation({
        mutationFn: updateFacePhotoService,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });

    if (profileLoading || moodLoading) return <LoadingComponent type="profile" />;
    if (moodError || profileError || !mood || !profile) return (
        <ErrorComponent type="profile" retry={() => refreshUser()} />
    );

    const sentimentDisplay = getMoodDisplayName(mood?.sentiment, "—");
    const sentimentKey = normalizeMoodAccentKey(sentimentDisplay);
    const accent = moodAccent[sentimentKey] ?? "#8a7bb8";
    const moodWords = sentimentDisplay.split(" ");
    const moodScore = Math.round((mood?.moodScore ?? 0) * 100);

    const handleFacePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        event.target.value = "";

        if (!selectedFile) return;

        if (!/^image\/(jpeg|png|webp)$/.test(selectedFile.type)) {
            setFacePhotoError("Envie apenas JPEG, PNG ou WEBP.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setFacePhotoError("A imagem deve ter no maximo 5MB.");
            return;
        }

        setFacePhotoError("");

        try {
            await updateFacePhoto(selectedFile);
        } catch {
            setFacePhotoError("Nao foi possivel atualizar a foto agora.");
        }
    };

    const openStudioPicker = () => {
        setIsStudioPickerOpen(true);
        void refetchStudios().then((result) => {
            const list = result.data ?? [];
            if (!selectedStudioId && list.length > 0) {
                setSelectedStudioId(list[0].id);
            }
        });
    };

    const handleRefreshWithStudio = () => {
        refreshUser(selectedStudioId || undefined);
    };

    const selectStudio = (studio: RefreshMoodStudio) => {
        setSelectedStudioId(studio.id);
    };

    return (
        <div className="glass-card glass-card-hover h-full flex flex-col overflow-hidden relative"
            style={{ minHeight: 430 }}>
            <div className="flex-1 mx-3 my-3 rounded-2xl overflow-hidden relative" style={{ background: "#05050a", minHeight: 390 }}>
                {!gifFailed ? (
                    <>
                        <img
                            src={mood.image_mood}
                            alt="Mood GIF"
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${gifLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                            style={{ objectPosition: "top center" }}
                            onLoad={() => setGifLoaded(true)}
                            onError={() => {
                                setGifFailed(true);
                                setGifLoaded(false);
                            }}
                        />

                        {!gifLoaded && (
                            <div className="absolute inset-0 animate-pulse"
                                style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01), rgba(255,255,255,0.05))" }} />
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center"
                        style={{
                            background: "radial-gradient(circle at 20% 20%, rgba(111,174,155,0.24), transparent 55%), radial-gradient(circle at 80% 80%, rgba(176,106,133,0.22), transparent 60%), #0b0b11",
                        }}>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/70"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            {sentimentDisplay}
                        </p>
                    </div>
                )}

                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 38%, transparent 52%, rgba(0,0,0,.88) 100%)",
                    }}
                />

                <div className="absolute inset-0"
                    style={{ background: `radial-gradient(ellipse 60% 40% at 80% 15%, ${accent}33 0%, transparent 60%)` }} />

                <div className="absolute inset-0 opacity-[0.10] mix-blend-soft-light mood-noise" />

                <div className="relative z-10 flex items-center gap-2.5 px-5 pt-5.5">
                    <img
                        src={profile.img_profile}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                        style={{ border: "1.5px solid rgba(255,255,255,.25)" }}
                    />
                    <span
                        className="flex-1 text-[11px] uppercase tracking-[.12em] truncate"
                        style={{ color: "rgba(255,255,255,.6)" }}
                    >
                        {profile.display_name}
                    </span>
                    <span
                        className="text-[11px] uppercase tracking-[.18em]"
                        style={{ color: "rgba(255,255,255,.28)" }}
                    >
                        MusicMood
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-6">
                    <p
                        className="text-[9px] uppercase tracking-[.22em] mb-2"
                        style={{ color: "rgba(255,255,255,.38)" }}
                    >
                        vibe atual
                    </p>

                    <p
                        className="font-black italic leading-[.92] tracking-tight"
                        style={{
                            fontSize: "clamp(38px, 10vw, 54px)",
                            color: "#fff",
                            textShadow: "0 2px 24px rgba(0,0,0,.8)",
                        }}
                    >
                        {moodWords.map((w, i) => (
                            <span key={i} style={{ display: "block" }}>{w}</span>
                        ))}
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                        <div
                            className="flex items-center gap-2 rounded-full px-3 py-1"
                            style={{
                                background: "rgba(255,255,255,.1)",
                                border: "1px solid rgba(255,255,255,.15)",
                            }}
                        >
                            <span className="text-[12px] font-bold text-white">{moodScore}%</span>
                            <span
                                className="text-[10px] uppercase tracking-widest"
                                style={{ color: "rgba(255,255,255,.4)" }}
                            >
                                score
                            </span>
                        </div>

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

            <div className="px-4 pb-3 flex items-center justify-end gap-2 relative z-10">
                <label
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                    style={{
                        background: "var(--surface-card-alt)",
                        border: "1px solid var(--border-medium)",
                        opacity: isUpdatingFacePhoto ? 0.7 : 1,
                    }}
                    title="Atualizar foto do rosto"
                >
                    <Camera className={`w-4.5 h-4.5 text-white/65 ${isUpdatingFacePhoto ? 'animate-pulse' : ''}`} />
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        disabled={isUpdatingFacePhoto}
                        onChange={(event) => { void handleFacePhotoChange(event); }}
                    />
                </label>
                <button
                    onClick={() => setIsShareOpen(true)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                    style={{
                        background: "var(--surface-card-alt)",
                        border: "1px solid var(--border-medium)",
                    }}
                    title="Compartilhar"
                >
                    <Share2 className="w-4.5 h-4.5 text-white/65" />
                </button>
                <button
                    onClick={openStudioPicker}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                    style={{
                        background: "var(--surface-card-alt)",
                        border: "1px solid var(--border-medium)",
                    }}
                    title="Atualizar"
                >
                    <RotateCw className={`w-4.5 h-4.5 text-white/65 ${isPending ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {facePhotoError && (
                <div className="px-4 pb-3 -mt-1 relative z-10">
                    <p className="text-[10px] text-rose-300">{facePhotoError}</p>
                </div>
            )}

            {profile && mood && (
                <ShareModal
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    mood={mood}
                    profile={profile}
                />
            )}

            {isStudioPickerOpen && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center px-4"
                    style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
                    onClick={() => !isPending && setIsStudioPickerOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl p-4"
                        style={{
                            background: "var(--surface-card)",
                            border: "1px solid var(--border-strong)",
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/45" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            Escolha o studio
                        </p>
                        <h3 className="text-lg mt-1 text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
                            Visual do proximo refresh
                        </h3>

                        <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
                            {studiosLoading && (
                                <p className="text-sm text-white/60">Carregando studios...</p>
                            )}

                            {studiosError && (
                                <p className="text-sm text-rose-300">Nao foi possivel carregar studios agora.</p>
                            )}

                            {!studiosLoading && !studiosError && studios.map((studio) => {
                                const isSelected = studio.id === selectedStudioId;
                                const referenceAnimes = Array.isArray(studio.referenceAnimes)
                                    ? studio.referenceAnimes
                                    : [];

                                return (
                                    <button
                                        key={studio.id}
                                        onClick={() => selectStudio(studio)}
                                        className="w-full text-left rounded-xl p-3 transition-all"
                                        style={{
                                            background: isSelected ? "rgba(111,174,155,0.14)" : "var(--surface-card-alt)",
                                            border: isSelected
                                                ? "1px solid rgba(111,174,155,0.45)"
                                                : "1px solid var(--border-medium)",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
                                                style={{ border: "1px solid rgba(255,255,255,0.18)", background: "#0b0b11" }}
                                            >
                                                <img
                                                    src={logoByStudioKey[studio.logoKey] ?? logoByStudioKey.ghibli}
                                                    alt={`Logo ${studio.company}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm text-white truncate" style={{ fontWeight: 700 }}>
                                                    {studio.name}
                                                </p>
                                                <p className="text-[11px] text-white/55 truncate">{studio.company}</p>
                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    {referenceAnimes.slice(0, 3).map((anime) => (
                                                        <span
                                                            key={`${studio.id}-${anime}`}
                                                            className="px-2 py-0.5 rounded-full text-[10px]"
                                                            style={{
                                                                background: "rgba(255,255,255,0.08)",
                                                                border: "1px solid rgba(255,255,255,0.14)",
                                                                color: "rgba(255,255,255,0.75)",
                                                            }}
                                                        >
                                                            {anime}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-3 py-2 rounded-lg text-sm"
                                onClick={() => setIsStudioPickerOpen(false)}
                                disabled={isPending}
                                style={{
                                    background: "var(--surface-card-alt)",
                                    border: "1px solid var(--border-medium)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                                onClick={handleRefreshWithStudio}
                                disabled={isPending || studiosLoading}
                                style={{
                                    background: "linear-gradient(135deg, #6fae9b, #8a7bb8)",
                                    color: "#05050a",
                                    fontWeight: 700,
                                    opacity: isPending || studiosLoading ? 0.65 : 1,
                                }}
                            >
                                <RotateCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
                                Aplicar e atualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .mood-noise {
                    background-image: radial-gradient(rgba(255,255,255,0.38) 0.6px, transparent 0.6px);
                    background-size: 3px 3px;
                }
            `}</style>
        </div>
    );
}

