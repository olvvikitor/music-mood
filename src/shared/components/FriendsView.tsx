"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
    Users, UserPlus, Search, Check, X, UserMinus,
    Clock, Radio, BarChart2, Loader2, Music2,
} from "lucide-react";
import { MoodBadge } from "@/shared/components/MoodBadge";
import { getMoodDisplayName, getMoodTextColor } from "@/shared/lib/moodHelpers";
import {
    searchUsers, sendFriendRequest, respondFriendRequest,
    getFriends, getPendingRequests, removeFriend,
    getFriendMood, getFriendListeningNow, compareMood,
    type Friend, type PendingRequest, type UserSearchResult,
    type MoodData, type ListeningNowData, type CompareMoodData,
} from "@/shared/services/friendService";

// â”€â”€â”€ Tipos internos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type FriendsTab = "friends" | "requests" | "search";
type FriendPanel = "listening" | "compare" | null;

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function moodColor(score: number) {
    if (score >= 0.7) return "#6fae9b";
    if (score >= 0.4) return "#8a7bb8";
    return "#b06a85";
}

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-lg bg-white/[0.06] animate-pulse ${className}`} />;
}

function ActionBtn({ onClick, disabled, children, variant = "ghost" }: {
    onClick: () => void; disabled?: boolean;
    children: React.ReactNode;
    variant?: "ghost" | "primary" | "danger" | "success";
}) {
    const colors: Record<string, string> = {
        ghost:   "bg-white/[0.06] hover:bg-white/[0.10] text-white/60 hover:text-white/90",
        primary: "bg-[#6fae9b]/10 hover:bg-[#6fae9b]/20 text-[#6fae9b] border border-[#6fae9b]/20",
        danger:  "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
        success: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
    };
    return (
        <button onClick={onClick} disabled={disabled}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${colors[variant]}`}>
            {children}
        </button>
    );
}

function EmptyState({ icon, message, sub, action }: {
    icon: React.ReactNode; message: string; sub: string;
    action?: { label: string; onClick: () => void };
}) {
    return (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
            <div className="text-white/15">{icon}</div>
            <p className="text-sm font-semibold text-white/50">{message}</p>
            <p className="text-xs text-white/25">{sub}</p>
            {action && (
                <button onClick={action.onClick} className="mt-2 text-xs font-semibold text-[#6fae9b] hover:text-[#6fae9b]/80 transition-colors">
                    {action.label} â†’
                </button>
            )}
        </div>
    );
}

// â”€â”€â”€ Painel: Tocando agora â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ListeningPanel({ friendId, friendName }: { friendId: string; friendName: string }) {
    const [data, setData] = useState<ListeningNowData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true); setError(false);
        getFriendListeningNow(friendId).then(setData).catch(() => setError(true)).finally(() => setLoading(false));
    }, [friendId]);

    if (loading) return (
        <div className="flex items-center gap-3 p-4 animate-pulse">
            <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
            <div className="flex flex-col gap-2 flex-1"><Skeleton className="h-3 w-40" /><Skeleton className="h-2.5 w-24" /></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center gap-3 p-4 text-white/25 text-xs">
            <Music2 className="w-4 h-4 shrink-0" />Nao foi possivel carregar.
        </div>
    );

    if (!data || !data.isPlaying) return (
        <div className="flex flex-col items-center gap-3 py-6 px-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-end gap-0.5 h-6">
                    {[4, 7, 5, 9, 6].map((h, i) => (
                        <div key={i} className="w-1 rounded-full opacity-25"
                            style={{ height: `${h * 2}px`, background: "linear-gradient(180deg,#6fae9b,#8a7bb8)" }} />
                    ))}
                </div>
            </div>
            <div className="text-center">
                <p className="text-xs font-semibold text-white/50" style={{ fontFamily: "var(--font-display)" }}>
                    {friendName} nao esta ouvindo nada
                </p>
                <p className="text-[10px] text-white/25 mt-0.5">Player pausado ou offline</p>
            </div>
        </div>
    );

    const track = data.tracks[0];
    const listeningMoodLabel = getMoodDisplayName(track.dominantSentiment, track.dominantSentiment);
    return (
        <div className="flex items-center gap-3 p-4">
            {track.img_url ? (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
                    <Image src={track.img_url} alt={track.music} fill sizes="56px" className="object-cover" />
                </div>
            ) : (
                <div className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <Music2 className="w-5 h-5 text-white/20" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white/90 truncate" style={{ fontFamily: "var(--font-display)" }}>{track.music}</p>
                <p className="text-xs text-white/45 truncate mt-0.5">{track.artist}</p>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: "#6fae9b" }} />
                    <span className="text-[10px] truncate" style={{ color: getMoodTextColor(listeningMoodLabel) }}>{listeningMoodLabel}</span>
                    <span className="text-[10px] font-bold ml-auto shrink-0" style={{ color: moodColor(track.moodScore) }}>
                        {Math.round(track.moodScore * 100)}%
                    </span>
                </div>
                {track.reasoning && <p className="text-[10px] text-white/25 italic line-clamp-1 mt-1">"{track.reasoning}"</p>}
            </div>
        </div>
    );
}

