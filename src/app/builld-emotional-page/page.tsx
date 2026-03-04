"use client"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMoodProfile } from "../dashboard/hooks/useMoodProfile";

const EMOTIONS = [
    { label: "Euforia",        color: "#f59e0b" },
    { label: "Melancolia",     color: "#818cf8" },
    { label: "Tensão",         color: "#f43f5e" },
    { label: "Serenidade",     color: "#34d399" },
    { label: "Nostalgia",      color: "#a78bfa" },
    { label: "Raiva",          color: "#ef4444" },
    { label: "Contemplação",   color: "#60a5fa" },
    { label: "Conexão",        color: "#f472b6" },
    { label: "Empoderamento",  color: "#fbbf24" },
    { label: "Vulnerabilidade",color: "#c084fc" },
];

type EmotionParticle = {
    id: number;
    label: string;
    color: string;
    // fase: "incoming" → vindo de fora para a órbita | "orbiting" → em órbita | "absorbing" → indo ao centro
    phase: "incoming" | "orbiting" | "absorbing";
    // posição atual
    x: number;
    y: number;
    // ângulo de órbita
    orbitAngle: number;
    orbitRadius: number;
    orbitSpeed: number;
    // origem (de onde saiu)
    startX: number;
    startY: number;
    // progresso da fase (0-1)
    progress: number;
    progressSpeed: number;
    opacity: number;
    fontSize: number;
};

function randomEdgePoint(w: number, h: number): { x: number; y: number } {
    const side = Math.floor(Math.random() * 4);
    switch (side) {
        case 0: return { x: Math.random() * w, y: -40 };
        case 1: return { x: w + 40,            y: Math.random() * h };
        case 2: return { x: Math.random() * w, y: h + 40 };
        default:return { x: -40,               y: Math.random() * h };
    }
}

const PHASE_MESSAGES = [
    "Analisando suas músicas...",
    "Identificando padrões emocionais...",
    "Construindo seu perfil...",
    "Calibrando dimensões...",
    "Quase pronto...",
];

