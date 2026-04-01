"use client";

import { X, RotateCw, Check } from "lucide-react";
import type { RefreshMoodStudio } from "../services/getRefreshProfileService";

// Paletas visuais por studio — usadas no lugar dos logos SVG
const STUDIO_PALETTE: Record<string, { from: string; to: string; initials: string }> = {
    kyoani:   { from: "#f9a8d4", to: "#fb7185", initials: "KA" },
    ghibli:   { from: "#86efac", to: "#34d399", initials: "SG" },
    ufotable: { from: "#7dd3fc", to: "#818cf8", initials: "UF" },
    mappa:    { from: "#fca5a5", to: "#ef4444", initials: "MP" },
    shaft:    { from: "#f0abfc", to: "#a259ff", initials: "SH" },
    trigger:  { from: "#fde68a", to: "#fb923c", initials: "TR" },
};

function StudioAvatar({ logoKey }: { logoKey: string }) {
    const p = STUDIO_PALETTE[logoKey] ?? { from: "#888", to: "#555", initials: "ST" };
    return (
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-sm font-black"
            style={{
                background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
                color: "#07070c",
                fontFamily: "var(--font-display)",
                boxShadow: `0 4px 16px ${p.to}40`,
            }}
        >
            {p.initials}
        </div>
    );
}

interface StudioPickerModalProps {
    studios: RefreshMoodStudio[];
    loading: boolean;
    error: boolean;
    selectedId: string;
    onSelect: (studio: RefreshMoodStudio) => void;
    onConfirm: () => void;
    onClose: () => void;
    isPending: boolean;
}

export function StudioPickerModal({
    studios,
    loading,
    error,
    selectedId,
    onSelect,
    onConfirm,
    onClose,
    isPending,
}: StudioPickerModalProps) {
    const selected = studios.find(s => s.id === selectedId);

    return (
        <div
            className="fixed inset-0 z-200 flex items-end sm:items-center justify-center sm:p-4"
            style={{ background: "var(--overlay-bg)", backdropFilter: "blur(10px)" }}
            onClick={e => { if (e.currentTarget === e.target && !isPending) onClose(); }}
        >
            <div
                className="w-full sm:max-w-2xl flex flex-col overflow-hidden"
                style={{
                    background: "var(--surface-solid)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "1.5rem 1.5rem 0 0",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
                    maxHeight: "90vh",
                    animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="shrink-0 px-5 pt-5 pb-4"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}>

                    {/* Pill */}
                    <div className="w-10 h-1 rounded-full mx-auto mb-4"
                        style={{ background: "var(--border-medium)" }} />

                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                                Estilo visual
                            </p>
                            <h2 className="text-lg font-black uppercase tracking-tight"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                                Escolha o Studio
                            </h2>
                        </div>
                        <button onClick={onClose} disabled={isPending}
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
                            style={{ background: "var(--surface-card-alt)", color: "var(--text-muted)" }}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Lista de studios ── */}
                <div className="overflow-y-auto flex-1 px-4 py-4 flex flex-col gap-2.5"
                    style={{ overscrollBehavior: "contain" }}>

                    {loading && (
                        <div className="flex flex-col gap-2.5">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-20 rounded-2xl animate-pulse"
                                    style={{ background: "var(--surface-card-alt)" }} />
                            ))}
                        </div>
                    )}

                    {error && !loading && (
                        <p className="text-sm text-center py-8" style={{ color: "var(--text-faint)" }}>
                            Não foi possível carregar os studios.
                        </p>
                    )}

                    {!loading && !error && studios.map(studio => {
                        const isSelected = studio.id === selectedId;
                        const palette    = STUDIO_PALETTE[studio.logoKey] ?? { from: "#888", to: "#555", initials: "ST" };
                        const animes     = Array.isArray(studio.referenceAnimes) ? studio.referenceAnimes : [];

                        return (
                            <button
                                key={studio.id}
                                onClick={() => onSelect(studio)}
                                className="w-full text-left rounded-2xl p-4 transition-all duration-200 flex items-start gap-3 relative"
                                style={{
                                    background: isSelected
                                        ? `linear-gradient(135deg, ${palette.from}18, ${palette.to}0a)`
                                        : "var(--surface-card)",
                                    border: isSelected
                                        ? `1.5px solid ${palette.to}55`
                                        : "1px solid var(--border)",
                                }}
                            >
                                {/* Glow de fundo quando selecionado */}
                                {isSelected && (
                                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 blur-2xl opacity-20"
                                        style={{ background: palette.to }} />
                                )}

                                <StudioAvatar logoKey={studio.logoKey} />

                                <div className="flex-1 min-w-0 relative z-10">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-black truncate"
                                                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                                                {studio.name}
                                            </p>
                                            <p className="text-[10px] truncate mt-0.5"
                                                style={{ color: "var(--text-faint)" }}>
                                                {studio.company}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                                style={{ background: palette.to }}>
                                                <Check className="w-3 h-3 text-black" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Chips de animes de referência */}
                                    {animes.length > 0 && (
                                        <div className="flex flex-wrap items-start gap-1.5 mt-2 max-w-full">
                                            {animes.map(anime => (
                                                <span key={anime}
                                                    className="text-[9px] px-2 py-0.5 rounded-full font-semibold max-w-full whitespace-normal wrap-break-word leading-tight"
                                                    style={{
                                                        background: isSelected ? `${palette.to}18` : "var(--surface-card-alt)",
                                                        color: isSelected ? palette.to : "var(--text-faint)",
                                                        border: isSelected
                                                            ? `1px solid ${palette.to}30`
                                                            : "1px solid var(--border-subtle)",
                                                        fontFamily: "var(--font-display)",
                                                    }}>
                                                    {anime}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ── Footer ── */}
                <div className="shrink-0 px-4 pb-6 pt-3 flex flex-col gap-3"
                    style={{ borderTop: "1px solid var(--border-subtle)" }}>

                    {/* Botões de ação */}
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
                            style={{
                                background: "var(--surface-card-alt)",
                                border: "1px solid var(--border)",
                                color: "var(--text-muted)",
                            }}>
                            Cancelar
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={isPending || loading || !selected}
                            className="flex-1 py-3 rounded-2xl text-sm font-black uppercase tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{
                                background: selected
                                    ? `linear-gradient(135deg, ${STUDIO_PALETTE[selected.logoKey]?.from ?? "#00ffb3"}, ${STUDIO_PALETTE[selected.logoKey]?.to ?? "#a259ff"})`
                                    : "var(--surface-card-alt)",
                                color: "#07070c",
                                fontFamily: "var(--font-display)",
                            }}>
                            {isPending ? (
                                <><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> Gerando…</>
                            ) : (
                                <><RotateCw className="w-4 h-4" /> Gerar imagem</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @media (min-width: 640px) {
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(8px) scale(0.98); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                }
            `}</style>
        </div>
    );
}
