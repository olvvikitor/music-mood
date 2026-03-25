"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Users, UserPlus, Search, Check, X, UserMinus,
    Clock, Radio, Smile, BarChart2, ChevronDown, Loader2,
} from "lucide-react";
import { AppBrand } from "@/shared/components/AppBrand";
import { SectionCard } from "@/shared/components/SectionCard";
import {
    searchUsers, sendFriendRequest, respondFriendRequest,
    getFriends, getPendingRequests, removeFriend,
    getFriendMood, getFriendListeningNow, compareMood,
    type Friend, type PendingRequest, type UserSearchResult,
    type MoodData, type ListeningNowData, type CompareMoodData,
} from "@/shared/services/friendService";
import Link from "next/link";
import Image from "next/image";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Tab = "friends" | "requests" | "search";
type FriendPanel = "mood" | "listening" | "compare" | null;

// ─── Helpers visuais ─────────────────────────────────────────────────────────

function Avatar({ src, name, size = 10 }: { src: string; name: string; size?: number }) {
    return (
        <img
            src={src} alt={name}
            className={`w-${size} h-${size} rounded-full object-cover shrink-0 ring-1 ring-white/10`}
        />
    );
}

function ActionBtn({ onClick, disabled, children, variant = "ghost" }: {
    onClick: () => void; disabled?: boolean;
    children: React.ReactNode;
    variant?: "ghost" | "primary" | "danger" | "success";
}) {
    const colors: Record<string, string> = {
        ghost:   "bg-white/[0.06] hover:bg-white/[0.10] text-white/60 hover:text-white/90",
        primary: "bg-[#00ffb3]/10 hover:bg-[#00ffb3]/20 text-[#00ffb3] border border-[#00ffb3]/20",
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

function MoodScore({ score, label }: { score: number; label: string }) {
    const pct = Math.round(score * 100);
    const color = pct >= 70 ? "#00ffb3" : pct >= 40 ? "#a259ff" : "#ff2d87";
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40" style={{ fontFamily: "var(--font-display)" }}>{label}</span>
                <span className="text-sm font-black" style={{ color, fontFamily: "var(--font-display)" }}>{pct}%</span>
            </div>
            <div className="h-1 rounded-full w-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    );
}

function EmotionBar({ label, value }: { label: string; value: number }) {
    const pct = Math.round(value * 100);
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/35 w-24 shrink-0 truncate capitalize">{label}</span>
            <div className="flex-1 h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#00ffb3,#a259ff)" }} />
            </div>
            <span className="text-[10px] text-white/30 w-7 text-right shrink-0">{pct}</span>
        </div>
    );
}

function PanelSkeleton() {
    return (
        <div className="flex flex-col gap-3 animate-pulse pt-3">
            {[80, 55, 70].map((w, i) => (
                <div key={i} className="h-2.5 rounded-full bg-white/[0.06]" style={{ width: `${w}%` }} />
            ))}
        </div>
    );
}

// ─── Painel: Mood do amigo ────────────────────────────────────────────────────

function FriendMoodPanel({ friendId }: { friendId: string }) {
    const [data, setData] = useState<MoodData>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true); setError(false);
        getFriendMood(friendId)
            .then(setData)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [friendId]);

    if (loading) return <PanelSkeleton />;
    if (error || !data) return <p className="text-xs text-white/30 py-4 text-center">Mood não disponível.</p>;

    const emotions = Object.entries(data.emotions ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return (
        <div className="flex flex-col gap-4 pt-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-[9px] uppercase tracking-widest text-white/35" style={{ fontFamily: "var(--font-display)" }}>Mood Score</span>
                    <span className="text-lg font-black" style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>{Math.round(data.moodScore * 100)}%</span>
                </div>
                <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-[9px] uppercase tracking-widest text-white/35" style={{ fontFamily: "var(--font-display)" }}>Sentimento</span>
                    <span className="text-sm font-bold text-white/80 truncate" style={{ fontFamily: "var(--font-display)" }}>{data.sentiment}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2.5">
                <span className="text-[9px] uppercase tracking-widest text-white/30" style={{ fontFamily: "var(--font-display)" }}>Emoções</span>
                {emotions.map(([key, val]) => <EmotionBar key={key} label={key} value={val} />)}
            </div>
        </div>
    );
}