export default function BuildingEmotionsPage() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<EmotionParticle[]>([]);
    const rafRef = useRef<number>();
    const counterRef = useRef(0);

    const [messageIndex, setMessageIndex] = useState(0);

    const { isSuccess } = useMoodProfile();

    // Rotaciona mensagem a cada 3s
    useEffect(() => {
        const t = setInterval(() => {
            setMessageIndex(i => (i + 1) % PHASE_MESSAGES.length);
        }, 3000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Spawna uma nova partícula de emoção
        const spawnParticle = () => {
            const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
            const { x, y } = randomEdgePoint(canvas.width, canvas.height);
            const orbitAngle  = Math.random() * Math.PI * 2;
            const orbitRadius = 90 + Math.random() * 60;
            const p: EmotionParticle = {
                id: counterRef.current++,
                label: emotion.label,
                color: emotion.color,
                phase: "incoming",
                x, y,
                startX: x,
                startY: y,
                orbitAngle,
                orbitRadius,
                orbitSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.008 + Math.random() * 0.012),
                progress: 0,
                progressSpeed: 0.004 + Math.random() * 0.004,
                opacity: 0,
                fontSize: 10 + Math.random() * 5,
            };
            particlesRef.current.push(p);
        };

        // Partículas de fundo (pontos)
        const bgDots = Array.from({ length: 180 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 0.4 + Math.random() * 1.8,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            alpha: 0.08 + Math.random() * 0.35,
            color: ["#10b981","#34d399","#6ee7b7","#ffffff"][Math.floor(Math.random() * 4)],
        }));

        let spawnTimer = 0;

        const draw = () => {
            const cx = canvas.width  * 0.5;
            const cy = canvas.height * 0.5;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fundo de pontos
            for (const d of bgDots) {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = d.color;
                ctx.globalAlpha = d.alpha;
                ctx.fill();
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0) d.x = canvas.width;
                if (d.x > canvas.width)  d.x = 0;
                if (d.y < 0) d.y = canvas.height;
                if (d.y > canvas.height) d.y = 0;
            }
            ctx.globalAlpha = 1;

            // Spawn periódico
            spawnTimer++;
            if (spawnTimer % 55 === 0) spawnParticle();

            // Atualiza e desenha partículas de emoção
            particlesRef.current = particlesRef.current.filter(p => p.opacity > 0 || p.phase !== "absorbing" || p.progress < 1);

            for (const p of particlesRef.current) {
                if (p.phase === "incoming") {
                    p.progress = Math.min(1, p.progress + p.progressSpeed);
                    p.opacity  = Math.min(1, p.progress * 3);

                    // Ponto destino na órbita
                    const targetX = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
                    const targetY = cy + Math.sin(p.orbitAngle) * p.orbitRadius;

                    // Ease-out
                    const t = 1 - Math.pow(1 - p.progress, 3);
                    p.x = p.startX + (targetX - p.startX) * t;
                    p.y = p.startY + (targetY - p.startY) * t;

                    if (p.progress >= 1) {
                        p.phase    = "orbiting";
                        p.progress = 0;
                    }

                } else if (p.phase === "orbiting") {
                    p.orbitAngle += p.orbitSpeed;
                    p.x = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
                    p.y = cy + Math.sin(p.orbitAngle) * p.orbitRadius;
                    p.progress += 0.002;
                    p.opacity = 1;

                    // Fica em órbita por um ciclo e meio, então começa a ser absorvida
                    if (p.progress >= 1) {
                        p.phase    = "absorbing";
                        p.startX   = p.x;
                        p.startY   = p.y;
                        p.progress = 0;
                    }

                } else if (p.phase === "absorbing") {
                    p.progress = Math.min(1, p.progress + p.progressSpeed * 1.5);
                    p.opacity  = 1 - p.progress;

                    const t = Math.pow(p.progress, 2); // ease-in
                    p.x = p.startX + (cx - p.startX) * t;
                    p.y = p.startY + (cy - p.startY) * t;
                }

                // Desenha o texto
                ctx.save();
                ctx.globalAlpha = p.opacity * 0.9;
                ctx.font = `700 ${p.fontSize}px monospace`;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur  = 8;
                ctx.textAlign   = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(p.label, p.x, p.y);
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div className="relative bg-black h-screen overflow-hidden flex items-center justify-center">
            <style>{`
                @keyframes coreGlow {
                    0%, 100% { box-shadow: 0 0 40px rgba(16,185,129,0.15), 0 0 80px rgba(16,185,129,0.06); }
                    50%      { box-shadow: 0 0 80px rgba(16,185,129,0.35), 0 0 160px rgba(16,185,129,0.12); }
                }
                @keyframes ringPulse {
                    0%, 100% { opacity: 0.06; }
                    50%      { opacity: 0.18; }
                }
                @keyframes fadeMsg {
                    0%   { opacity: 0; transform: translateY(6px); }
                    15%  { opacity: 1; transform: translateY(0); }
                    85%  { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-6px); }
                }
            `}</style>

            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Anéis orbitais decorativos */}
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

            {/* Núcleo */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div
                    className="w-24 h-24 rounded-full bg-[#080808] border border-emerald-500/30 flex items-center justify-center"
                    style={{ animation: "coreGlow 3s ease-in-out infinite" }}
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span className="text-3xl">🎵</span>
                    </div>
                </div>

                {/* Mensagem rotativa */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <p
                        key={messageIndex}
                        className="text-[11px] text-emerald-400/70 uppercase font-black tracking-[0.25em]"
                        style={{ animation: "fadeMsg 3s ease-in-out forwards" }}
                    >
                        {PHASE_MESSAGES[messageIndex]}
                    </p>
                    <h2 className="text-2xl font-black italic tracking-tighter text-white/10 uppercase">
                        construindo seu mood
                    </h2>
                </div>

                {/* Dots de loading */}
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-emerald-500"
                            style={{ animation: `ringPulse 1.2s ${i * 0.2}s ease-in-out infinite` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}