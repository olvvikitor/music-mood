"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Music2, BarChart2, MessageCircle, Send, Heart } from "lucide-react";
import { compareMood, type CompareMoodData, type Friend } from "@/shared/services/friendService";
import { getMoodDisplayName, getMoodTextColor } from "@/shared/lib/moodHelpers";
import { useTheme } from "@/shared/providers/ThemeProvider";

export type FeedPostData = Friend & {
    isPlaying: boolean;
    track?: {
        music: string;
        artist: string;
        img_url: string;
        moodScore: number;
        dominantSentiment: string;
        reasoning: string;
    };
    mood?: {
        moodScore: number;
        sentiment: string;
        emotions: Record<string, number>;
        coreAxes?: Record<string, number>;
        reasoning?: string;
        image_mood?: string;
        analyzedAt?: string;
    } | null;
};

type Reaction = { emoji: string; label: string };
type Comment = { id: string; text: string; at: string };

const REACTIONS: Reaction[] = [
    { emoji: "🔥", label: "pilhado" },
    { emoji: "💚", label: "em paz" },
    { emoji: "💜", label: "pensando" },
    { emoji: "😢", label: "sentindo" },
    { emoji: "⚡", label: "energia" },
    { emoji: "🫂", label: "abraco" },
];

function moodColor(score: number) {
    if (score >= 0.7) return "#6fae9b";
    if (score >= 0.4) return "#8a7bb8";
    return "#b06a85";
}

