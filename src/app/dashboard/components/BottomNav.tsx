"use client";

import { LayoutGrid, Radio, Sparkles, UserCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

export type DashTab = "feed" | "playing" | "mix" | "profile" | "friends";

interface BottomNavProps {
    active: DashTab;
    onChange: (tab: DashTab) => void;
}

const TABS: { key: DashTab; icon: React.ReactNode; label: string }[] = [
    { key: "profile", icon: <UserCircle className="w-5 h-5" />, label: "Perfil"  },
    { key: "feed",    icon: <LayoutGrid className="w-5 h-5" />, label: "Feed"    },
    { key: "playing", icon: <Radio className="w-5 h-5" />,      label: "Playing" },
    { key: "mix",     icon: <Sparkles className="w-5 h-5" />,   label: "Mix"     },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
    const { theme, toggle } = useTheme();
    const isLight = theme === "light";

    const navBg     = isLight ? "rgba(244,244,248,0.94)" : "rgba(7,7,12,0.92)";
    const navBorder = isLight ? "rgba(0,0,0,0.08)"       : "rgba(255,255,255,0.07)";
    const activeColor  = "#6fae9b";
    const inactiveColor = isLight ? "rgba(15,15,20,0.35)" : "rgba(255,255,255,0.3)";

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 flex items-center lg:hidden"
            style={{
                background: navBg,
                backdropFilter: "blur(24px)",
                borderTop: `1px solid ${navBorder}`,
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
                        style={{ color: isActive ? activeColor : inactiveColor }}
                    >
                        {isActive && (
                            <span
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                                style={{ background: activeColor, boxShadow: `0 0 8px ${activeColor}` }}
                            />
                        )}
                        <span className="relative">
                            {tab.icon}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest font-semibold"
                            style={{ fontFamily: "var(--font-display)" }}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}

            {/* Botao de tema - canto direito acima da nav */}
            <button
                onClick={toggle}
                className="absolute -top-10 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                style={{
                    background: isLight ? "rgba(255,255,255,0.95)" : "rgba(20,20,30,0.95)",
                    border: `1px solid ${navBorder}`,
                    color: isLight ? "rgba(15,15,20,0.60)" : "rgba(255,255,255,0.55)",
                    boxShadow: isLight
                        ? "0 4px 12px rgba(0,0,0,0.12)"
                        : "0 4px 12px rgba(0,0,0,0.5)",
                }}
                title={isLight ? "Tema escuro" : "Tema claro"}
            >
                {isLight
                    ? <Moon className="w-3.5 h-3.5" />
                    : <Sun className="w-3.5 h-3.5" />
                }
            </button>
        </nav>
    );
}

