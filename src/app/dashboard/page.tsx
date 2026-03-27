"use client";

import { useState } from "react";
import { Zap, Sparkles, Radio } from "lucide-react";

import { AppBrand } from "@/shared/components/AppBrand";
import { SectionCard } from "@/shared/components/SectionCard";
import { FriendsView } from "@/shared/components/FriendsView";

import { Header } from "./components/Header";
import { BottomNav, type DashTab } from "./components/BottomNav";
import { FeedTab } from "./components/feed/FeedTab";
import Profile from "./components/Profile";
import RecentSongs from "./components/RecentsSongs";
import { NowPlayingCard } from "./components/NowPlayingCard";
import { InsightsSection } from "./components/InsightsSection";
import { EmotionalCardChart } from "./components/EmotionalCardGraphicChart";

// ─── Background ───────────────────────────────────────────────────────────────

function Blobs() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
                style={{ background: "radial-gradient(circle, #00ffb3, transparent 70%)" }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
                style={{ background: "radial-gradient(circle, #ff2d87, transparent 70%)" }} />
            <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full opacity-[0.025]"
                style={{ background: "radial-gradient(circle, #a259ff, transparent 70%)" }} />
        </div>
    );
}

// ─── Header mobile ────────────────────────────────────────────────────────────

function MobileHeader({ tab }: { tab: DashTab }) {
    const labels: Record<DashTab, string> = {
        feed:    "Feed",
        playing: "Tocando Agora",
        mix:     "Mix Emocional",
        friends: "Amigos",
        profile: "Meu Perfil",
    };
    return (
        <header
            className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 lg:hidden"
            style={{
                background: "rgba(7,7,12,0.88)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            <AppBrand className="text-lg" />
            <div className="flex items-center gap-3">
                <span className="text-xs text-white/30 font-semibold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-display)" }}>
                    {labels[tab]}
                </span>
                <Header />
            </div>
        </header>
    );
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────

const SIDEBAR_TABS: { key: DashTab; label: string; icon: React.ReactNode }[] = [
    { key: "feed",    label: "Feed",          icon: <span className="text-base">⊞</span> },
    { key: "profile", label: "Meu Perfil",    icon: <span className="text-base">◎</span> },
    { key: "playing", label: "Tocando Agora", icon: <span className="text-base">♪</span> },
    { key: "mix",     label: "Mix Emocional", icon: <Sparkles className="w-4 h-4" /> },
    { key: "friends", label: "Amigos",        icon: <span className="text-base">◈</span> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [tab, setTab] = useState<DashTab>("feed");

    return (
        <div className="min-h-screen text-white/90 antialiased" style={{ fontFamily: "var(--font-body)" }}>
            <Blobs />

            {/* ── MOBILE ── */}
            <div className="lg:hidden flex flex-col min-h-screen">
                <MobileHeader tab={tab} />

                <main className="flex-1 px-4 py-5 pb-[calc(72px+env(safe-area-inset-bottom))]">

                    {tab === "feed" && (
                        <div className="max-w-xl mx-auto">
                            <FeedTab />
                        </div>
                    )}

                    {tab === "profile" && (
                        <div className="flex flex-col gap-4 max-w-xl mx-auto">
                            <div className="min-h-[340px]"><Profile /></div>
                            <InsightsSection />
                            <SectionCard
                                title="Últimas Faixas"
                                icon={<Zap fill="currentColor" />}
                                iconColor="text-brand-primary"
                                accentColor="#00ffb3"
                            >
                                <RecentSongs compact />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "playing" && (
                        <div className="max-w-xl mx-auto">
                            <SectionCard
                                title="Tocando Agora"
                                icon={<Radio />}
                                iconColor="text-brand-primary"
                                accentColor="#00ffb3"
                                noPadding
                                className="min-h-[260px]"
                            >
                                <NowPlayingCard />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "mix" && (
                        <div className="max-w-xl mx-auto">
                            <SectionCard
                                icon={<Sparkles />}
                                title="Mix Emocional"
                                iconColor="text-brand-secondary"
                                accentColor="#ff2d87"
                                className="min-h-[400px]"
                            >
                                <EmotionalCardChart />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "friends" && (
                        <div className="max-w-xl mx-auto">
                            <FriendsView />
                        </div>
                    )}
                </main>

                <BottomNav active={tab} onChange={setTab} />
            </div>

            {/* ── DESKTOP ── */}
            <div className="hidden lg:flex min-h-screen">

                {/* Sidebar */}
                <aside
                    className="w-64 shrink-0 sticky top-0 h-screen flex flex-col py-6 px-4 gap-1"
                    style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <div className="px-3 mb-6">
                        <AppBrand className="text-xl" />
                    </div>

                    {SIDEBAR_TABS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left w-full"
                            style={{
                                background: tab === t.key ? "rgba(0,255,179,0.08)" : "transparent",
                                border: tab === t.key ? "1px solid rgba(0,255,179,0.18)" : "1px solid transparent",
                                color: tab === t.key ? "#00ffb3" : "rgba(255,255,255,0.4)",
                            }}
                        >
                            <span className={tab === t.key ? "opacity-100" : "opacity-50"}>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}

                    <div className="mt-auto px-3">
                        <Header />
                    </div>
                </aside>

                {/* Conteúdo */}
                <main className="flex-1 min-w-0 px-6 py-6 overflow-y-auto">

                    {tab === "feed" && (
                        <div className="max-w-2xl mx-auto">
                            <h1 className="text-lg font-black uppercase tracking-tight text-white mb-5"
                                style={{ fontFamily: "var(--font-display)" }}>Feed</h1>
                            <FeedTab />
                        </div>
                    )}

                    {tab === "profile" && (
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-5 flex flex-col gap-5">
                                <div className="min-h-[320px]"><Profile /></div>
                                <InsightsSection />
                            </div>
                            <div className="col-span-7">
                                <SectionCard
                                    title="Últimas Faixas"
                                    icon={<Zap fill="currentColor" />}
                                    iconColor="text-brand-primary"
                                    accentColor="#00ffb3"
                                    className="h-full min-h-[560px]"
                                >
                                    <RecentSongs compact />
                                </SectionCard>
                            </div>
                        </div>
                    )}

                    {tab === "playing" && (
                        <div className="max-w-2xl">
                            <h1 className="text-lg font-black uppercase tracking-tight text-white mb-5"
                                style={{ fontFamily: "var(--font-display)" }}>Tocando Agora</h1>
                            <SectionCard
                                title="Tocando Agora"
                                icon={<Radio />}
                                iconColor="text-brand-primary"
                                accentColor="#00ffb3"
                                noPadding
                                className="min-h-[300px]"
                            >
                                <NowPlayingCard />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "mix" && (
                        <div className="max-w-3xl">
                            <h1 className="text-lg font-black uppercase tracking-tight text-white mb-5"
                                style={{ fontFamily: "var(--font-display)" }}>Mix Emocional</h1>
                            <SectionCard
                                icon={<Sparkles />}
                                title="Mix Emocional"
                                iconColor="text-brand-secondary"
                                accentColor="#ff2d87"
                                className="min-h-[480px]"
                            >
                                <EmotionalCardChart />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "friends" && (
                        <div className="max-w-2xl">
                            <h1 className="text-lg font-black uppercase tracking-tight text-white mb-5"
                                style={{ fontFamily: "var(--font-display)" }}>Amigos</h1>
                            <FriendsView />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
