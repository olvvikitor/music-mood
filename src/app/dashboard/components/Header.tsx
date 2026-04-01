"use client"
import { UserCircle, Crown, ChevronDown, Users, LogOut, Sun, Moon, Coins } from "lucide-react"
import { useProfile } from "../hooks/useProfile"
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getPendingRequests } from "@/shared/services/friendService";
import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { getCreditBalance } from "@/shared/services/creditService";
import { CreditModal } from "@/shared/components/CreditModal";

export function Header() {
    const { data, isError, isLoading } = useProfile()
    const [pendingCount, setPendingCount] = useState(0)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [spinning, setSpinning] = useState(false)
    const [isCreditOpen, setIsCreditOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { theme, toggle } = useTheme()
    
    // Saldo de créditos
    const { data: creditData, refetch: refetchBalance } = useQuery({
        queryKey: ["creditBalance"],
        queryFn: getCreditBalance,
        staleTime: 30_000,
    })
    const balance = creditData?.balance ?? 0

    useEffect(() => {
        getPendingRequests()
            .then((reqs) => setPendingCount(reqs.length))
            .catch(() => {})
    }, [])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function handleLogout() {
        localStorage.removeItem("auth_token")
        router.push("/login")
    }

    function handleToggleTheme() {
        setSpinning(true)
        toggle()
        setTimeout(() => setSpinning(false), 400)
    }

    const isLight = theme === "light"

    // Estilos adaptativos por tema
    const pillBg       = isLight ? "rgba(0,0,0,0.05)"  : "rgba(255,255,255,0.04)"
    const pillBorder   = isLight ? "rgba(0,0,0,0.09)"  : "rgba(255,255,255,0.08)"
    const pillBgHover  = isLight ? "rgba(0,0,0,0.08)"  : "rgba(255,255,255,0.07)"
    const pillBorHover = isLight ? "rgba(0,0,0,0.14)"  : "rgba(255,255,255,0.12)"
    const textColor    = isLight ? "rgba(15,15,20,0.55)" : "rgba(255,255,255,0.50)"
    const textHover    = isLight ? "rgba(15,15,20,0.90)" : "rgba(255,255,255,0.90)"
    const dropBg       = isLight ? "rgba(255,255,255,0.98)" : "rgba(14,14,22,0.97)"
    const dropBorder   = isLight ? "rgba(0,0,0,0.09)"      : "rgba(255,255,255,0.09)"
    const dropShadow   = isLight ? "0 16px 48px rgba(0,0,0,0.12)" : "0 16px 48px rgba(0,0,0,0.5)"
    const nameColor    = isLight ? "rgba(15,15,20,0.85)"  : "rgba(255,255,255,0.85)"
    const subColor     = isLight ? "rgba(15,15,20,0.40)"  : "rgba(255,255,255,0.30)"
    const chevColor    = isLight ? "rgba(15,15,20,0.25)"  : "rgba(255,255,255,0.25)"
    const divColor     = isLight ? "rgba(0,0,0,0.06)"     : "rgba(255,255,255,0.06)"
    const crownBorder  = isLight ? "#f4f4f8" : "#07070c"

    if (isLoading) return <LoadingComponent type="header" />;
    if (isError || !data) return <ErrorComponent type="header" />;

    return (
        <div className="flex items-center gap-2">

            {/* Botao Amigos */}
            <Link
                href="/friends"
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{ background: pillBg, border: `1px solid ${pillBorder}`, color: textColor }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = pillBgHover;
                    el.style.borderColor = pillBorHover;
                    el.style.color = textHover;
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = pillBg;
                    el.style.borderColor = pillBorder;
                    el.style.color = textColor;
                }}
            >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Amigos</span>
                {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white"
                        style={{ background: "#b06a85" }}>
                        {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                )}
            </Link>

            {/* Botao Créditos */}
            <button
                onClick={() => setIsCreditOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{ background: pillBg, border: `1px solid ${pillBorder}`, color: textColor }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = pillBgHover;
                    el.style.borderColor = pillBorHover;
                    el.style.color = textHover;
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = pillBg;
                    el.style.borderColor = pillBorder;
                    el.style.color = textColor;
                }}
                title="Comprar créditos"
            >
                <Coins className="w-3.5 h-3.5" style={{ color: "#ffd700" }} />
                <span className="hidden sm:inline" style={{ color: "#ffd700", fontWeight: 600 }}>{balance}</span>
            </button>

            {/* Botao de tema */}
            <button
                onClick={handleToggleTheme}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                    background: pillBg,
                    border: `1px solid ${pillBorder}`,
                    color: textColor,
                }}
                title={isLight ? "Mudar para tema escuro" : "Mudar para tema claro"}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = pillBgHover;
                    el.style.borderColor = pillBorHover;
                    el.style.color = textHover;
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = pillBg;
                    el.style.borderColor = pillBorder;
                    el.style.color = textColor;
                }}
            >
                <span className={spinning ? "theme-toggle-spin" : ""} style={{ display: "flex" }}>
                    {isLight
                        ? <Moon className="w-3.5 h-3.5" />
                        : <Sun className="w-3.5 h-3.5" />
                    }
                </span>
            </button>

            {/* â”€â”€ Avatar / perfil com dropdown â”€â”€ */}
            <div className="relative" ref={dropdownRef}>
                <div
                    className="group flex items-center gap-2.5 cursor-pointer pl-1 pr-3.5 py-1 rounded-full transition-all duration-300 select-none"
                    onClick={() => setDropdownOpen(prev => !prev)}
                    style={{
                        background: dropdownOpen ? pillBgHover : pillBg,
                        border: `1px solid ${dropdownOpen ? pillBorHover : pillBorder}`,
                    }}
                    onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.background = pillBgHover;
                        el.style.borderColor = pillBorHover;
                    }}
                    onMouseLeave={e => {
                        if (!dropdownOpen) {
                            const el = e.currentTarget as HTMLDivElement;
                            el.style.background = pillBg;
                            el.style.borderColor = pillBorder;
                        }
                    }}
                >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        {data?.img_profile ? (
                            <img
                                src={data.img_profile}
                                className="w-8 h-8 rounded-full object-cover"
                                style={{ border: "1.5px solid rgba(111,174,155,0.3)" }}
                                alt="Profile"
                            />
                        ) : (
                            <UserCircle className="w-8 h-8" style={{ color: textColor }} />
                        )}
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                            style={{ background: "#6fae9b", border: `1.5px solid ${crownBorder}` }}>
                            <Crown className="w-1.5 h-1.5 text-black" />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="flex-col leading-none hidden sm:flex">
                        <span className="text-[13px] transition-colors"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: nameColor }}>
                            {data?.display_name?.split(" ")[0] || "Usuario"}
                        </span>
                        <span className="text-[9px] font-800 uppercase tracking-widest mt-0.5"
                            style={{ color: "#6fae9b", fontFamily: "var(--font-display)" }}>
                            PRO
                        </span>
                    </div>

                    <ChevronDown
                        className="w-3.5 h-3.5 transition-all duration-300"
                        style={{
                            color: chevColor,
                            transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div
                        className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl overflow-hidden z-50"
                        style={{
                            background: dropBg,
                            border: `1px solid ${dropBorder}`,
                            boxShadow: dropShadow,
                            animation: "fadeSlideDown 0.15s ease-out both",
                        }}
                    >
                        {/* Info */}
                        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${divColor}` }}>
                            <p className="text-xs font-semibold truncate"
                                style={{ fontFamily: "var(--font-display)", color: nameColor }}>
                                {data.display_name}
                            </p>
                            <p className="text-[10px] truncate mt-0.5" style={{ color: subColor }}>
                                {data.email}
                            </p>
                        </div>

                        {/* Toggle tema no dropdown tambem */}
                        <div className="px-2 pt-2" style={{ borderBottom: `1px solid ${divColor}` }}>
                            <button
                                onClick={handleToggleTheme}
                                className="w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 mb-1"
                                style={{ color: nameColor }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)"}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                            >
                                <div className="flex items-center gap-2.5">
                                    {isLight
                                        ? <Moon className="w-3.5 h-3.5 shrink-0" />
                                        : <Sun className="w-3.5 h-3.5 shrink-0" />
                                    }
                                    {isLight ? "Tema escuro" : "Tema claro"}
                                </div>
                                {/* Toggle visual */}
                                <div
                                    className="w-8 h-4 rounded-full relative transition-all duration-300 shrink-0"
                                    style={{ background: isLight ? "rgba(0,0,0,0.12)" : "#6fae9b" }}
                                >
                                    <div
                                        className="absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300"
                                        style={{
                                            background: isLight ? "rgba(0,0,0,0.4)" : "#07070c",
                                            left: isLight ? "2px" : "18px",
                                        }}
                                    />
                                </div>
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="p-1.5">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-red-500/80 hover:text-red-500 hover:bg-red-500/10"
                            >
                                <LogOut className="w-3.5 h-3.5 shrink-0" />
                                Sair da conta
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)  scale(1);    }
                }
            `}</style>

            {/* Modal de Créditos */}
            {isCreditOpen && (
                <CreditModal
                    noCredits={false}
                    onClose={() => setIsCreditOpen(false)}
                    onPurchased={() => void refetchBalance()}
                />
            )}
        </div>
    )
}

