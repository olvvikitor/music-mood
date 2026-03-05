// components/OrbitalCore.tsx
// Sistema orbital (anéis + núcleo 🎵 + satélites) usado na LoginPage e BuildingEmotionsPage.
// Props permitem customizar tamanho, tipo de anel e posição.
const SATELLITES = [
    // ── orbit1 (raio menor, mais rápido) ─────────────────────────────────────
    { size: "w-3.5 h-3.5", color: "bg-emerald-400", shadow: "shadow-[0_0_14px_rgba(52,211,153,0.9)]", anim: "orbit1 11s linear infinite" },
    { size: "w-2   h-2", color: "bg-blue-400", shadow: "shadow-[0_0_10px_rgba(96,165,250,0.8)]", anim: "orbit1 17s linear infinite reverse" },
    { size: "w-2.5 h-2.5", color: "bg-yellow-400", shadow: "shadow-[0_0_12px_rgba(251,191,36,0.8)]", anim: "orbit1 23s linear infinite" },
    { size: "w-1.5 h-1.5", color: "bg-white", shadow: "shadow-[0_0_8px_rgba(255,255,255,0.6)]", anim: "orbit1 31s linear infinite reverse" },
    { size: "w-2   h-2", color: "bg-pink-400", shadow: "shadow-[0_0_10px_rgba(244,114,182,0.8)]", anim: "orbit1 41s linear infinite" },

    // ── orbit2 (raio médio) ───────────────────────────────────────────────────
    { size: "w-2.5 h-2.5", color: "bg-emerald-200", shadow: "shadow-[0_0_10px_rgba(167,243,208,0.7)]", anim: "orbit2 19s linear infinite" },
    { size: "w-2   h-2", color: "bg-red-400", shadow: "shadow-[0_0_10px_rgba(248,113,113,0.7)]", anim: "orbit2 27s linear infinite reverse" },
    { size: "w-3   h-3", color: "bg-violet-400", shadow: "shadow-[0_0_14px_rgba(167,139,250,0.8)]", anim: "orbit2 35s linear infinite" },
    { size: "w-1.5 h-1.5", color: "bg-cyan-300", shadow: "shadow-[0_0_8px_rgba(103,232,249,0.7)]", anim: "orbit2 43s linear infinite reverse" },
    { size: "w-2   h-2", color: "bg-amber-300", shadow: "shadow-[0_0_10px_rgba(252,211,77,0.7)]", anim: "orbit2 51s linear infinite" },

    // ── orbit3 (raio maior, mais lento) ──────────────────────────────────────
    { size: "w-2   h-2", color: "bg-white", shadow: "shadow-[0_0_8px_rgba(255,255,255,0.5)]", anim: "orbit3 29s linear infinite" },
    { size: "w-2.5 h-2.5", color: "bg-indigo-400", shadow: "shadow-[0_0_12px_rgba(129,140,248,0.7)]", anim: "orbit3 37s linear infinite reverse" },
    { size: "w-1.5 h-1.5", color: "bg-emerald-300", shadow: "shadow-[0_0_8px_rgba(110,231,183,0.6)]", anim: "orbit3 45s linear infinite" },
    { size: "w-2   h-2", color: "bg-rose-300", shadow: "shadow-[0_0_10px_rgba(253,164,175,0.7)]", anim: "orbit3 53s linear infinite reverse" },
    { size: "w-3   h-3", color: "bg-sky-300", shadow: "shadow-[0_0_14px_rgba(125,211,252,0.7)]", anim: "orbit3 61s linear infinite" },
    { size: "w-1.5 h-1.5", color: "bg-fuchsia-300", shadow: "shadow-[0_0_8px_rgba(240,171,252,0.6)]", anim: "orbit3 69s linear infinite reverse" },
] as const

type Variant =
    | "login"    // 3 satélites animados, anéis finos
    | "building" // anéis decorativos pulsantes (sem satélites visíveis)

type Props = {
    variant?: Variant;
};

export function OrbitalCore({ variant = "login" }: Props) {
    if (variant === "building") {
        return (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[100, 155, 210].map((r, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full border border-emerald-400"
                        style={{
                            width: r * 2,
                            height: r * 2,
                            animation: `ringPulse ${2 + i * 0.7}s ${i * 0.4}s ease-in-out infinite`,
                        }}
                    />
                ))}
            </div>
        );
    }

    // variant === "login"
    return (
        <div
            className="pointer-events-none flex items-center justify-center absolute z-10
        top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.55]
        md:top-1/2 md:left-[30%] md:-translate-x-1/2 md:-translate-y-1/2 md:scale-100"
        >
            {/* Anéis orbitais */}
            {[150, 210, 275].map((r, i) => (
                <div
                    key={i}
                    className="absolute rounded-full border border-emerald-500/[0.08]"
                    style={{ width: r * 2, height: r * 2 }}
                />
            ))}


            {/* Satélites */}

            {SATELLITES.map((s, i) => (
                <div
                    key={i}
                    className={`absolute rounded-full ${s.size} ${s.color} ${s.shadow}`}
                    style={{ animation: s.anim }}
                />
            ))}


        </div>
    );

}