// Painel: Comparar mood

function ComparePanel({ friendId, friendName }: { friendId: string; friendName: string }) {
    const [data, setData] = useState<CompareMoodData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true); setError(false);
        compareMood(friendId).then(setData).catch(() => setError(true)).finally(() => setLoading(false));
    }, [friendId]);

    if (loading) return (
        <div className="flex flex-col gap-3 p-4 animate-pulse">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-2"><Skeleton className="h-16 rounded-xl" /><Skeleton className="h-16 rounded-xl" /></div>
        </div>
    );

    if (error || !data?.me || !data?.friend) return (
        <p className="text-xs text-white/30 p-4 text-center">Dados de comparacao nao disponiveis.</p>
    );

    const { me, friend } = data;
    const myMoodLabel = getMoodDisplayName(me.sentiment, me.sentiment);
    const friendMoodLabel = getMoodDisplayName(friend.sentiment, friend.sentiment);
    const myPct   = Math.round((me.moodScore ?? 0) * 100);
    const themPct = Math.round((friend.moodScore ?? 0) * 100);
    const harmony = 100 - Math.abs(myPct - themPct);
    const harmonyColor = harmony >= 70 ? "#6fae9b" : harmony >= 40 ? "#8a7bb8" : "#b06a85";
    const myTop   = Object.entries(me.emotions ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
    const themTop = Object.entries(friend.emotions ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
    const shared  = myTop.filter(k => themTop.includes(k));
    const allKeys = Array.from(new Set([...myTop, ...themTop])).slice(0, 6);

    return (
        <div className="flex flex-col gap-3 p-4">
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] uppercase tracking-widest text-white/35" style={{ fontFamily: "var(--font-display)" }}>Harmonia emocional</span>
                    <span className="text-sm font-black" style={{ color: harmonyColor, fontFamily: "var(--font-display)" }}>{harmony}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${harmony}%`, background: `linear-gradient(90deg, #6fae9b, ${harmonyColor})` }} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "rgba(111,174,155,0.05)", border: "1px solid rgba(111,174,155,0.12)" }}>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: "#6fae9b", fontFamily: "var(--font-display)" }}>Voce</span>
                    <span className="text-xl font-black" style={{ color: "#6fae9b", fontFamily: "var(--font-display)" }}>{myPct}%</span>
                    <span className="text-[10px] truncate" style={{ color: getMoodTextColor(myMoodLabel) }}>{myMoodLabel}</span>
                </div>
                <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "rgba(138,123,184,0.05)", border: "1px solid rgba(138,123,184,0.12)" }}>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: "#8a7bb8", fontFamily: "var(--font-display)" }}>{friendName}</span>
                    <span className="text-xl font-black" style={{ color: "#8a7bb8", fontFamily: "var(--font-display)" }}>{themPct}%</span>
                    <span className="text-[10px] truncate" style={{ color: getMoodTextColor(friendMoodLabel) }}>{friendMoodLabel}</span>
                </div>
            </div>
            {shared.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {shared.map(e => (
                        <span key={e} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(111,174,155,0.1)", color: "#6fae9b", border: "1px solid rgba(111,174,155,0.2)" }}>
                            {e}
                        </span>
                    ))}
                </div>
            )}
            <div className="flex flex-col gap-2.5">
                {allKeys.map(key => {
                    const myVal = (me.emotions?.[key] ?? 0) * 100;
                    const themVal = (friend.emotions?.[key] ?? 0) * 100;
                    return (
                        <div key={key}>
                            <span className="text-[10px] text-white/30 capitalize block mb-1">{key}</span>
                            <div className="flex flex-col gap-0.5">
                                <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${myVal}%`, background: "#6fae9b" }} />
                                </div>
                                <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${themVal}%`, background: "#8a7bb8" }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="flex gap-4 pt-1">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#6fae9b" }} /><span className="text-[9px] text-white/30">Voce</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#8a7bb8" }} /><span className="text-[9px] text-white/30">{friendName}</span></div>
                </div>
            </div>
        </div>
    );
}

// FriendCard

function FriendCard({ friend, onRemove, actionLoading }: {
    friend: Friend;
    onRemove: (id: string) => void;
    actionLoading: string | null;
}) {
    const [mood, setMood] = useState<MoodData>(null);
    const [moodLoading, setMoodLoading] = useState(true);
    const [panel, setPanel] = useState<FriendPanel>(null);

    useEffect(() => {
        getFriendMood(friend.id).then(setMood).catch(() => {}).finally(() => setMoodLoading(false));
    }, [friend.id]);

    const score       = mood?.moodScore ?? 0;
    const color       = moodColor(score);
    const pct         = Math.round(score * 100);
    const topEmotions = Object.entries(mood?.emotions ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const firstName   = friend.display_name.split(" ")[0];

    function togglePanel(p: FriendPanel) { setPanel(prev => prev === p ? null : p); }

    return (
        <li className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="relative">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 30% 0%, ${color}18 0%, transparent 70%)` }} />
                <div className="relative flex items-start gap-4 p-4">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-full blur-md opacity-50"
                            style={{ background: color, transform: "scale(1.15)" }} />
                        <img src={friend.img_profile} alt={friend.display_name}
                            className="relative w-16 h-16 rounded-full object-cover"
                            style={{ boxShadow: `0 0 0 2px ${color}60` }} />
                        <div className="absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 text-[9px] font-black"
                            style={{ background: color, color: "#07070c", fontFamily: "var(--font-display)" }}>
                            {pct}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-base font-black text-white truncate leading-tight" style={{ fontFamily: "var(--font-display)" }}>{friend.display_name}</p>
                                <p className="text-xs text-white/35 mt-0.5">{friend.country}</p>
                            </div>
                            <button onClick={() => onRemove(friend.friendshipId)} disabled={actionLoading === friend.friendshipId}
                                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all text-white/20 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30">
                                <UserMinus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        {moodLoading ? (
                            <div className="flex items-center gap-2 mt-2"><Skeleton className="h-5 w-20 rounded-full" /><Skeleton className="h-2.5 w-32" /></div>
                        ) : mood ? (
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <MoodBadge mood={mood.sentiment} size="sm" />
                                <div className="flex gap-1 flex-wrap">
                                    {topEmotions.map(([k, v]) => (
                                        <span key={k} className="text-[9px] px-1.5 py-0.5 rounded-full"
                                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                                            {k} {Math.round(v * 100)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                        {!moodLoading && mood && (
                            <div className="mt-3 flex items-center gap-2">
                                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                                </div>
                                <span className="text-[10px] font-bold shrink-0" style={{ color, fontFamily: "var(--font-display)" }}>{pct}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-px" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {([
                    { key: "listening" as FriendPanel, icon: <Radio className="w-3.5 h-3.5" />, label: "Ouvindo agora" },
                    { key: "compare"   as FriendPanel, icon: <BarChart2 className="w-3.5 h-3.5" />, label: "Comparar" },
                ] as const).map(btn => (
                    <button key={btn.key} onClick={() => togglePanel(btn.key)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all"
                        style={{ color: panel === btn.key ? color : "rgba(255,255,255,0.35)", background: panel === btn.key ? `${color}10` : "transparent" }}>
                        {btn.icon}{btn.label}
                    </button>
                ))}
            </div>
            {panel === "listening" && <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}><ListeningPanel friendId={friend.id} friendName={firstName} /></div>}
            {panel === "compare"   && <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}><ComparePanel   friendId={friend.id} friendName={firstName} /></div>}
        </li>
    );
}

function FriendCardSkeleton() {
    return (
        <li className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-start gap-4 p-4">
                <div className="w-16 h-16 rounded-full bg-white/[0.07] shrink-0" />
                <div className="flex-1 flex flex-col gap-2.5 pt-1">
                    <Skeleton className="h-4 w-36" /><Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-5 w-24 rounded-full" /><Skeleton className="h-1 w-full rounded-full" />
                </div>
            </div>
            <div className="flex" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <Skeleton className="flex-1 h-10 rounded-none" /><Skeleton className="flex-1 h-10 rounded-none" />
            </div>
        </li>
    );
}

// FriendsView (componente publico reutilizavel)

export function FriendsView() {
    const [tab, setTab]           = useState<FriendsTab>("friends");
    const [friends, setFriends]   = useState<Friend[]>([]);
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [searchQuery, setSearchQuery]     = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [loadingFriends, setLoadingFriends]   = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [loadingSearch, setLoadingSearch]     = useState(false);
    const [actionLoading, setActionLoading]     = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const notify = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

    useEffect(() => {
        getFriends().then(setFriends).catch(() => notify("Erro ao carregar amigos.", false)).finally(() => setLoadingFriends(false));
        getPendingRequests().then(setRequests).catch(() => {}).finally(() => setLoadingRequests(false));
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
        setLoadingSearch(true);
        const t = setTimeout(() => {
            searchUsers(searchQuery).then(setSearchResults).catch(() => notify("Erro na busca.", false)).finally(() => setLoadingSearch(false));
        }, 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const handleSendRequest = useCallback(async (userId: string) => {
        setActionLoading(userId);
        try {
            await sendFriendRequest(userId);
            setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, friendshipStatus: "PENDING" as const } : u));
            notify("Solicitacao enviada!");
        } catch { notify("Nao foi possivel enviar.", false); }
        finally { setActionLoading(null); }
    }, []);

    const handleRespond = useCallback(async (friendshipId: string, accept: boolean) => {
        setActionLoading(friendshipId);
        try {
            await respondFriendRequest(friendshipId, accept);
            setRequests(prev => prev.filter(r => r.id !== friendshipId));
            if (accept) { getFriends().then(setFriends).catch(() => {}); notify("Amizade aceita! 🎉"); }
            else { notify("Solicitacao recusada."); }
        } catch { notify("Erro ao responder.", false); }
        finally { setActionLoading(null); }
    }, []);

    const handleRemoveFriend = useCallback(async (friendshipId: string) => {
        setActionLoading(friendshipId);
        try { await removeFriend(friendshipId); setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId)); notify("Amigo removido."); }
        catch { notify("Erro ao remover.", false); }
        finally { setActionLoading(null); }
    }, []);

    const tabs = [
        { key: "friends"  as FriendsTab, label: "Amigos",      icon: <Users className="w-3.5 h-3.5" />, badge: 0 },
        { key: "requests" as FriendsTab, label: "Solicitacoes", icon: <Clock className="w-3.5 h-3.5" />, badge: requests.length },
        { key: "search"   as FriendsTab, label: "Buscar",       icon: <Search className="w-3.5 h-3.5" />, badge: 0 },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.key ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"}`}>
                        {t.icon}{t.label}
                        {t.badge > 0 && (
                            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[#b06a85] text-white text-[9px] font-black flex items-center justify-center">{t.badge}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* AMIGOS */}
            {tab === "friends" && (
                loadingFriends ? (
                    <ul className="flex flex-col gap-3">{[1, 2, 3].map(i => <FriendCardSkeleton key={i} />)}</ul>
                ) : friends.length === 0 ? (
                    <EmptyState icon={<Users className="w-10 h-10" />} message="Nenhum amigo ainda."
                        sub="Busque pessoas pelo nome e envie uma solicitacao."
                        action={{ label: "Buscar amigos", onClick: () => setTab("search") }} />
                ) : (
                    <ul className="flex flex-col gap-3">
                        {friends.map(f => <FriendCard key={f.friendshipId} friend={f} onRemove={handleRemoveFriend} actionLoading={actionLoading} />)}
                    </ul>
                )
            )}

            {/* SOLICITACOES */}
            {tab === "requests" && (
                <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {loadingRequests ? (
                        <div className="flex flex-col divide-y divide-white/[0.05] animate-pulse">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center gap-3 p-4">
                                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                                    <div className="flex-1 flex flex-col gap-2"><Skeleton className="h-3 w-32" /><Skeleton className="h-2.5 w-20" /></div>
                                    <Skeleton className="h-7 w-20 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : requests.length === 0 ? (
                        <EmptyState icon={<Check className="w-8 h-8" />} message="Nenhuma solicitacao pendente." sub="Quando alguem te adicionar, vai aparecer aqui." />
                    ) : (
                        <ul className="divide-y divide-white/[0.05]">
                            {requests.map(r => (
                                <li key={r.id} className="flex items-center gap-3 p-4">
                                    <img src={r.requester.img_profile} alt={r.requester.display_name}
                                        className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-white/10" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white/90 truncate" style={{ fontFamily: "var(--font-display)" }}>{r.requester.display_name}</p>
                                        <p className="text-xs text-white/30">{r.requester.country}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <ActionBtn variant="success" onClick={() => handleRespond(r.id, true)} disabled={actionLoading === r.id}><Check className="w-3 h-3" />Aceitar</ActionBtn>
                                        <ActionBtn variant="danger"  onClick={() => handleRespond(r.id, false)} disabled={actionLoading === r.id}><X className="w-3 h-3" /></ActionBtn>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* BUSCAR */}
            {tab === "search" && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                        <Search className="w-4 h-4 text-white/30 shrink-0" />
                        <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Buscar pelo nome..."
                            className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/30 outline-none" />
                        {loadingSearch && <Loader2 className="w-4 h-4 text-white/30 animate-spin shrink-0" />}
                    </div>
                    {searchQuery.trim().length < 2 ? (
                        <EmptyState icon={<Search className="w-8 h-8" />} message="Busque por nome" sub="Digite pelo menos 2 caracteres para encontrar pessoas." />
                    ) : searchResults.length === 0 && !loadingSearch ? (
                        <EmptyState icon={<Users className="w-8 h-8" />} message="Nenhum resultado." sub="Tente um nome diferente." />
                    ) : (
                        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <ul className="divide-y divide-white/[0.05]">
                                {searchResults.map(u => (
                                    <li key={u.id} className="flex items-center gap-3 p-4">
                                        <img src={u.img_profile} alt={u.display_name}
                                            className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-white/10" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white/90 truncate" style={{ fontFamily: "var(--font-display)" }}>{u.display_name}</p>
                                            <p className="text-xs text-white/30">{u.country}</p>
                                        </div>
                                        {u.friendshipStatus === "ACCEPTED" ? (
                                            <span className="text-xs text-[#6fae9b]/70 font-semibold">Amigos ✓</span>
                                        ) : u.friendshipStatus === "PENDING" ? (
                                            <span className="text-xs text-white/30 font-semibold">Pendente...</span>
                                        ) : (
                                            <ActionBtn variant="primary" onClick={() => handleSendRequest(u.id)} disabled={actionLoading === u.id}>
                                                <UserPlus className="w-3 h-3" />Adicionar
                                            </ActionBtn>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl z-50 ${toast.ok ? "bg-[#6fae9b]/10 border border-[#6fae9b]/30 text-[#6fae9b]" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                    {toast.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
}

