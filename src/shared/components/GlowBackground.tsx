interface GlowBackgroundProps {
    /** Classe de cor Tailwind, ex: "bg-emerald-500/10" */
    color?: string;
    /** Tailwind size classes, ex: "w-32 h-32" */
    size?: string;
    /** Tailwind position classes, ex: "-right-16 -top-16" */
    position?: string;
    /** raio do blur, ex: "[80px]" → resulta em blur-[80px] */
    blurRadius?: string;
}

/**
 * Div decorativo de brilho/glow posicionado absolutamente.
 * Elimina o copy-paste de divs de efeito visual em Profile, dashboard/page, etc.
 */
export function GlowBackground({
    color = "bg-emerald-500/10",
    size = "w-32 h-32",
    position = "-right-16 -top-16",
    blurRadius = "[80px]",
}: GlowBackgroundProps) {
    return (
        <div
            className={`absolute ${size} ${color} blur-${blurRadius} rounded-full ${position} pointer-events-none`}
        />
    );
}
