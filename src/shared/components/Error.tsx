import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorProps {
    type?: 'profile' | 'list' | "header";
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
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center mb-4">
                    <AlertCircle className="text-red-500/40" size={48} />
                </div>
                <div className="text-red-300 text-sm font-medium">{message}</div>
                {retry && (
                    <button onClick={retry} className="mt-2 text-xs text-white/40 hover:text-white/70 flex items-center gap-1">
                        <RefreshCw size={12} /> Tentar novamente
                    </button>
                )}
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