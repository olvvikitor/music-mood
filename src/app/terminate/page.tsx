"use client"
import { useEffect, useRef, useState } from "react";
import { Sparkles, Bell, Mail, BarChart3, Check, ChevronRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRefreshProfile } from "../dashboard/services/getRefreshProfileService";
import { usePlataformProfile } from "./hooks/useMoodProfile";
import { updateProfileService } from "./services/updateProfileService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ParticleBackground } from "@/shared/components/orbital/ParticlesBackgorund";

type NotificationOption = {
  id: "push" | "email" | "weekly";
  label: string;
  description: string;
  icon: React.ReactNode;
};

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  { id: "push",   label: "Notificações Push", description: "Alertas em tempo real no seu navegador",        icon: <Bell className="w-3.5 h-3.5" /> },
  { id: "email",  label: "E-mail",            description: "Receba insights no seu e-mail",                 icon: <Mail className="w-3.5 h-3.5" /> },
  { id: "weekly", label: "Resumo Semanal",    description: "Um relatório do seu humor musical toda semana", icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

export type FormAceptNotification = { push: boolean; email: boolean; weekly: boolean };

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // 1. Salva o token
      localStorage.setItem('auth_token', token);

    } else {
      // Caso não haja token, manda de volta para o login
      router.push('/login');
    }
  }, [searchParams, router]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const queryCliente = useQueryClient();

  const { data, isLoading, isError } = usePlataformProfile();

  const [notifications, setNotifications] = useState<FormAceptNotification>({ push: false, email: false, weekly: false });
  const [confirming, setConfirming] = useState(false);
  const [confirmed,  setConfirmed]  = useState(false);

  const toggleNotification = (id: keyof FormAceptNotification) =>
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }));

  const { mutate: refreshUser } = useMutation({
    mutationFn: getRefreshProfile,
    onMutate:   () => { router.push("/build-mood"); },
    onSuccess:  async () => { await queryCliente.invalidateQueries({ queryKey: ["moodProfile"] }); },
    onSettled:  () => { router.push("/dashboard"); },
  });

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await updateProfileService(notifications);
      refreshUser();
      setConfirmed(true);
    } catch {
      setConfirming(false);
    }
  };

  return (
    <div className="relative bg-black overflow-hidden h-screen flex items-center justify-center">
      <ParticleBackground count={200} speed={0.3} />

      {/* card — largura fixa 320px */}
      <div className="relative z-10 w-[320px]" style={{ animation: "scaleIn 0.5s ease-out both" }}>
        <div
          className="flex flex-col gap-3 border border-white/10 rounded-2xl backdrop-blur-xl p-4"
          style={{
            background: "rgba(10,10,10,0.88)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 60px rgba(0,0,0,0.7)",
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <p className="text-[8px] uppercase font-black tracking-[0.3em] text-slate-500">Quase lá</p>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none mt-0.5">
              Music<span className="text-emerald-500">Mood</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Confirme suas informações para continuar
            </p>
          </div>

          <div className="h-px bg-white/5" />

          {/* Perfil */}
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
            </div>
          ) : isError || !data ? (
            <p className="text-[10px] text-rose-400 text-center py-1">Não foi possível carregar seu perfil.</p>
          ) : (
            <div
              className="flex items-center gap-3 p-2.5 rounded-xl border border-white/10 bg-white/[0.02]"
              style={{ animation: "fadeUp 0.5s 0.2s ease-out both", opacity: 0 }}
            >
              <div className="relative shrink-0">
                <img src={data.img_profile} alt={data.display_name}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-500/20" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                  <Check className="w-1.5 h-1.5 text-black" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-xs truncate">{data.display_name}</p>
                <p className="text-slate-400 text-[10px] truncate">{data.email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] uppercase font-black tracking-widest text-emerald-500/70 border border-emerald-500/20 rounded-full px-1.5 py-px">
                    {data.provider}
                  </span>
                  <span className="text-[8px] text-slate-600 font-mono">{data.country}</span>
                </div>
              </div>
            </div>
          )}

          <div className="h-px bg-white/5" />

          {/* Notificações */}
          <div className="flex flex-col gap-1.5" style={{ animation: "fadeUp 0.5s 0.35s ease-out both", opacity: 0 }}>
            <p className="text-[8px] uppercase font-black tracking-[0.2em] text-slate-500">Notificações</p>
            {NOTIFICATION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleNotification(opt.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 text-left
                  ${notifications[opt.id]
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20"
                  }`}
              >
                <span className={`shrink-0 transition-colors duration-300 ${notifications[opt.id] ? "text-emerald-400" : "text-slate-600"}`}>
                  {opt.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold leading-tight">{opt.label}</p>
                  <p className="text-[9px] text-slate-500">{opt.description}</p>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300
                  ${notifications[opt.id] ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}>
                  {notifications[opt.id] && <Check className="w-2 h-2 text-black" strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>

          <div className="h-px bg-white/5" />

          {/* Botão */}
          <button
            onClick={handleConfirm}
            disabled={confirming || confirmed || isLoading || isError}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all duration-300
              ${confirmed
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 cursor-default"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 active:scale-[0.98]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ animation: "fadeUp 0.5s 0.45s ease-out both", opacity: 0 }}
          >
            {confirmed ? (
              <><Check className="w-3.5 h-3.5" />Tudo certo! Redirecionando...</>
            ) : confirming ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>Confirmar e começar<ChevronRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

        {/* Status */}
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[8px] uppercase font-bold tracking-widest text-slate-600">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span>Serviço online</span>
        </div>
      </div>
    </div>
  );
}