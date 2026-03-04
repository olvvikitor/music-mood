"use client"
import { useState, useEffect, useRef } from "react";
import { Sparkles, Bell, Mail, BarChart3, Check, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRefreshProfile } from "../dashboard/services/getRefreshProfileService";
import { usePlataformProfile } from "./hooks/useMoodProfile";
import { updateProfileService } from "./services/updateProfileService";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type NotificationOption = {
  id: "push" | "email" | "weekly";
  label: string;
  description: string;
  icon: React.ReactNode;
};

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  {
    id: "push",
    label: "Notificações Push",
    description: "Alertas em tempo real no seu navegador",
    icon: <Bell className="w-4 h-4" />,
  },
  {
    id: "email",
    label: "E-mail",
    description: "Receba insights no seu e-mail",
    icon: <Mail className="w-4 h-4" />,
  },
  {
    id: "weekly",
    label: "Resumo Semanal",
    description: "Um relatório do seu humor musical toda semana",
    icon: <BarChart3 className="w-4 h-4" />,
  },
];
export type FormAceptNotification = {
  push: boolean,
  email: boolean,
  weekly: boolean,
}

export default function OnboardingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const queryCliente = useQueryClient();

  const { data, isLoading, isError } = usePlataformProfile()


  const [notifications, setNotifications] = useState<FormAceptNotification>({
    push: false,
    email: false,
    weekly: false,
  });

  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);


  // Canvas de partículas (mesmo do login)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#ffffff"];
    const dots = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.4 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: 0.1 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of dots) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const toggleNotification = (id: keyof FormAceptNotification) => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const { mutate: refreshUser, isPending } = useMutation({
    mutationFn: getRefreshProfile,
    onMutate: () => { router.push("/builld-emotional-page"); },
    onSuccess: async () => {
      await queryCliente.invalidateQueries({ queryKey: ['moodProfile'] });
    },
    onSettled: () => { router.push("/dashboard"); }
  });

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await updateProfileService(notifications)
      refreshUser()
      setConfirmed(true);

    } catch {
      setConfirming(false);
    }
  };

  return (
    <div className="relative bg-black overflow-hidden h-screen flex items-center justify-center">
      <style>{`
                @keyframes coreGlow {
                    0%, 100% { box-shadow: 0 0 40px rgba(16,185,129,0.12), 0 0 80px rgba(16,185,129,0.05); }
                    50%      { box-shadow: 0 0 80px rgba(16,185,129,0.28), 0 0 160px rgba(16,185,129,0.08); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-150 h-150 bg-emerald-500/5 blur-[140px] rounded-full" />
      </div>

      {/* ── CARD ── */}
      <div className="relative z-10 w-full max-w-md px-5 py-6"
        style={{ animation: "scaleIn 0.5s ease-out both" }}>
        <div className="flex flex-col gap-6 border border-white/10 rounded-2xl backdrop-blur-xl p-7"
          style={{
            background: "rgba(10,10,10,0.85)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.7)",
          }}>

          {/* Header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500">Quase lá</p>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
              Music<span className="text-emerald-500">Mood</span>
            </h1>
            <p className="text-[11px] text-slate-500 mt-1">
              Confirme suas informações para continuar
            </p>
          </div>

          <div className="h-px bg-white/5" />

          {/* Perfil */}
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
            </div>
          ) : isError || !data ? (
            <div className="text-center py-4">
              <p className="text-[11px] text-rose-400">Não foi possível carregar seu perfil.</p>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]"
              style={{ animation: "fadeUp 0.5s 0.2s ease-out both", opacity: 0 }}>
              <div className="relative shrink-0">
                <img
                  src={data.img_profile}
                  alt={data.display_name}
                  className="w-14 h-14 rounded-full object-cover border border-emerald-500/20"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{data.display_name}</p>
                <p className="text-slate-400 text-xs truncate">{data.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] uppercase font-black tracking-widest text-emerald-500/70 border border-emerald-500/20 rounded-full px-2 py-0.5">
                    {data.provider}
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono">{data.country}</span>
                </div>
              </div>
            </div>
          )}

          <div className="h-px bg-white/5" />

          {/* Notificações */}
          <div className="flex flex-col gap-3"
            style={{ animation: "fadeUp 0.5s 0.35s ease-out both", opacity: 0 }}>
            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500">
              Notificações
            </p>
            {NOTIFICATION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleNotification(opt.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 text-left
                                    ${notifications[opt.id]
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20"
                  }`}
              >
                <span className={`shrink-0 transition-colors duration-300 ${notifications[opt.id] ? "text-emerald-400" : "text-slate-600"}`}>
                  {opt.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight">{opt.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{opt.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300
                                    ${notifications[opt.id]
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-white/20"
                  }`}>
                  {notifications[opt.id] && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>

          <div className="h-px bg-white/5" />

          {/* Botão confirmar */}
          <button
            onClick={handleConfirm}
            disabled={confirming || confirmed || isLoading || isError}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300
                            ${confirmed
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 cursor-default"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 active:scale-[0.98]"
              }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
            style={{ animation: "fadeUp 0.5s 0.45s ease-out both", opacity: 0 }}
          >
            {confirmed ? (
              <>
                <Check className="w-4 h-4" />
                Tudo certo! Redirecionando...
              </>
            ) : confirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Confirmar e começar
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Status */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[9px] uppercase font-bold tracking-widest text-slate-600">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Serviço online</span>
        </div>
      </div>
    </div>
  );
}