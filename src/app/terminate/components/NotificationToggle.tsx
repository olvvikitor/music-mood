"use client";

import { Check } from "lucide-react";
import { ReactNode } from "react";

interface NotificationToggleProps {
    id: string;
    label: string;
    description: string;
    icon: ReactNode;
    checked: boolean;
    onToggle: () => void;
}

/**
 * Botão toggle de opção de notificação.
 * Extraído de terminate/page.tsx.
 */
export function NotificationToggle({
    label,
    description,
    icon,
    checked,
    onToggle,
}: NotificationToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 text-left
        ${checked
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20"
                }`}
        >
            <span className={`shrink-0 transition-colors duration-300 ${checked ? "text-emerald-400" : "text-slate-600"}`}>
                {icon}
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold leading-tight">{label}</p>
                <p className="text-[9px] text-slate-500">{description}</p>
            </div>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300
        ${checked ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}>
                {checked && <Check className="w-2 h-2 text-black" strokeWidth={3} />}
            </div>
        </button>
    );
}
