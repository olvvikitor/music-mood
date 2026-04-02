"use client";

import { useState } from "react";
import { Zap, Sparkles, Radio, LayoutGrid, UserCircle } from "lucide-react";

import { AppBrand } from "@/shared/components/AppBrand";
import { SectionCard } from "@/shared/components/SectionCard";
import { FriendsView } from "@/shared/components/FriendsView";
import { useTheme } from "@/shared/providers/ThemeProvider";

import { Header } from "./components/Header";
import { BottomNav, type DashTab } from "./components/BottomNav";
import { FeedTab } from "./components/feed/FeedTab";
import Profile from "./components/Profile";
import RecentSongs from "./components/RecentsSongs";
import { NowPlayingCard } from "./components/NowPlayingCard";
import { InsightsSection } from "./components/InsightsSection";
import { EmotionalCardChart } from "./components/EmotionalCardGraphicChart";
import { ProfileStats } from "./components/ProfileStats";

// ─── Background blobs ─────────────────────────────────────────────────────────

function Blobs() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
                style={{ background: "radial-gradient(circle, var(--blob-1), transparent 70%)" }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full"
                style={{ background: "radial-gradient(circle, var(--blob-2), transparent 70%)" }} />
            <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full"
                style={{ background: "radial-gradient(circle, var(--blob-3), transparent 70%)" }} />
        </div>
    );
}

// ─── Header mobile ────────────────────────────────────────────────────────────

