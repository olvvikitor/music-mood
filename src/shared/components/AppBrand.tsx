export function AppBrand({ className = "" }: { className?: string }) {
    return (
        <span
            className={`font-black uppercase leading-none tracking-tighter select-none ${className}`}
            style={{ fontFamily: "var(--font-display)" }}
        >
            <span className="text-white">Motion</span>
            <span
                style={{
                    background: "linear-gradient(90deg, #6fae9b, #8a7bb8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
            >
                fy
            </span>
        </span>
    );
}

