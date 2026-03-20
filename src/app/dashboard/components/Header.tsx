"use client"
import { UserCircle, Crown, ChevronDown } from "lucide-react"
import { useProfile } from "../hooks/useProfile"
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";

export function Header() {
    const { data, isError, isLoading } = useProfile()

    if (isLoading) return <LoadingComponent type="header" />;
    if (isError || !data) return <ErrorComponent type="header" />;

    return (
        <div
            className="group flex items-center gap-2.5 cursor-pointer pl-1 pr-3.5 py-1 rounded-full transition-all duration-300"
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
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
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{ background: "#00ffb3", border: "1.5px solid #07070c" }}>
                    <Crown className="w-1.5 h-1.5 text-black" />
                </div>
            </div>

            {/* Name */}
            <div className="flex flex-col leading-none hidden sm:flex">
                <span className="text-[13px] font-600 text-white/85 group-hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                    {data?.display_name?.split(" ")[0] || "Usuário"}
                </span>
                <span className="text-[9px] font-800 uppercase tracking-widest mt-0.5"
                    style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>
                    PRO
                </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors" />
        </div>
    )
}
