"use client"
import { UserCircle, Crown, ChevronDown, Users, LogOut } from "lucide-react"
import { useProfile } from "../hooks/useProfile"
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getPendingRequests } from "@/shared/services/friendService";
import { useRouter } from "next/navigation";

export function Header() {
    const { data, isError, isLoading } = useProfile()
    const [pendingCount, setPendingCount] = useState(0)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        getPendingRequests()
            .then((reqs) => setPendingCount(reqs.length))
            .catch(() => {})
    }, [])

    // Fecha o dropdown ao clicar fora
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

    if (isLoading) return <LoadingComponent type="header" />;
    if (isError || !data) return <ErrorComponent type="header" />;

    return (
        <div className="flex items-center gap-2">

            {/* ── Botão Amigos ── */}
            <Link
                href="/friends"
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-white/50 hover:text-white/90"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
            >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Amigos</span>
                {pendingCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-black"
                        style={{ background: "#ff2d87" }}
                    >
                        {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                )}
            </Link>

            {/* ── Avatar / perfil com dropdown ── */}
            <div className="relative" ref={dropdownRef}>
                <div
                    className="group flex items-center gap-2.5 cursor-pointer pl-1 pr-3.5 py-1 rounded-full transition-all duration-300 select-none"
                    onClick={() => setDropdownOpen(prev => !prev)}
                    style={{
                        background: dropdownOpen ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                        border: dropdownOpen ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)";
                    }}
                    onMouseLeave={e => {
                        if (!dropdownOpen) {
                            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                        }
                    }}
                >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        {data?.img_profile ? (
                            <img
                                src={data.img_profile}
                                className="w-8 h-8 rounded-full object-cover"
                                style={{ border: "1.5px solid rgba(0,255,179,0.3)" }}
                                alt="Profile"
                            />
                        ) : (
                            <UserCircle className="w-8 h-8 text-white/30" />
                        )}
                        <div
                            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                            style={{ background: "#00ffb3", border: "1.5px solid #07070c" }}
                        >
                            <Crown className="w-1.5 h-1.5 text-black" />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="flex-col leading-none hidden sm:flex">
                        <span
                            className="text-[13px] text-white/85 group-hover:text-white transition-colors"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                        >
                            {data?.display_name?.split(" ")[0] || "Usuário"}
                        </span>
                        <span
                            className="text-[9px] font-800 uppercase tracking-widest mt-0.5"
                            style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}
                        >
                            PRO
                        </span>
                    </div>

                    <ChevronDown
                        className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-all duration-300"
                        style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                </div>

                {/* ── Dropdown ── */}
                {dropdownOpen && (
                    <div
                        className="absolute right-0 top-[calc(100%+8px)] w-48 rounded-2xl overflow-hidden z-50"
                        style={{
                            background: "rgba(14,14,22,0.97)",
                            border: "1px solid rgba(255,255,255,0.09)",
                            boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                            animation: "fadeSlideDown 0.15s ease-out both",
                        }}
                    >
                        {/* Info do usuário */}
                        <div
                            className="px-4 py-3"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <p
                                className="text-xs font-semibold text-white/80 truncate"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                {data.display_name}
                            </p>
                            <p className="text-[10px] text-white/30 truncate mt-0.5">
                                {data.email}
                            </p>
                        </div>

                        {/* Ações */}
                        <div className="p-1.5">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-red-400/80 hover:text-red-400 hover:bg-red-500/10"
                            >
                                <LogOut className="w-3.5 h-3.5 shrink-0" />
                                Sair da conta
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Animação do dropdown */}
            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)  scale(1);    }
                }
            `}</style>
        </div>
    )
}
