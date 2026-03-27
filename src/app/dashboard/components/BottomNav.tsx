"use client";

import { Users, LayoutGrid, Radio, Sparkles, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getPendingRequests } from "@/shared/services/friendService";

export type DashTab = "feed" | "playing" | "mix" | "profile" | "friends";

interface BottomNavProps {
    active: DashTab;
    onChange: (tab: DashTab) => void;
}

const TABS: { key: DashTab; icon: React.ReactNode; label: string }[] = [
    { key: "feed",    icon: <LayoutGrid className="w-5 h-5" />,    label: "Feed"    },
    { key: "playing", icon: <Radio className="w-5 h-5" />,         label: "Playing" },
    { key: "mix",     icon: <Sparkles className="w-5 h-5" />,      label: "Mix"     },
    { key: "friends", icon: <Users className="w-5 h-5" />,         label: "Amigos"  },
    { key: "profile", icon: <UserCircle className="w-5 h-5" />,    label: "Perfil"  },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        getPendingRequests().then(r => setPendingCount(r.length)).catch(() => {});
    }, []);

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 flex items-center lg:hidden"
            style={{
                background: "rgba(7,7,12,0.92)",
                backdropFilter: "blur(24px)",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                paddingBottom: "env(safe-area-inset-bottom)",
            }}
        >
            {TABS.map(tab => {
                const isActive = active === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onChange(tab.key)}
                        className="relative flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-200"
                        style={{ color: isActive ? "#00ffb3" : "rgba(255,255,255,0.3)" }}
                    >
                        {/* Ativo: dot + glow sutil */}
                        {isActive && (
                            <span
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                                style={{ background: "#00ffb3", boxShadow: "0 0 8px #00ffb3" }}
                            />
                        )}

                        <span className="relative">
                            {tab.icon}
                            {/* Badge amigos */}
                            {tab.key === "friends" && pendingCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-black"
                                    style={{ background: "#ff2d87" }}
                                >
                                    {pendingCount > 9 ? "9+" : pendingCount}
                                </span>
                            )}
                        </span>

                        <span
                            className="text-[9px] uppercase tracking-widest font-semibold"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
