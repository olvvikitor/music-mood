"use client";

import { MoodIcon } from "./MoodIcons";
import { emotionStyles, getMoodDisplayName, getMoodProfile } from "@/shared/lib/moodHelpers";

interface MoodBadgeProps {
    mood: string;
    size?: "sm" | "md" | "lg";
    label?: string;
}

export function MoodBadge({ mood, size = "md", label }: MoodBadgeProps) {
    const sourceMood = (label ?? mood ?? "").trim();
    const canonicalMoodKey = getMoodProfile(sourceMood).backendKey.toLowerCase();
    const displayLabel = getMoodDisplayName(sourceMood, "Sem humor");
    const style = emotionStyles[canonicalMoodKey] ?? "bg-black/5 text-black/70 border-black/15 dark:bg-white/8 dark:text-white/60 dark:border-white/15";

    const sizeClass =
        size === "sm"  ? "text-[9px] px-2 py-0.5 gap-1" :
        size === "lg"  ? "text-[11px] px-3.5 py-1.5 gap-1.5" :
                         "text-[9px] px-2.5 py-1 gap-1";

    const iconSize = size === "sm" ? 8 : size === "lg" ? 12 : 9;

    return (
        <span
            className={`
                inline-flex items-center rounded-full font-700 uppercase tracking-widest
                border whitespace-nowrap select-none
                transition-all duration-200
                hover:brightness-125 hover:scale-[1.04]
                cursor-default
                ${sizeClass} ${style}
            `}
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
            <MoodIcon mood={mood} size={iconSize} color="currentColor" />
            {displayLabel}
        </span>
    );
}
