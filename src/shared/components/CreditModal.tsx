"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, Check, Zap, Clock, ImageIcon, Star } from "lucide-react";
import {
    getCreditStatus,
    purchasePackage,
    type CreditStatus,
    type CreditPackage,
} from "@/shared/services/creditService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(cents: number) {
    return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

function moodColor(score: number) {
    if (score >= 0.7) return "#00ffb3";
    if (score >= 0.4) return "#a259ff";
    return "#ff2d87";
}

function timeAgo(iso: string) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60)    return "agora";
    if (diff < 3600)  return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-xl animate-pulse ${className}`}
        style={{ background: "var(--surface-card-alt)" }} />;
}

// ─── PackageCard ──────────────────────────────────────────────────────────────

function PackageCard({ pkg, onBuy, buying, bought }: {
    pkg: CreditPackage;
    onBuy: (id: string) => void;
    buying: string | null;
    bought: string | null;
}) {
    const isPopular   = pkg.popular;
    const isRecommended = Boolean(pkg.recommended);
    const isBought    = bought === pkg.id;
    const isBuying    = buying === pkg.id;
    const priceEach   = formatPrice(Math.round(pkg.price / pkg.credits));
    const basePriceEach = 290;
    const packagePriceEach = Math.round(pkg.price / pkg.credits);
    const savings = pkg.credits > 1 ? Math.max(0, Math.round((1 - packagePriceEach / basePriceEach) * 100)) : 0;

    return (
        <div
            className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
            style={{
                background: isPopular
                    ? "linear-gradient(145deg, rgba(0,255,179,0.12), rgba(0,255,179,0.04))"
                    : "var(--surface-card)",
                border: isPopular
                    ? "1.5px solid rgba(0,255,179,0.40)"
                    : "1px solid var(--border)",
            }}
        >
            {/* Tag popular */}
            {isPopular && (
                <div className="flex items-center justify-center gap-1 py-1.5"
                    style={{ background: "#00ffb3" }}>
                    <Star className="w-2.5 h-2.5 fill-current" style={{ color: "#07070c" }} />
                    <span className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: "#07070c", fontFamily: "var(--font-display)" }}>
                        Mais vendido
                    </span>
                </div>
            )}

            {isRecommended && !isPopular && (
                <div className="flex items-center justify-center gap-1 py-1.5"
                    style={{ background: "rgba(0,255,179,0.12)", borderBottom: "1px solid rgba(0,255,179,0.22)" }}>
                    <span className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>
                        Recomendado
                    </span>
                </div>
            )}

            {/* Tag melhor valor */}
            {pkg.tag && !isPopular && (
                <div className="flex items-center justify-center py-1.5"
                    style={{ background: "rgba(162,89,255,0.15)", borderBottom: "1px solid rgba(162,89,255,0.2)" }}>
                    <span className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: "#a259ff", fontFamily: "var(--font-display)" }}>
                        {pkg.tag}
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-1 p-4 flex-1">
                {/* Quantidade */}
                <span className="text-3xl font-black leading-none"
                    style={{
                        fontFamily: "var(--font-display)",
                        color: isPopular ? "#00ffb3" : "var(--text-primary)",
                    }}>
                    {pkg.credits}
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {pkg.credits === 1 ? "imagem" : "imagens"}
                </span>

                {/* Preço */}
                <div className="mt-2">
                    <span className="text-lg font-black"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                        {formatPrice(pkg.price)}
                    </span>
                </div>
                <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                    {priceEach} cada
                </span>

                {savings > 0 && (
                    <span className="mt-1 text-[10px] font-bold"
                        style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>
                        Economize ate {savings}%
                    </span>
                )}

                {pkg.description && (
                    <p className="mt-2 text-[10px] leading-relaxed"
                        style={{ color: "var(--text-muted)" }}>
                        {pkg.description}
                    </p>
                )}
            </div>

            {/* Botão */}
            <div className="px-3 pb-3">
                <button
                    onClick={() => onBuy(pkg.id)}
                    disabled={buying !== null || isBought}
                    className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    style={{
                        background: isBought
                            ? "rgba(0,255,179,0.15)"
                            : isPopular
                            ? "#00ffb3"
                            : "var(--surface-card-alt)",
                        color: isBought
                            ? "#00ffb3"
                            : isPopular
                            ? "#07070c"
                            : "var(--text-primary)",
                        border: isBought ? "1px solid rgba(0,255,179,0.3)" : "none",
                        fontFamily: "var(--font-display)",
                    }}
                >
                    {isBought ? (
                        <><Check className="w-3.5 h-3.5" /> Comprado!</>
                    ) : isBuying ? (
                        <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Processando…
                        </span>
                    ) : "Comprar"}
                </button>
            </div>
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface CreditModalProps {
    onClose: () => void;
    onPurchased?: (newBalance: number) => void;
    noCredits?: boolean;
}

export function CreditModal({ onClose, onPurchased, noCredits = false }: CreditModalProps) {
    const [status, setStatus]       = useState<CreditStatus | null>(null);
    const [loading, setLoading]     = useState(true);
    const [buying, setBuying]       = useState<string | null>(null);
    const [bought, setBought]       = useState<string | null>(null);
    const [newBalance, setNewBalance] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getCreditStatus().then(setStatus).catch(() => {}).finally(() => setLoading(false));
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        setMounted(true);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    async function handleBuy(packageId: string) {
        setBuying(packageId);
        try {
            const result = await purchasePackage(packageId);
            setNewBalance(result.balance);
            setBought(packageId);
            setStatus(prev => prev ? { ...prev, balance: result.balance } : prev);
            onPurchased?.(result.balance);
        } catch { }
        finally { setBuying(null); }
    }

    const balance = newBalance ?? status?.balance ?? 0;
    const hasImages = (status?.images?.length ?? 0) > 0;
    const hasLogs   = (status?.logs?.length ?? 0) > 0;

    if (!mounted) return null;

    return createPortal(
        <div
            ref={overlayRef}
            className="fixed inset-0 z-999 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "var(--overlay-bg)", backdropFilter: "blur(10px)" }}
            onClick={e => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div
                className="w-full sm:w-[min(640px,94vw)] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
                style={{
                    background: "var(--surface-solid)",
                    border: "1px solid var(--border-medium)",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
                    maxHeight: "min(920px, calc(100dvh - 8px))",
                    animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
                }}
            >
                {/* ── Header ── */}
                <div className="shrink-0 px-4 sm:px-5 pt-4 sm:pt-5 pb-4"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}>

                    {/* Pill de arrastar (mobile) */}
                    <div className="w-10 h-1 rounded-full mx-auto mb-3 sm:mb-4 sm:hidden"
                        style={{ background: "var(--border-medium)" }} />

                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <Sparkles className="w-4 h-4" style={{ color: "#00ffb3" }} />
                                <h2 className="text-base font-black uppercase tracking-tight"
                                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                                    Crie seu Mood Visual
                                </h2>
                            </div>
                            <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                                Cada credito gera 1 arte exclusiva do seu momento. Nao expiram.
                            </p>
                        </div>

                        <button onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
                            style={{ background: "var(--surface-card-alt)", color: "var(--text-muted)" }}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Saldo */}
                    <div className="flex items-center gap-3 mt-4 p-3 rounded-2xl flex-wrap"
                        style={{
                            background: balance > 0 ? "rgba(0,255,179,0.07)" : "rgba(255,45,135,0.07)",
                            border: `1px solid ${balance > 0 ? "rgba(0,255,179,0.2)" : "rgba(255,45,135,0.2)"}`,
                        }}>
                        {loading ? (
                            <Skeleton className="h-8 w-24" />
                        ) : (
                            <>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] uppercase tracking-widest font-bold block"
                                        style={{ fontFamily: "var(--font-display)", color: "var(--text-faint)" }}>
                                        Seu saldo
                                    </span>
                                    <span className="text-2xl font-black leading-tight"
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            color: balance > 0 ? "#00ffb3" : "#ff2d87",
                                        }}>
                                        {balance} {balance === 1 ? "crédito" : "créditos"}
                                    </span>
                                </div>

                                {/* Aviso sem créditos ou confirmação */}
                                {noCredits && balance === 0 && (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Zap className="w-4 h-4" style={{ color: "#ff2d87" }} />
                                        <span className="text-xs font-bold" style={{ color: "#ff2d87", fontFamily: "var(--font-display)" }}>
                                            Sem créditos
                                        </span>
                                    </div>
                                )}
                                {bought && (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Check className="w-4 h-4" style={{ color: "#00ffb3" }} />
                                        <span className="text-xs font-bold" style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>
                                            Adicionado!
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* ── Scroll ── */}
                <div className="overflow-y-auto flex-1 min-h-0" style={{ overscrollBehavior: "contain" }}>

                    {/* Beneficios */}
                    <div className="px-4 sm:px-5 pt-4">
                        <div className="rounded-2xl p-3.5"
                            style={{
                                background: "linear-gradient(145deg, rgba(0,255,179,0.10), rgba(162,89,255,0.08))",
                                border: "1px solid rgba(0,255,179,0.18)",
                            }}>
                            <p className="text-[10px] uppercase tracking-widest font-bold mb-1"
                                style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>
                                Por que comprar?
                            </p>
                            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                                Gere novas versoes do seu mood com estilos diferentes e compartilhe suas imagens favoritas.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(0,255,179,0.12)", color: "#00ffb3" }}>1 credito = 1 imagem</span>
                                <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-muted)" }}>Pagamento seguro</span>
                                <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-muted)" }}>Ativacao imediata</span>
                            </div>
                        </div>
                    </div>

                    {/* Pacotes */}
                    <div className="px-4 sm:px-5 py-5">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-4"
                            style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                            Adicionar créditos
                        </p>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {[1,2,3].map(i => <Skeleton key={i} className="h-44" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {(status?.packages ?? []).map(pkg => (
                                    <PackageCard
                                        key={pkg.id}
                                        pkg={pkg}
                                        onBuy={handleBuy}
                                        buying={buying}
                                        bought={bought}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Galeria de imagens geradas */}
                    {hasImages && (
                        <div className="px-4 sm:px-5 pb-5"
                            style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                                <ImageIcon className="w-3.5 h-3.5" />
                                Suas imagens geradas
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {status!.images.map(img => (
                                    <div key={img.id}
                                        className="relative rounded-2xl overflow-hidden group cursor-default"
                                        style={{ aspectRatio: "3/4" }}>
                                        <img
                                            src={img.image_mood!}
                                            alt={img.sentiment}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 pointer-events-none"
                                            style={{ background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.82) 100%)" }} />
                                        <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                                            <p className="text-[9px] font-black truncate"
                                                style={{ color: moodColor(img.moodScore), fontFamily: "var(--font-display)" }}>
                                                {img.sentiment}
                                            </p>
                                            <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                                                {timeAgo(img.analyzedAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Histórico */}
                    {hasLogs && (
                        <div className="px-4 sm:px-5 pb-[max(24px,env(safe-area-inset-bottom))]"
                            style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                                style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                                <Clock className="w-3.5 h-3.5" />
                                Histórico
                            </p>
                            <ul className="flex flex-col gap-1.5">
                                {status!.logs.map(log => {
                                    const isPositive = log.amount > 0;
                                    return (
                                        <li key={log.id}
                                            className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                                            style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}>
                                            <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                                                {log.note || log.type}
                                            </span>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs font-bold"
                                                    style={{
                                                        color: isPositive ? "#00ffb3" : "var(--text-faint)",
                                                        fontFamily: "var(--font-display)",
                                                    }}>
                                                    {isPositive ? "+" : ""}{log.amount}
                                                </span>
                                                <span className="text-[10px]" style={{ color: "var(--text-ghost)" }}>
                                                    {timeAgo(log.createdAt)}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
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
    , document.body);
}
