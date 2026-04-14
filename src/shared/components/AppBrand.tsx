import Image from "next/image";

export function AppBrand({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="relative w-8 h-8 flex-shrink-0">
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill 
                    className="object-contain drop-shadow-md"
                />
            </div>
            <span
                className="font-black uppercase leading-none tracking-tighter select-none"
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
        </div>
    );
}

