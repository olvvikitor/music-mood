"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBrand } from "@/shared/components/AppBrand";
import { LoginForm } from "./LoginForm";
import { LoginDivider } from "./LoginDivider";
import { OAuthProviders } from "./OAuthProviders";
import { loginWithEmail } from "../services/authApi";
import type { LoginFormData, ProviderConfig } from "../types";

interface LoginCardProps {
  providers: ProviderConfig[];
}

export function LoginCard({ providers }: LoginCardProps) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  async function handleEmailLogin(data: LoginFormData) {
    setServerError(null);
    setLoading(true);
    try {
      const result = await loginWithEmail(data.email, data.password);
      localStorage.setItem("auth_token", result.token);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err.message ?? "Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="glass-card w-full max-w-[420px] flex flex-col gap-0 overflow-hidden"
      style={{ animation: "fadeSlideIn 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      {/* Header strip */}
      <div
        className="px-7 pt-7 pb-6 flex flex-col gap-1"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <AppBrand className="text-2xl" />
        <p className="text-xs text-white/35 mt-1" style={{ fontFamily: "var(--font-body)" }}>
          Desbloqueie seu universo emocional
        </p>
      </div>

      <LoginForm onSubmit={handleEmailLogin} loading={loading} serverError={serverError} />

      <div className="px-7 pb-7 flex flex-col gap-4">
        <LoginDivider />
        <OAuthProviders providers={providers} />
      </div>
    </div>
  );
}