function MobileHeader() {
    return (
        <header
            className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 lg:hidden"
            style={{
                background: "var(--header-bg)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid var(--border-subtle)",
            }}
        >
            <AppBrand className="text-lg" />
            <Header />
        </header>
    );
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────

const SIDEBAR_TABS: { key: DashTab; label: string; icon: React.ReactNode }[] = [
    { key: "feed",    label: "Feed",          icon: <LayoutGrid className="w-4 h-4" /> },
    { key: "profile", label: "Meu Perfil",    icon: <UserCircle className="w-4 h-4" /> },
    { key: "playing", label: "Tocando Agora", icon: <Radio className="w-4 h-4" /> },
    { key: "mix",     label: "Mix Emocional", icon: <Sparkles className="w-4 h-4" /> },
];

// ─── Conteúdo da aba Perfil ───────────────────────────────────────────────────

function ProfileTab() {
    return (
        <div className="flex flex-col gap-6">
            {/* Card de perfil + mood atual */}
            <div className="min-h-[340px]"><Profile /></div>

            {/* Insight do dia */}
            <InsightsSection />

            {/* Estatísticas gerais */}
            <ProfileStats />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [tab, setTab] = useState<DashTab>("profile");
    const { theme } = useTheme();
    const isLight = theme === "light";

    const sidebarBorder       = isLight ? "rgba(0,0,0,0.07)"         : "rgba(255,255,255,0.06)";
    const sidebarActiveBg     = isLight ? "rgba(0,196,160,0.08)"     : "rgba(0,255,179,0.08)";
    const sidebarActiveBorder = isLight ? "rgba(0,196,160,0.20)"     : "rgba(0,255,179,0.18)";
    const sidebarActiveColor  = "#00c4a0";
    const sidebarInactiveColor = isLight ? "rgba(15,15,20,0.45)"     : "rgba(255,255,255,0.4)";

    return (
        <div className="min-h-screen antialiased" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
            <Blobs />

            {/* ── MOBILE ── */}
            <div className="lg:hidden flex flex-col min-h-screen">
                <MobileHeader />

                <main className="flex-1 px-4 py-5 pb-[calc(80px+env(safe-area-inset-bottom))]">

                    {tab === "feed" && (
                        <div className="max-w-xl mx-auto"><FeedTab /></div>
                    )}

                    {tab === "profile" && (
                        <div className="max-w-xl mx-auto"><ProfileTab /></div>
                    )}

                    {tab === "playing" && (
                        <div className="max-w-xl mx-auto flex flex-col gap-4">
                            <SectionCard title="Tocando Agora" icon={<Radio />}
                                iconColor="text-brand-primary" accentColor="#6fae9b"
                                noPadding className="min-h-[260px]">
                                <NowPlayingCard />
                            </SectionCard>
                            <SectionCard title="Últimas Faixas" icon={<Zap fill="currentColor" />}
                                iconColor="text-brand-primary" accentColor="#6fae9b">
                                <RecentSongs compact />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "mix" && (
                        <div className="max-w-xl mx-auto">
                            <SectionCard icon={<Sparkles />} title="Mix Emocional"
                                iconColor="text-brand-secondary" accentColor="#b06a85"
                                className="min-h-[400px]">
                                <EmotionalCardChart />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "friends" && (
                        <div className="max-w-xl mx-auto"><FriendsView /></div>
                    )}
                </main>

                <BottomNav active={tab} onChange={setTab} />
            </div>

            {/* ── DESKTOP ── */}
            <div className="hidden lg:flex min-h-screen">

                {/* Sidebar */}
                <aside
                    className="w-64 shrink-0 sticky top-0 h-screen flex flex-col py-6 px-4 gap-1"
                    style={{ borderRight: `1px solid ${sidebarBorder}` }}
                >
                    <div className="px-3 mb-6"><AppBrand className="text-xl" /></div>

                    {SIDEBAR_TABS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left w-full"
                            style={{
                                background: tab === t.key ? sidebarActiveBg : "transparent",
                                border: tab === t.key ? `1px solid ${sidebarActiveBorder}` : "1px solid transparent",
                                color: tab === t.key ? sidebarActiveColor : sidebarInactiveColor,
                            }}
                        >
                            <span style={{ opacity: tab === t.key ? 1 : 0.5 }}>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </aside>

                {/* Conteúdo */}
                <main className="flex-1 min-w-0 px-6 py-6 overflow-y-auto">

                    {/* Top controls (desktop) */}
                    <div
                        className="sticky top-0 z-40 -mx-6 px-6 py-3 mb-4"
                    >
                        <div className="flex items-center justify-end">
                            <Header />
                        </div>
                    </div>

                    {tab === "feed" && (
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-lg font-black uppercase tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Feed</h1>
                            <FeedTab />
                        </div>
                    )}

                    {tab === "profile" && (
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-lg font-black uppercase tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Meu Perfil</h1>
                            {/* Desktop: 2 colunas */}
                            <div className="grid grid-cols-12 gap-6 items-start">
                                {/* Coluna esquerda */}
                                <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
                                    <div className="min-h-[380px]"><Profile /></div>
                                    <InsightsSection />
                                </div>
                                {/* Coluna direita */}
                                <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">
                                    <ProfileStats />
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "playing" && (
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-lg font-black uppercase tracking-tight"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Tocando Agora</h1>
                            <div className="grid grid-cols-12 gap-6 mt-5 items-start">
                                <div className="col-span-12 xl:col-span-7">
                                    <SectionCard title="Tocando Agora" icon={<Radio />}
                                        iconColor="text-brand-primary" accentColor="#6fae9b"
                                        noPadding className="min-h-[360px]">
                                        <NowPlayingCard />
                                    </SectionCard>
                                </div>
                                <div className="col-span-12 xl:col-span-5">
                                    <SectionCard title="Últimas Faixas" icon={<Zap fill="currentColor" />}
                                        iconColor="text-brand-primary" accentColor="#6fae9b"
                                        className="min-h-[540px]">
                                        <RecentSongs compact />
                                    </SectionCard>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "mix" && (
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-lg font-black uppercase tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Mix Emocional</h1>
                            <div className="grid grid-cols-12 gap-6 items-start">
                                <div className="col-span-12 xl:col-span-8">
                                    <SectionCard icon={<Sparkles />} title="Mix Emocional"
                                        iconColor="text-brand-secondary" accentColor="#b06a85"
                                        className="min-h-[520px]">
                                        <EmotionalCardChart />
                                    </SectionCard>
                                </div>
                                <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                                    <MoodWeekChart />
                                    <InsightsSection />
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "friends" && (
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-lg font-black uppercase tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Amigos</h1>
                            <FriendsView />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
