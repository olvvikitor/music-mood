"use client";

import { useEffect, useState, Suspense } from "react";
import { Bell, Mail, BarChart3, ChevronRight, Loader2, Check, Lock, Eye, EyeOff, ShieldCheck, Camera, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRefreshProfile } from "../dashboard/services/getRefreshProfileService";
import { usePlataformProfile } from "./hooks/useMoodProfile";
import { updateProfileService } from "./services/updateProfileService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ParticleBackground } from "@/shared/components/orbital/ParticlesBackgorund";
import { AppBrand } from "@/shared/components/AppBrand";
import { setPasswordService } from "./services/setPasswordService";
import { uploadFacePhotoService } from "./services/uploadFacePhotoService";
import { CameraCapture } from "./components/CameraCapture";

export type FormAceptNotification = { push: boolean; email: boolean; weekly: boolean };

const NOTIFICATION_OPTIONS = [
  { id: "push" as const, label: "Push", description: "Alertas em tempo real", icon: <Bell className="w-3 h-3" /> },
  { id: "email" as const, label: "E-mail", description: "Insights no seu e-mail", icon: <Mail className="w-3 h-3" /> },
  { id: "weekly" as const, label: "Resumo semanal", description: "Relatorio toda semana", icon: <BarChart3 className="w-3 h-3" /> },
];