function timeAgo(iso?: string) {
    if (!iso) return "agora";
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return "agora";
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-lg bg-white/6 animate-pulse ${className}`} />;
}

function ComparePanel({
    friendId,
    friendName,
    accentColor,
}: {
    friendId: string;
    friendName: string;
    accentColor: string;
}) {
    const [data, setData] = useState<CompareMoodData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        compareMood(friendId)
            .then(setData)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [friendId]);

    if (loading) {
        return (
            <div className="flex flex-col gap-2 p-4 animate-pulse">
                <Skeleton className="h-6 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-2 mt-1">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                </div>
            </div>
        );
    }

    const me = data?.me;
    const friend = data?.friend;

    if (!me || !friend) {
        return <p className="text-xs text-white/30 text-center py-4">Dados nao disponiveis.</p>;
    }

    const myMoodLabel = getMoodDisplayName(me.sentiment, me.sentiment);
    const friendMoodLabel = getMoodDisplayName(friend.sentiment, friend.sentiment);

    const myPct = Math.round((me.moodScore ?? 0) * 100);
    const themPct = Math.round((friend.moodScore ?? 0) * 100);
    const harmony = 100 - Math.abs(myPct - themPct);
    const harmonyColor = harmony >= 70 ? "#6fae9b" : harmony >= 40 ? "#8a7bb8" : "#b06a85";

    const myTop = Object.entries(me.emotions ?? {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k]) => k);
    const themTop = Object.entries(friend.emotions ?? {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k]) => k);
    const shared = myTop.filter((k) => themTop.includes(k));

    return (
        <div className="px-4 pb-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span
                    className="text-[10px] uppercase tracking-widest text-white/30"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    harmonia emocional
                </span>
                <span
                    className="text-sm font-black"
                    style={{ color: harmonyColor, fontFamily: "var(--font-display)" }}
                >
                    {harmony}%
                </span>
            </div>

            <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${harmony}%`, background: `linear-gradient(90deg,#6fae9b,${harmonyColor})` }}
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div
                    className="rounded-xl p-3"
                    style={{ background: "rgba(111,174,155,0.06)", border: "1px solid rgba(111,174,155,0.15)" }}
                >
                    <span
                        className="text-[9px] uppercase tracking-widest block"
                        style={{ color: "#6fae9b", fontFamily: "var(--font-display)" }}
                    >
                        Voce
                    </span>
                    <span
                        className="text-2xl font-black block"
                        style={{ color: "#6fae9b", fontFamily: "var(--font-display)" }}
                    >
                        {myPct}%
                    </span>
                    <span className="text-[10px] block truncate mt-0.5" style={{ color: getMoodTextColor(myMoodLabel) }}>
                        {myMoodLabel}
                    </span>
                </div>

                <div
                    className="rounded-xl p-3"
                    style={{ background: `${accentColor}0d`, border: `1px solid ${accentColor}25` }}
                >
                    <span
                        className="text-[9px] uppercase tracking-widest block"
                        style={{ color: accentColor, fontFamily: "var(--font-display)" }}
                    >
                        {friendName}
                    </span>
                    <span
                        className="text-2xl font-black block"
                        style={{ color: accentColor, fontFamily: "var(--font-display)" }}
                    >
                        {themPct}%
                    </span>
                    <span className="text-[10px] block truncate mt-0.5" style={{ color: getMoodTextColor(friendMoodLabel) }}>
                        {friendMoodLabel}
                    </span>
                </div>
            </div>

            {shared.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    <span
                        className="text-[9px] uppercase tracking-widest text-white/25 w-full"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        em sintonia
                    </span>
                    {shared.map((emotion) => (
                        <span
                            key={emotion}
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{
                                background: "rgba(111,174,155,0.1)",
                                color: "#6fae9b",
                                border: "1px solid rgba(111,174,155,0.2)",
                            }}
                        >
                            {emotion}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export function FeedPost({ post }: { post: FeedPostData }) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const score = post.mood?.moodScore ?? 0;
    const color = moodColor(score);
    const pct = Math.round(score * 100);
    const firstName = post.display_name.split(" ")[0];
    const imageMood = post.mood?.image_mood;
    const sentimentDisplay = getMoodDisplayName(
        post.mood?.sentiment ?? post.track?.dominantSentiment,
        "Sem mood",
    );
    const moodWords = sentimentDisplay.split(" ");

    const [myReaction, setMyReaction] = useState<string | null>(null);
    const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
    const [showReactions, setShowReactions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showCompare, setShowCompare] = useState(false);
    const [showFullMoodImage, setShowFullMoodImage] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [imgLoaded, setImgLoaded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const actionsDivider = isLight ? "rgba(12,12,18,0.12)" : "rgba(255,255,255,0.05)";
    const panelShadow = isLight ? "0 8px 24px rgba(28,40,58,0.15)" : "0 8px 32px rgba(0,0,0,0.6)";
    const iconButtonBg = isLight ? "rgba(12,12,18,0.06)" : "var(--surface-card-alt)";
    const iconButtonBorder = isLight ? "rgba(12,12,18,0.16)" : "var(--border-medium)";
    const iconButtonColor = isLight ? "rgba(12,12,18,0.68)" : "rgba(255,255,255,0.65)";

    function handleReact(emoji: string) {
        setReactionCounts((prev) => {
            const next = { ...prev };
            if (myReaction === emoji) {
                next[emoji] = Math.max(0, (next[emoji] ?? 1) - 1);
                setMyReaction(null);
            } else {
                if (myReaction) next[myReaction] = Math.max(0, (next[myReaction] ?? 1) - 1);
                next[emoji] = (next[emoji] ?? 0) + 1;
                setMyReaction(emoji);
            }
            return next;
        });
        setShowReactions(false);
    }

    function handleComment() {
        const text = commentText.trim();
        if (!text) return;
        setComments((prev) => [...prev, { id: Date.now().toString(), text, at: new Date().toISOString() }]);
        setCommentText("");
    }

    const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

    return (
        <article
            className="glass-card glass-card-hover h-full flex flex-col overflow-hidden relative"
            style={{ minHeight: 390 }}
        >
            <div className="relative flex-1 mx-3 mt-3 mb-2 rounded-2xl overflow-hidden" style={{ minHeight: 320, background: "#05050a" }}>
                {!imgLoaded && imageMood && (
                    <div
                        className="absolute inset-0 animate-pulse"
                        style={{ background: `linear-gradient(135deg, ${color}15, rgba(255,255,255,0.03))` }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
                        </div>
                    </div>
                )}

                {imageMood ? (
                    <img
                        src={imageMood}
                        alt={`Mood de ${post.display_name}`}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 cursor-zoom-in"
                        style={{ opacity: imgLoaded ? 0.85 : 0, objectPosition: "top center" }}
                        onLoad={() => setImgLoaded(true)}
                        onClick={() => setShowFullMoodImage(true)}
                    />
                ) : (
                    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 20% 20%, ${color}33, transparent 55%), #0b0b11` }} />
                )}

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 38%, transparent 52%, rgba(0,0,0,.88) 100%)",
                    }}
                />

                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 40% at 80% 15%, ${color}33 0%, transparent 60%)` }} />

                <div className="absolute inset-0 opacity-[0.10] mix-blend-soft-light mood-noise" />

                <div className="relative z-10 flex items-center gap-2.5 px-4 pt-4">
                    <img
                        src={post.img_profile}
                        alt={post.display_name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                        style={{ border: "1.5px solid rgba(255,255,255,.25)" }}
                    />
                    <span className="flex-1 text-[11px] uppercase tracking-[.12em] truncate" style={{ color: "rgba(255,255,255,.62)", fontFamily: "var(--font-display)" }}>
                        {post.display_name}
                    </span>
                    <span className="text-[11px] uppercase tracking-[.18em]" style={{ color: "rgba(255,255,255,.28)" }}>
                        MusicMood
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4">
                    <p className="text-[9px] uppercase tracking-[.22em] mb-2" style={{ color: "rgba(255,255,255,.38)" }}>
                        se sentindo 
                    </p>

                    <p
                        className="font-black italic leading-[.92] tracking-tight"
                        style={{
                            fontSize: "clamp(28px, 7.2vw, 38px)",
                            color: "#fff",
                            textShadow: "0 2px 24px rgba(0,0,0,.8)",
                        }}
                    >
                        {moodWords.map((word, index) => (
                            <span key={index} style={{ display: "block" }}>
                                {word}
                            </span>
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
                            <span className="text-[12px] font-bold text-white">{pct}%</span>
                            <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,.4)" }}>
                                score
                            </span>
                        </div>

                        <div className="flex items-end gap-0.75" style={{ height: 16 }}>
                            {[38, 80, 100, 62, 88].map((height, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: 3,
                                        height: `${height}%`,
                                        borderRadius: "2px 2px 0 0",
                                        background: color,
                                        opacity: 0.8,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {post.isPlaying && post.track ? (
                        <div
                            className="mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2"
                            style={{
                                background: "var(--glass-overlay)",
                                backdropFilter: "blur(12px)",
                                border: "1px solid var(--border-strong)",
                            }}
                        >
                            {post.track.img_url ? (
                                <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
                                    <Image src={post.track.img_url} alt={post.track.music} fill sizes="36px" className="object-cover object-center" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <Music2 className="w-3.5 h-3.5 text-white/30" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-white truncate leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                                    {post.track.music}
                                </p>
                                <p className="text-[10px] text-white/40 truncate">{post.track.artist.split(",")[0]}</p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#6fae9b" }} />
                                <span className="text-[9px] uppercase tracking-wider text-white/40">live</span>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5"
                            style={{
                                background: "var(--glass-overlay)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid var(--border-medium)",
                            }}
                        >
                            <div className="flex items-end gap-0.5 opacity-30">
                                {[3, 5, 4, 6, 4].map((h, i) => (
                                    <div key={i} className="w-0.5 rounded-full" style={{ height: `${h * 2}px`, background: "white" }} />
                                ))}
                            </div>
                            <span className="text-[10px] text-white/35 italic">Nada tocando</span>
                        </div>
                    )}
                </div>
            </div>

            {showFullMoodImage && imageMood && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center p-4"
                    style={{ background: "rgba(5,5,10,0.84)", backdropFilter: "blur(6px)" }}
                    onClick={() => setShowFullMoodImage(false)}
                >
                    <div
                        className="relative w-full max-w-4xl max-h-[88vh] rounded-2xl overflow-hidden"
                        style={{ border: "1px solid rgba(255,255,255,0.16)", background: "rgba(0,0,0,0.35)" }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={imageMood}
                            alt={`Foto completa de mood de ${post.display_name}`}
                            className="w-full h-full object-contain"
                            style={{ maxHeight: "88vh" }}
                        />
                        <button
                            onClick={() => setShowFullMoodImage(false)}
                            className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
                            style={{
                                background: "rgba(0,0,0,0.55)",
                                color: "rgba(255,255,255,0.9)",
                                border: "1px solid rgba(255,255,255,0.22)",
                                fontFamily: "var(--font-display)",
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {post.mood?.reasoning && (
                <div className="px-4 pb-3">
                    <p className="text-[13px] text-white/50 leading-relaxed italic line-clamp-3">"{post.mood.reasoning}"</p>
                </div>
            )}

            {totalReactions > 0 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {Object.entries(reactionCounts)
                        .filter(([, count]) => count > 0)
                        .map(([emoji, count]) => (
                            <button
                                key={emoji}
                                onClick={() => handleReact(emoji)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
                                style={{
                                    background: myReaction === emoji ? `${color}20` : "rgba(255,255,255,0.05)",
                                    border: myReaction === emoji ? `1px solid ${color}40` : "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <span>{emoji}</span>
                                <span className="text-[10px] font-semibold" style={{ color: myReaction === emoji ? color : "rgba(255,255,255,0.45)" }}>
                                    {count}
                                </span>
                            </button>
                        ))}
                </div>
            )}

            <div className="px-4 pb-3 flex items-center justify-end gap-2" style={{ borderTop: `1px solid ${actionsDivider}`, paddingTop: "10px" }}>
                <div className="relative">
                    <button
                        onClick={() => setShowReactions((prev) => !prev)}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                        style={{
                            background: iconButtonBg,
                            border: `1px solid ${iconButtonBorder}`,
                            color: myReaction ? color : iconButtonColor,
                        }}
                        title="Reagir"
                    >
                        {myReaction ? <span className="text-base leading-none">{myReaction}</span> : <Heart className="w-4.5 h-4.5" />}
                    </button>

                    {showReactions && (
                        <div
                            className="absolute bottom-full right-0 mb-2 flex items-center gap-1 p-2 rounded-2xl z-20"
                            style={{
                                background: "var(--surface-solid)",
                                border: "1px solid var(--border-strong)",
                                boxShadow: panelShadow,
                                animation: "fadeSlideIn 0.15s ease-out",
                            }}
                        >
                            {REACTIONS.map((reaction) => (
                                <button
                                    key={reaction.emoji}
                                    onClick={() => handleReact(reaction.emoji)}
                                    className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all hover:scale-110 active:scale-95"
                                    style={{ background: myReaction === reaction.emoji ? (isLight ? "rgba(12,12,18,0.10)" : "rgba(255,255,255,0.1)") : "transparent" }}
                                    title={reaction.label}
                                >
                                    <span className="text-xl leading-none">{reaction.emoji}</span>
                                    <span className="text-[8px] uppercase tracking-wide" style={{ fontFamily: "var(--font-display)", color: isLight ? "rgba(12,12,18,0.48)" : "rgba(255,255,255,0.30)" }}>
                                        {reaction.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        setShowComments((prev) => !prev);
                        setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                    style={{
                        background: iconButtonBg,
                        border: `1px solid ${iconButtonBorder}`,
                        color: showComments ? color : iconButtonColor,
                    }}
                    title="Comentar"
                >
                    <MessageCircle className="w-4.5 h-4.5" />
                    {comments.length > 0 && (
                        <span
                            className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 rounded-full text-[8px] font-black flex items-center justify-center text-white"
                            style={{ background: "#b06a85" }}
                        >
                            {comments.length > 9 ? "9+" : comments.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setShowCompare((prev) => !prev)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                    style={{
                        background: iconButtonBg,
                        border: `1px solid ${iconButtonBorder}`,
                        color: showCompare ? "#8a7bb8" : iconButtonColor,
                    }}
                    title="Comparar mood"
                >
                    <BarChart2 className="w-4.5 h-4.5" />
                </button>
            </div>

            {showCompare && (
                <div style={{ borderTop: `1px solid ${actionsDivider}` }}>
                    <ComparePanel friendId={post.id} friendName={firstName} accentColor={color} />
                </div>
            )}

            {showComments && (
                <div style={{ borderTop: `1px solid ${actionsDivider}` }}>
                    {comments.length > 0 && (
                        <ul className="flex flex-col divide-y divide-white/4 px-4 pt-3">
                            {comments.map((comment) => (
                                <li key={comment.id} className="flex gap-2.5 py-2.5">
                                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black" style={{ background: `${color}20`, color }}>
                                        Eu
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-bold text-white/80" style={{ fontFamily: "var(--font-display)" }}>
                                                Voce
                                            </span>
                                            <span className="text-[10px] text-white/25">{timeAgo(comment.at)}</span>
                                        </div>
                                        <p className="text-sm text-white/65 leading-relaxed">{comment.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex items-center gap-2.5 px-4 py-3">
                        <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black" style={{ background: `${color}20`, color }}>
                            Eu
                        </div>
                        <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={commentText}
                                onChange={(event) => setCommentText(event.target.value)}
                                onKeyDown={(event) => event.key === "Enter" && handleComment()}
                                placeholder={`Comente o mood de ${firstName}...`}
                                className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
                            />
                            <button onClick={handleComment} disabled={!commentText.trim()} className="transition-all disabled:opacity-30" style={{ color }}>
                                <Send className="w-4 h-4" />
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
        </article>
    );
}

export function FeedPostSkeleton() {
    return (
        <div
            className="flex flex-col gap-0 overflow-hidden animate-pulse"
            style={{
                background: "var(--surface-solid)",
                border: "1px solid var(--border-medium)",
                borderRadius: "1.25rem",
            }}
        >
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div className="w-10 h-10 rounded-full bg-white/7 shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3.5 bg-white/7 rounded-full w-32" />
                    <div className="h-4 bg-white/5 rounded-full w-20" />
                </div>
            </div>
            <div className="mx-4 mb-3 rounded-[0.875rem] bg-white/5" style={{ aspectRatio: "4/3" }} />
            <div className="flex gap-1 px-4 pb-3 pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {[1, 2, 3].map((index) => (
                    <div key={index} className="flex-1 h-8 bg-white/4 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
