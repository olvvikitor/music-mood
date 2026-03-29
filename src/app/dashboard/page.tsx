"use client";

import { useState } from "react";
import { Zap, Sparkles, Radio } from "lucide-react";

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

// â”€â”€â”€ Background blobs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Header mobile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MobileHeader({ tab }: { tab: DashTab }) {
    const { theme } = useTheme();
    const isLight = theme === "light";

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
                background: "var(--header-bg)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid var(--border-subtle)",
            }}
        >
            <AppBrand className="text-lg" />
            <div className="flex items-center gap-3">
                <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
                >
                    {labels[tab]}
                </span>
                <Header />
            </div>
        </header>
    );
}

// â”€â”€â”€ Desktop sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SIDEBAR_TABS: { key: DashTab; label: string; icon: React.ReactNode }[] = [
    { key: "feed",    label: "Feed",          icon: <span className="text-base">âŠž</span> },
    { key: "profile", label: "Meu Perfil",    icon: <span className="text-base">â—Ž</span> },
    { key: "playing", label: "Tocando Agora", icon: <span className="text-base">â™ª</span> },
    { key: "mix",     label: "Mix Emocional", icon: <Sparkles className="w-4 h-4" /> },
    { key: "friends", label: "Amigos",        icon: <span className="text-base">â—ˆ</span> },
];

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Dashboard() {
    const [tab, setTab] = useState<DashTab>("feed");
    const { theme } = useTheme();
    const isLight = theme === "light";

    const sidebarBorder  = isLight ? "rgba(0,0,0,0.07)"  : "rgba(255,255,255,0.06)";
    const sidebarActiveBg     = isLight ? "rgba(111,174,155,0.08)" : "rgba(111,174,155,0.08)";
    const sidebarActiveBorder = isLight ? "rgba(111,174,155,0.20)" : "rgba(111,174,155,0.18)";
    const sidebarActiveColor  = "#00c4a0";
    const sidebarInactiveColor = isLight ? "rgba(15,15,20,0.45)" : "rgba(255,255,255,0.4)";

    return (
        <div className="min-h-screen antialiased" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
            <Blobs />

            {/* â”€â”€ MOBILE â”€â”€ */}
            <div className="lg:hidden flex flex-col min-h-screen">
                <MobileHeader tab={tab} />

                <main className="flex-1 px-4 py-5 pb-[calc(72px+env(safe-area-inset-bottom))]">

                    {tab === "feed" && (
                        <div className="max-w-xl mx-auto"><FeedTab /></div>
                    )}

                    {tab === "profile" && (
                        <div className="flex flex-col gap-4 max-w-xl mx-auto">
                            <div className="min-h-[340px]"><Profile /></div>
                            <InsightsSection />
                        </div>
                    )}

                    {tab === "playing" && (
                        <div className="max-w-xl mx-auto flex flex-col gap-4">
                            <SectionCard title="Tocando Agora" icon={<Radio />}
                                iconColor="text-brand-primary" accentColor="#6fae9b"
                                noPadding className="min-h-[260px]">
                                <NowPlayingCard />
                            </SectionCard>
                            <SectionCard title="Ultimas Faixas" icon={<Zap fill="currentColor" />}
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

            {/* â”€â”€ DESKTOP â”€â”€ */}
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

                    <div className="mt-auto px-3"><Header /></div>
                </aside>

                {/* Conteudo */}
                <main className="flex-1 min-w-0 px-6 py-6 overflow-y-auto">

                    {tab === "feed" && (
                        <div className="max-w-2xl mx-auto">
                            <h1 className="text-lg font-black uppercase tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Feed</h1>
                            <FeedTab />
                        </div>
                    )}

                    {tab === "profile" && (
                        <div className="max-w-2xl">
                            <h1 className="text-lg font-black uppercase tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Meu Perfil</h1>
                            <div className="flex flex-col gap-5">
                                <div className="min-h-[320px]"><Profile /></div>
                                <InsightsSection />
                            </div>
                        </div>
                    )}

                    {tab === "playing" && (
                        <div className="max-w-2xl flex flex-col gap-5">
                            <h1 className="text-lg font-black uppercase tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Tocando Agora</h1>
                            <SectionCard title="Tocando Agora" icon={<Radio />}
                                iconColor="text-brand-primary" accentColor="#6fae9b"
                                noPadding className="min-h-[300px]">
                                <NowPlayingCard />
                            </SectionCard>
                            <SectionCard title="Ultimas Faixas" icon={<Zap fill="currentColor" />}
                                iconColor="text-brand-primary" accentColor="#6fae9b"
                                className="min-h-[420px]">
                                <RecentSongs compact />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "mix" && (
                        <div className="max-w-3xl">
                            <h1 className="text-lg font-black uppercase tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Mix Emocional</h1>
                            <SectionCard icon={<Sparkles />} title="Mix Emocional"
                                iconColor="text-brand-secondary" accentColor="#b06a85"
                                className="min-h-[480px]">
                                <EmotionalCardChart />
                            </SectionCard>
                        </div>
                    )}

                    {tab === "friends" && (
                        <div className="max-w-2xl">
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

