import { AlertCircle, RefreshCw, UserX, WifiOff } from "lucide-react";

interface ErrorProps {
    type?: "profile" | "list" | "header" | "emotionalChart";
    message?: string;
    retry?: () => void;
}

export default function ErrorComponent({ type = "list", message, retry }: ErrorProps) {

    /* ── HEADER ── */
    if (type === "header") {
        return (
            <div className="flex items-center gap-2 px-1 pr-3 py-1 rounded-full"
                style={{
                    background: "rgba(248,113,113,0.06)",
                    border: "1px solid rgba(248,113,113,0.2)",
                }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(248,113,113,0.1)" }}>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <span className="text-[10px] text-rose-400 font-700 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-display)" }}>
                    Erro
                </span>
            </div>
        );
    }

    /* ── PROFILE ── */
    if (type === "profile") {
        return (
            <div className="glass-card h-full flex items-center justify-between p-4 relative overflow-hidden"
                style={{ borderColor: "rgba(248,113,113,0.15)" }}>
                <div className="absolute -left-4 -top-4 w-32 h-32 rounded-full blur-[50px] pointer-events-none"
                    style={{ background: "rgba(248,113,113,0.08)" }} />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        <UserX className="w-4.5 h-4.5 text-rose-400" />
                    </div>
                    <div>
                        <p className="text-[11px] font-700 text-rose-400 uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            Erro de perfil
                        </p>
                        <p className="text-[10px] text-white/25 mt-0.5"
                            style={{ fontFamily: "var(--font-body)" }}>
                            {message ?? "Falha ao carregar dados"}
                        </p>
                    </div>
                </div>

                {retry && (
                    <button onClick={retry}
                        className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 shrink-0"
                        style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.12)"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.06)"}
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                )}
            </div>
        );
    }

    /* ── EMOTIONAL CHART ── */
    if (type === "emotionalChart") {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-5 text-center"
                style={{ animation: "fadeInUp 0.5s ease both" }}>
                <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-2xl scale-150"
                        style={{ background: "rgba(248,113,113,0.12)", animation: "ringPulse 2s ease-in-out infinite" }} />
                    <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        <WifiOff className="w-5 h-5 text-rose-400" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-800 uppercase tracking-tight text-white/60"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
                        Sem dados
                    </p>
                    <p className="text-[11px] text-white/25 max-w-[180px] leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}>
                        {message ?? "Não conseguimos processar sua análise emocional agora."}
                    </p>
                </div>
                {retry && (
                    <button onClick={retry}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-700 uppercase tracking-wider transition-all active:scale-95"
                        style={{
                            background: "rgba(248,113,113,0.06)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: "#f87171",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                        }}>
                        <RefreshCw className="w-3 h-3" />
                        Tentar novamente
                    </button>
                )}
            </div>
        );
    }

    /* ── DEFAULT list ── */
    return (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
            <AlertCircle className="w-6 h-6 text-rose-400/40" />
            <p className="text-[11px] text-white/25" style={{ fontFamily: "var(--font-body)" }}>
                {message ?? "Erro ao carregar"}
            </p>
            {retry && (
                <button onClick={retry}
                    className="text-[10px] font-700 uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
                    style={{
                        color: "#f87171",
                        background: "rgba(248,113,113,0.06)",
                        border: "1px solid rgba(248,113,113,0.15)",
                        fontFamily: "var(--font-display)",
                    }}>
                    Tentar novamente
                </button>
            )}
        </div>
    );
}
