export function StatusDot({ label, dotColor = "bg-emerald-400" }: { label?: string; dotColor?: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <div className={`absolute w-full h-full rounded-full opacity-40 animate-ping ${dotColor}`} />
                <div className={`relative w-1.5 h-1.5 rounded-full ${dotColor}`} />
            </div>
            {label && (
                <span
                    className="text-[9px] uppercase tracking-[0.2em] font-700 text-white/20"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                    {label}
                </span>
            )}
        </div>
    );
}
