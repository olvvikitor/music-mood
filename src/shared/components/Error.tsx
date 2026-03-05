import { AlertCircle, AlertTriangle, RefreshCw, UserX } from "lucide-react";

interface ErrorProps {
    type?: 'profile' | 'list' | "header" | "emotionalChart";
    message?: string;
    retry?: () => void; // Opcional: função para tentar carregar novamente
}

export default function ErrorComponent({
    type = 'list',
    message = "Erro ao carregar",
    retry
}: ErrorProps) {

    // Estilo base para os ícones de erro
    const ErrorIcon = <AlertCircle className="text-red-400/60" size={type === 'header' ? 16 : 24} />;

    if (type === 'profile') {
        return (
            <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden border-rose-500/20 min-h-[400px]">

                {/* Brilho de fundo dramático para erro */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/5 blur-[60px] rounded-full -ml-12 -mb-12 pointer-events-none" />

                {/* Ícone Principal */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative bg-black/40 p-5 rounded-3xl border border-rose-500/30 shadow-2xl">
                        <UserX className="w-10 h-10 text-rose-500" />
                    </div>
                    <AlertTriangle className="absolute -bottom-1 -right-1 w-5 h-5 text-amber-500 fill-black" />
                </div>

                {/* Textos */}
                <div className="text-center space-y-2 mb-8 relative z-10">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-rose-400">
                        Erro de Perfil
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed max-w-[180px] mx-auto uppercase">
                        {message || "Não foi possível carregar os dados da sua conta MusicMood."}
                    </p>
                </div>
                {/* Decoração Estética */}
                <div className="absolute bottom-4 flex gap-1.5 opacity-30">
                    <div className="w-1 h-1 rounded-full bg-rose-500" />
                    <div className="w-8 h-[1px] bg-rose-500/50 self-center" />
                    <div className="w-1 h-1 rounded-full bg-rose-500" />
                </div>
            </div>
        );
    }

    if (type === "header") {
        return (
            <div className="flex items-center gap-2 p-1 pr-3 rounded-full glass-card border border-red-500/20">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="text-red-400" size={14} />
                </div>
                <span className="text-[10px] text-red-300 uppercase font-bold tracking-tighter">Erro</span>
            </div>
        );
    }
    if (type === "emotionalChart") {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 text-center border border-rose-500/10 bg-rose-500/[0.02] rounded-3xl backdrop-blur-sm">

                {/* Ícone de Alerta com Brilho */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    <div className="relative bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                </div>

                {/* Texto de Erro */}
                <div className="space-y-2 mb-8 relative z-10">
                    <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">
                        Ops! Algo deu errado
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px] mx-auto uppercase tracking-widest">
                        {message || "Não conseguimos processar sua vibração musical no momento."}
                    </p>
                </div>

                {/* Linhas decorativas de fundo (Grid style) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 opacity-20 pointer-events-none">
                    <div className="w-1 h-1 bg-rose-500 rounded-full" />
                    <div className="w-1 h-1 bg-rose-500 rounded-full" />
                    <div className="w-1 h-1 bg-rose-500 rounded-full" />
                </div>
            </div>
        );
    }

    // Default: List style
    return (
        <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-center opacity-60">
                    <div className="w-12 h-12 bg-red-500/5 border border-red-500/10 rounded-md flex items-center justify-center">
                        <AlertCircle className="text-red-500/20" size={20} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-red-500/10 rounded w-full" />
                        <div className="h-3 bg-red-500/5 rounded w-1/2" />
                    </div>
                </div>
            ))}
            <p className="text-red-300/80 text-xs italic text-center mt-2">{message}</p>
        </div>
    );
}