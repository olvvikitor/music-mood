"use client";

import { Check } from "lucide-react";

interface ProfileCardProps {
    imgUrl: string;
    displayName: string;
    email: string;
    provider: string;
    country: string;
}

/**
 * Card de informações do perfil do usuário.
 * Extraído de terminate/page.tsx.
 */
export function ProfileCard({ imgUrl, displayName, email, provider, country }: ProfileCardProps) {
    return (
        <div
            className="flex items-center gap-3 p-2.5 rounded-xl border border-white/10 bg-white/[0.02]"
            style={{ animation: "fadeUp 0.5s 0.2s ease-out both", opacity: 0 }}
        >
            <div className="relative shrink-0">
                <img
                    src={imgUrl}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border border-emerald-500/20"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                    <Check className="w-1.5 h-1.5 text-black" strokeWidth={3} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-xs truncate">{displayName}</p>
                <p className="text-slate-400 text-[10px] truncate">{email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[8px] uppercase font-black tracking-widest text-emerald-500/70 border border-emerald-500/20 rounded-full px-1.5 py-px">
                        {provider}
                    </span>
                    <span className="text-[8px] text-slate-600 font-mono">{country}</span>
                </div>
            </div>
        </div>
    );
}
