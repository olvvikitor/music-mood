import { UserCircle } from "lucide-react";

interface LoadingProps {
    type?: 'profile' | 'list' | "header";
}

export default function LoadingComponent({ type = 'list' }: LoadingProps) {
    if (type === 'profile') {
        return (
            <div className="flex flex-col items-center animate-pulse">
                <div className="w-32 h-32 rounded-full bg-white/10 mb-4" />
                <div className="h-6 bg-white/10 w-40 rounded-md mb-2" />
                <div className="h-4 bg-white/5 w-24 rounded-md" />
            </div>
        );
    }
    if (type === "header") {
        return (
            <div className="flex items-center gap-2 p-1 pr-3 rounded-full glass-card animate-pulse">
                {/* Círculo da foto */}
                <div className="w-8 h-8 rounded-full bg-white/10" />

                {/* Barrinha simulando o nome */}
                <div className="h-3 bg-white/10 w-16 rounded-md" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-md" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-full" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}