// â”€â”€ Toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative shrink-0 w-9 h-5 rounded-full transition-all duration-300 focus:outline-none"
      style={{
        background: checked
          ? "linear-gradient(135deg, #6fae9b, #5f9d8c)"
          : "rgba(255,255,255,0.08)",
        border: checked ? "1px solid rgba(111,174,155,0.4)" : "1px solid rgba(255,255,255,0.1)",
        boxShadow: checked ? "0 0 12px rgba(111,174,155,0.3)" : "none",
      }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
        style={{
          left: checked ? "calc(100% - 18px)" : "2px",
          background: checked ? "#07070c" : "rgba(255,255,255,0.3)",
        }}
      />
    </button>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = searchParams.get("token");
    const isNew = searchParams.get("new");
    if (token) {
      localStorage.setItem("auth_token", token);
      if (isNew === "false") {
        router.push("/dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  const { data, isLoading, isError } = usePlataformProfile();
  const [notifications, setNotifications] = useState<FormAceptNotification>({ push: false, email: false, weekly: false });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [facePhotoFile, setFacePhotoFile] = useState<File | null>(null);
  const [facePhotoPreview, setFacePhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  useEffect(() => {
    if (!facePhotoFile) {
      setFacePhotoPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(facePhotoFile);
    setFacePhotoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [facePhotoFile]);

  const { mutate: refreshUser } = useMutation({
    mutationFn: getRefreshProfile,
    onSuccess: async () => {
      router.push("/build-mood");
      await queryClient.invalidateQueries({ queryKey: ["moodProfile"] });
    },
  });

  const handleConfirm = async () => {
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    if (!passwordsMatch) { setError("As senhas nao coincidem."); return; }
    if (facePhotoFile && facePhotoFile.size > 5 * 1024 * 1024) {
      setError("A foto deve ter no maximo 5MB.");
      return;
    }

    setConfirming(true);
    setError(null);
    try {
      if (facePhotoFile) {
        try {
          await uploadFacePhotoService(facePhotoFile);
        } catch (photoErr: any) {
          setError(`Foto: ${photoErr.message || "falha no upload da imagem."}`);
          setConfirming(false);
          return;
        }
      }

      await updateProfileService(notifications);
      await setPasswordService(password);
      setConfirmed(true);
      refreshUser(undefined);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar.");
      setConfirming(false);
    }
  };

  const inputStyle = (field: string) => ({
    background: "var(--surface-input)",
    border: focusedField === field
      ? "1px solid rgba(111,174,155,0.35)"
      : "1px solid var(--border-medium)",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(111,174,155,0.06)" : "none",
    fontFamily: "var(--font-body)",
    transition: "all 0.2s ease",
    color: "var(--text-primary)",
  });

  return (
    <div
      className="glass-card w-full overflow-hidden"
      style={{ animation: "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-5 flex flex-col items-center gap-1 text-center"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <p className="text-[9px] uppercase tracking-[0.3em] font-700 text-white/25"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
          Quase la
        </p>
        <AppBrand className="text-xl mt-0.5" />
        <p className="text-[11px] text-white/30 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
          Configure sua conta para continuar
        </p>
      </div>

      {/* Profile preview */}
      <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        {isLoading ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-white/8 shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 bg-white/8 rounded-md w-28" />
              <div className="h-2 bg-white/5 rounded-md w-40" />
            </div>
          </div>
        ) : isError || !data ? (
          <p className="text-[11px] text-rose-400 text-center">Nao foi possivel carregar o perfil.</p>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full shrink-0 p-0.5"
              style={{ background: "linear-gradient(135deg, #6fae9b, #8a7bb8)" }}>
              <img src={data.img_profile} alt="Avatar"
                className="w-full h-full rounded-full object-cover"
                style={{ border: "1.5px solid #07070c" }} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-700 text-white truncate"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                {data.display_name}
              </span>
              <span className="text-[11px] text-white/30 truncate">{data.email}</span>
            </div>
            <div className="ml-auto shrink-0 px-2 py-0.5 rounded-full text-[9px] font-700 uppercase tracking-wider"
              style={{
                background: "rgba(111,174,155,0.08)",
                border: "1px solid rgba(111,174,155,0.2)",
                color: "#6fae9b",
                fontFamily: "var(--font-display)",
              }}>
              {data.provider}
            </div>
          </div>
        )}

        <div className="mt-3 rounded-xl p-3"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-medium)",
          }}>
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-3.5 h-3.5 text-white/20" />
            <span className="text-[10px] uppercase tracking-[0.15em] font-700 text-white/25"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Foto do rosto
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 relative group"
              style={{ border: "2px solid var(--border-strong)" }}>
              <img
                src={facePhotoPreview ?? data?.face_photo_path ?? data?.img_profile ?? ""}
                alt="Previa da foto"
                className="w-full h-full object-cover"
              />
              {(facePhotoPreview || data?.face_photo_path) && (
                <button
                  type="button"
                  onClick={() => { setFacePhotoFile(null); setFacePhotoPreview(null); }}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <X className="w-5 h-5 text-white/80" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label
                className="cursor-pointer rounded-lg px-3 py-2 text-[11px] font-600 text-white/70 transition-colors text-center"
                style={{
                  background: "var(--surface-card-alt)",
                  border: "1px dashed var(--border-strong)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                }}
              >
                {facePhotoFile ? facePhotoFile.name : "Escolher arquivo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const next = e.target.files?.[0] ?? null;
                    setFacePhotoFile(next);
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-600 transition-all active:scale-95"
                style={{
                  background: "var(--surface-card-alt)",
                  border: "1px solid var(--border-medium)",
                  color: "#6fae9b",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                }}
              >
                <Camera className="w-3 h-3" />
                Tirar foto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security section */}
      <div className="px-6 py-5 flex flex-col gap-3"
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          animation: "fadeUp 0.5s 0.15s ease-out both",
          opacity: 0,
        }}>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-white/20" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-700 text-white/25"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Seguranca
          </span>
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${focusedField === "pw" ? "text-brand-primary" : "text-white/20"}`} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Crie uma senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusedField("pw")}
            onBlur={() => setFocusedField(null)}
            className="w-full text-sm pl-10 pr-10 py-3 rounded-xl outline-none placeholder:text-white/20"
            style={inputStyle("pw")}
          />
          <button type="button" onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors">
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Confirm */}
        <div className="relative">
          <Check className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${passwordsMatch ? "text-brand-primary" : "text-white/20"}`} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            onFocus={() => setFocusedField("cpw")}
            onBlur={() => setFocusedField(null)}
            className="w-full text-sm pl-10 pr-4 py-3 rounded-xl outline-none placeholder:text-white/20"
            style={inputStyle("cpw")}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="px-6 py-5 flex flex-col gap-2.5"
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          animation: "fadeUp 0.5s 0.25s ease-out both",
          opacity: 0,
        }}>
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-3.5 h-3.5 text-white/20" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-700 text-white/25"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Notificacoes
          </span>
        </div>

        {NOTIFICATION_OPTIONS.map(opt => (
          <div key={opt.id} className="flex items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-white/20 shrink-0">{opt.icon}</span>
              <div className="min-w-0">
                <p className="text-[12px] font-600 text-white/70 truncate"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  {opt.label}
                </p>
                <p className="text-[10px] text-white/25 truncate">{opt.description}</p>
              </div>
            </div>
            <Toggle
              checked={notifications[opt.id]}
              onChange={() => setNotifications(p => ({ ...p, [opt.id]: !p[opt.id] }))}
            />
          </div>
        ))}
      </div>

      {/* Error + CTA */}
      <div className="px-6 pb-6 pt-4 flex flex-col gap-3"
        style={{ animation: "fadeUp 0.5s 0.35s ease-out both", opacity: 0 }}>
        {error && (
          <div className="rounded-lg px-3 py-2 text-center"
            style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)" }}>
            <p className="text-[11px] text-rose-400 font-500"
              style={{ fontFamily: "var(--font-body)" }}>
              {error}
            </p>
          </div>
        )}
        <button
          onClick={handleConfirm}
          disabled={confirming || confirmed || isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-800 uppercase tracking-widest transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          style={{
            background: confirmed
              ? "rgba(111,174,155,0.1)"
              : "linear-gradient(135deg, #6fae9b, #5f9d8c)",
            color: confirmed ? "#6fae9b" : "#07070c",
            border: confirmed ? "1px solid rgba(111,174,155,0.3)" : "none",
            boxShadow: confirmed ? "none" : "0 0 24px rgba(111,174,155,0.25)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
          }}>
          {confirmed ? (
            <><Check className="w-4 h-4" /> Tudo certo!</>
          ) : confirming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>Comecar <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={(file) => {
            setFacePhotoFile(file);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4"
      style={{ background: "var(--bg-page)" }}>
      <ParticleBackground count={150} speed={0.25} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(111,174,155,0.04), transparent 65%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-[360px] flex flex-col gap-3">
        <Suspense fallback={
          <div className="glass-card p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#6fae9b" }} />
          </div>
        }>
          <OnboardingContent />
        </Suspense>

        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-700"
            style={{ fontFamily: "var(--font-display)" }}>
            Servico online
          </span>
        </div>
      </div>
    </div>
  );
}