// ─── Painel: Tocando agora ────────────────────────────────────────────────────

function FriendListeningPanel({ friendId }: { friendId: string }) {
    const [data, setData] = useState<ListeningNowData>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true); setError(false);
        getFriendListeningNow(friendId)
            .then(setData)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [friendId]);

    if (loading) return <PanelSkeleton />;
    if (error || !data?.tracks?.length) return <p className="text-xs text-white/30 py-4 text-center">Nenhuma música tocando agora.</p>;

    const track = data.tracks[0];

    return (
        <div className="flex items-center gap-4 pt-3">
            {track.img_url && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
                    <Image src={track.img_url} alt={track.music} fill className="object-cover" sizes="56px" />
                </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-sm font-bold text-white/90 truncate" style={{ fontFamily: "var(--font-display)" }}>{track.music}</p>
                <p className="text-xs text-white/40 truncate">{track.artist}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00ffb3" }} />
                    <span className="text-[10px] text-white/40">{track.dominantSentiment}</span>
                    <span className="text-[10px] text-white/25 ml-auto">mood {Math.round(track.moodScore * 100)}%</span>
                </div>
                {track.reasoning && (
                    <p className="text-[10px] text-white/30 italic line-clamp-1 mt-0.5">"{track.reasoning}"</p>
                )}
            </div>
        </div>
    );
}

// ─── Painel: Comparar mood ────────────────────────────────────────────────────

