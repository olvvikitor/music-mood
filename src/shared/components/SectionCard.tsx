import { ReactNode } from "react";

interface SectionCardProps {
    icon?: ReactNode;
    title?: string;
    iconColor?: string;
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
    accentColor?: string;
}

export function SectionCard({
    icon,
    title,
    iconColor = "text-emerald-400",
    children,
    className = "",
    noPadding = false,
    accentColor,
}: SectionCardProps) {
    return (
        <div className={`glass-card flex flex-col overflow-hidden ${noPadding ? "" : "p-5 md:p-6"} ${className}`}>
            {(title || icon) && (
                <div className={`flex items-center justify-between mb-4 shrink-0 ${noPadding ? "px-5 pt-5" : ""}`}>
                    <div className="flex items-center gap-2.5">
                        {icon && (
                            <div
                                className={`w-7 h-7 flex items-center justify-center rounded-lg ${iconColor}`}
                                style={{
                                    background: accentColor
                                        ? `${accentColor}18`
                                        : "var(--surface-card-alt)",
                                    border: `1px solid ${accentColor ? accentColor + "30" : "var(--border-medium)"}`,
                                }}
                            >
                                <span className="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5">
                                    {icon}
                                </span>
                            </div>
                        )}
                        {title && (
                            <h3
                                className="text-[11px] font-700 uppercase tracking-[0.15em] text-white/40"
                                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                            >
                                {title}
                            </h3>
                        )}
                    </div>
                </div>
            )}
            <div className={`flex-1 relative min-h-0 ${title ? "border-t pt-4" : ""}`}
                style={title ? { borderColor: "var(--border-subtle)" } : undefined}>
                {children}
            </div>
        </div>
    );
}