function CompareMoodPanel({ friendId, friendName }: { friendId: string; friendName: string }) {
    const [data, setData] = useState<CompareMoodData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true); setError(false);
        compareMood(friendId)
            .then(setData)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [friendId]);

    if (loading) return <PanelSkeleton />;
    if (error || !data?.me || !data?.friend) return <p className="text-xs text-white/30 py-4 text-center">Dados de comparação não disponíveis.</p>;

    const { me, friend } = data;
    const myPct    = Math.round(me.moodScore * 100);
    const themPct  = Math.round(friend.moodScore * 100);
    const diff     = Math.abs(myPct - themPct);
    const harmony  = 100 - diff;

    // Emoções em comum — top 4 das minhas vs top 4 deles
    const myTop    = Object.entries(me.emotions ?? {}).sort((a,b) => b[1]-a[1]).slice(0,4).map(([k]) => k);
    const themTop  = Object.entries(friend.emotions ?? {}).sort((a,b) => b[1]-a[1]).slice(0,4).map(([k]) => k);
    const shared   = myTop.filter(k => themTop.includes(k));

    // Todas as emoções para comparação lado-a-lado
    const allKeys  = Array.from(new Set([...myTop, ...themTop]));

    return (
        <div className="flex flex-col gap-4 pt-3">

            {/* Harmonia */}
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] uppercase tracking-widest text-white/35" style={{ fontFamily: "var(--font-display)" }}>Harmonia emocional</span>
                    <span className="text-sm font-black" style={{ color: harmony >= 70 ? "#00ffb3" : harmony >= 40 ? "#a259ff" : "#ff2d87", fontFamily: "var(--font-display)" }}>{harmony}%</span>
                </div>
                <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${harmony}%`, background: "linear-gradient(90deg,#00ffb3,#a259ff)" }} />
                </div>
            </div>

            {/* Scores lado a lado */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "rgba(0,255,179,0.05)", border: "1px solid rgba(0,255,179,0.12)" }}>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>Você</span>
                    <span className="text-xl font-black" style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>{myPct}%</span>
                    <span className="text-[10px] text-white/40 truncate">{me.sentiment}</span>
                </div>
                <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "rgba(162,89,255,0.05)", border: "1px solid rgba(162,89,255,0.12)" }}>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: "#a259ff", fontFamily: "var(--font-display)" }}>{friendName}</span>
                    <span className="text-xl font-black" style={{ color: "#a259ff", fontFamily: "var(--font-display)" }}>{themPct}%</span>
                    <span className="text-[10px] text-white/40 truncate">{friend.sentiment}</span>
                </div>
            </div>

            {/* Emoções compartilhadas */}
            {shared.length > 0 && (
                <div>
                    <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Em sintonia ({shared.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {shared.map(e => (
                            <span key={e} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                style={{ background: "rgba(0,255,179,0.1)", color: "#00ffb3", border: "1px solid rgba(0,255,179,0.2)" }}>
                                {e}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Barras comparativas */}
            <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-white/30 block" style={{ fontFamily: "var(--font-display)" }}>Comparação</span>
                {allKeys.slice(0, 6).map(key => {
                    const myVal    = (me.emotions?.[key] ?? 0) * 100;
                    const themVal  = (friend.emotions?.[key] ?? 0) * 100;
                    return (
                        <div key={key} className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-white/30 capitalize">{key}</span>
                            <div className="flex items-center gap-2">
                                {/* Barra você */}
                                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${myVal}%`, background: "#00ffb3" }} />
                                </div>
                                {/* Barra amigo */}
                                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${themVal}%`, background: "#a259ff" }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="flex gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: "#00ffb3" }} />
                        <span className="text-[9px] text-white/30">Você</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: "#a259ff" }} />
                        <span className="text-[9px] text-white/30">{friendName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Card de amigo expandível ─────────────────────────────────────────────────

function FriendCard({ friend, onRemove, actionLoading }: {
    friend: Friend;
    onRemove: (id: string) => void;
    actionLoading: string | null;
}) {
    const [expanded, setExpanded] = useState(false);
    const [panel, setPanel] = useState<FriendPanel>(null);

    const panels = [
        { key: "mood" as FriendPanel,      icon: <Smile className="w-3 h-3" />,    label: "Mood"       },
        { key: "listening" as FriendPanel, icon: <Radio className="w-3 h-3" />,    label: "Ouvindo"    },
        { key: "compare" as FriendPanel,   icon: <BarChart2 className="w-3 h-3" />, label: "Comparar"  },
    ];

    function togglePanel(key: FriendPanel) {
        if (panel === key) { setPanel(null); }
        else { setPanel(key); setExpanded(true); }
    }

    return (
        <li className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>

            {/* Linha principal */}
            <div className="flex items-center gap-3 px-4 py-3">
                <Avatar src={friend.img_profile} name={friend.display_name} size={10} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90 truncate" style={{ fontFamily: "var(--font-display)" }}>
                        {friend.display_name}
                    </p>
                    <p className="text-xs text-white/30">{friend.country}</p>
                </div>

                <ActionBtn variant="danger" onClick={() => onRemove(friend.friendshipId)} disabled={actionLoading === friend.friendshipId}>
                    <UserMinus className="w-3 h-3" />
                </ActionBtn>

                <button
                    onClick={() => setExpanded(p => !p)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-all text-white/30 hover:text-white/70"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                >
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300"
                        style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
            </div>

            {/* Área expandida */}
            {expanded && (
                <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {/* Botões de painel */}
                    <div className="flex gap-1.5 pt-3">
                        {panels.map(p => (
                            <button key={p.key as string}
                                onClick={() => togglePanel(p.key)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                                style={{
                                    background: panel === p.key ? "rgba(0,255,179,0.1)" : "rgba(255,255,255,0.04)",
                                    border: panel === p.key ? "1px solid rgba(0,255,179,0.25)" : "1px solid rgba(255,255,255,0.07)",
                                    color: panel === p.key ? "#00ffb3" : "rgba(255,255,255,0.45)",
                                }}>
                                {p.icon}{p.label}
                            </button>
                        ))}
                    </div>

                    {/* Conteúdo do painel */}
                    {panel === "mood"      && <FriendMoodPanel      friendId={friend.id} />}
                    {panel === "listening" && <FriendListeningPanel  friendId={friend.id} />}
                    {panel === "compare"   && <CompareMoodPanel      friendId={friend.id} friendName={friend.display_name.split(" ")[0]} />}
                </div>
            )}
        </li>
    );
}

// ─── Skeletons & Empty ────────────────────────────────────────────────────────

function FriendsSkeleton() {
    return (
        <ul className="flex flex-col gap-2 animate-pulse">
            {[1, 2, 3].map(i => (
                <li key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="w-10 h-10 rounded-full bg-white/[0.07]" />
                    <div className="flex-1 flex flex-col gap-1.5">
                        <div className="h-3 bg-white/[0.07] rounded-full w-36" />
                        <div className="h-2 bg-white/[0.04] rounded-full w-20" />
                    </div>
                    <div className="h-7 w-7 bg-white/[0.05] rounded-lg" />
                </li>
            ))}
        </ul>
    );
}

function EmptyState({ icon, message, sub, action }: {
    icon: React.ReactNode; message: string; sub: string;
    action?: { label: string; onClick: () => void };
}) {
    return (
        <div className="flex flex-col items-center py-10 gap-3 text-center">
            <div className="text-white/15">{icon}</div>
            <p className="text-sm font-semibold text-white/50">{message}</p>
            <p className="text-xs text-white/25">{sub}</p>
            {action && (
                <button onClick={action.onClick} className="mt-2 text-xs font-semibold text-[#00ffb3] hover:text-[#00ffb3]/80 transition-colors">
                    {action.label} →
                </button>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FriendsPage() {
    const [tab, setTab] = useState<Tab>("friends");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const notify = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

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
            notify("Solicitação enviada!");
        } catch { notify("Não foi possível enviar a solicitação.", false); }
        finally { setActionLoading(null); }
    }, []);

    const handleRespond = useCallback(async (friendshipId: string, accept: boolean) => {
        setActionLoading(friendshipId);
        try {
            await respondFriendRequest(friendshipId, accept);
            setRequests(prev => prev.filter(r => r.id !== friendshipId));
            if (accept) { getFriends().then(setFriends).catch(() => {}); notify("Amizade aceita! 🎉"); }
            else { notify("Solicitação recusada."); }
        } catch { notify("Erro ao responder solicitação.", false); }
        finally { setActionLoading(null); }
    }, []);

    const handleRemoveFriend = useCallback(async (friendshipId: string) => {
        setActionLoading(friendshipId);
        try {
            await removeFriend(friendshipId);
            setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
            notify("Amigo removido.");
        } catch { notify("Erro ao remover amigo.", false); }
        finally { setActionLoading(null); }
    }, []);

    const tabs = [
        { key: "friends"  as Tab, label: "Amigos",       icon: <Users className="w-3.5 h-3.5" />  },
        { key: "requests" as Tab, label: "Solicitações",  icon: <Clock className="w-3.5 h-3.5" />, badge: requests.length },
        { key: "search"   as Tab, label: "Buscar",        icon: <Search className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="min-h-screen text-white/90 antialiased" style={{ fontFamily: "var(--font-body)" }}>
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(circle, #00ffb3, transparent 70%)" }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(circle, #ff2d87, transparent 70%)" }} />
            </div>

            <header className="sticky top-0 z-50 flex justify-between items-center px-5 md:px-8 py-3.5"
                style={{ background: "rgba(7,7,12,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <AppBrand className="text-xl" />
                <Link href="/dashboard" className="text-xs text-white/40 hover:text-white/70 transition-colors">← Dashboard</Link>
            </header>

            <main className="max-w-[640px] mx-auto px-4 md:px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>Amigos</h1>
                    <p className="text-sm text-white/40 mt-1">Veja o que seus amigos estão ouvindo.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.key ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"}`}>
                            {t.icon}{t.label}
                            {t.badge && t.badge > 0 ? (
                                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[#ff2d87] text-white text-[9px] font-black flex items-center justify-center">{t.badge}</span>
                            ) : null}
                        </button>
                    ))}
                </div>

                {/* ── FRIENDS ── */}
                {tab === "friends" && (
                    <SectionCard title="Seus Amigos" icon={<Users />} accentColor="#00ffb3" iconColor="text-[#00ffb3]">
                        {loadingFriends ? <FriendsSkeleton /> : friends.length === 0 ? (
                            <EmptyState icon={<UserPlus className="w-8 h-8" />} message="Nenhum amigo ainda."
                                sub="Busque pessoas pelo nome e envie uma solicitação."
                                action={{ label: "Buscar amigos", onClick: () => setTab("search") }} />
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {friends.map(f => (
                                    <FriendCard key={f.friendshipId} friend={f} onRemove={handleRemoveFriend} actionLoading={actionLoading} />
                                ))}
                            </ul>
                        )}
                    </SectionCard>
                )}

                {/* ── REQUESTS ── */}
                {tab === "requests" && (
                    <SectionCard title="Solicitações" icon={<Clock />} accentColor="#ff2d87" iconColor="text-[#ff2d87]">
                        {loadingRequests ? <FriendsSkeleton /> : requests.length === 0 ? (
                            <EmptyState icon={<Check className="w-8 h-8" />} message="Nenhuma solicitação pendente." sub="Quando alguém te adicionar, vai aparecer aqui." />
                        ) : (
                            <ul className="flex flex-col divide-y divide-white/[0.04]">
                                {requests.map(r => (
                                    <li key={r.id} className="flex items-center gap-3 py-3">
                                        <Avatar src={r.requester.img_profile} name={r.requester.display_name} size={10} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white/90 truncate">{r.requester.display_name}</p>
                                            <p className="text-xs text-white/30">{r.requester.country}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <ActionBtn variant="success" onClick={() => handleRespond(r.id, true)} disabled={actionLoading === r.id}><Check className="w-3 h-3" /></ActionBtn>
                                            <ActionBtn variant="danger"  onClick={() => handleRespond(r.id, false)} disabled={actionLoading === r.id}><X className="w-3 h-3" /></ActionBtn>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>
                )}

                {/* ── SEARCH ── */}
                {tab === "search" && (
                    <SectionCard title="Buscar Pessoas" icon={<Search />} accentColor="#a259ff" iconColor="text-[#a259ff]">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <Search className="w-4 h-4 text-white/30 shrink-0" />
                            <input autoFocus type="text" value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Buscar pelo nome..."
                                className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/30 outline-none" />
                            {loadingSearch && <Loader2 className="w-4 h-4 text-white/30 animate-spin shrink-0" />}
                        </div>

                        {searchQuery.trim().length < 2 ? (
                            <p className="text-xs text-white/30 text-center py-6">Digite pelo menos 2 caracteres para buscar.</p>
                        ) : searchResults.length === 0 && !loadingSearch ? (
                            <p className="text-xs text-white/30 text-center py-6">Nenhum usuário encontrado.</p>
                        ) : (
                            <ul className="flex flex-col divide-y divide-white/[0.04]">
                                {searchResults.map(u => (
                                    <li key={u.id} className="flex items-center gap-3 py-3">
                                        <Avatar src={u.img_profile} name={u.display_name} size={10} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white/90 truncate">{u.display_name}</p>
                                            <p className="text-xs text-white/30">{u.country}</p>
                                        </div>
                                        {u.friendshipStatus === "ACCEPTED" ? (
                                            <span className="text-xs text-[#00ffb3]/70 font-semibold">Amigos ✓</span>
                                        ) : u.friendshipStatus === "PENDING" ? (
                                            <span className="text-xs text-white/30 font-semibold">Pendente…</span>
                                        ) : (
                                            <ActionBtn variant="primary" onClick={() => handleSendRequest(u.id)} disabled={actionLoading === u.id}>
                                                <UserPlus className="w-3 h-3" />Adicionar
                                            </ActionBtn>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>
                )}
            </main>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl z-50 ${toast.ok ? "bg-[#00ffb3]/10 border border-[#00ffb3]/30 text-[#00ffb3]" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                    {toast.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
