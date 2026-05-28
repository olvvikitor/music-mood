"use client";
import { useState, useCallback, type FormEvent } from "react";
import { Mail, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import type { LoginFormData, FieldError, ValidationResult } from "../types";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  serverError: string | null;
}

function validateEmail(value: string): string | null {
  if (!value.trim()) return "E-mail é obrigatório";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Formato de e-mail inválido";
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return "Senha é obrigatória";
  if (value.length < 6) return "Mínimo de 6 caracteres";
  return null;
}

function validateAll(data: LoginFormData): ValidationResult {
  const errors: FieldError[] = [];
  const emailErr = validateEmail(data.email);
  const passErr = validatePassword(data.password);
  if (emailErr) errors.push({ field: "email", message: emailErr });
  if (passErr) errors.push({ field: "password", message: passErr });
  return { valid: errors.length === 0, errors };
}

export function LoginForm({ onSubmit, loading, serverError }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [touched, setTouched] = useState<Set<"email" | "password">>(new Set());

  const getFieldError = useCallback(
    (field: "email" | "password"): string | null => {
      if (!touched.has(field)) return null;
      return errors.find((e) => e.field === field)?.message ?? null;
    },
    [errors, touched],
  );

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => new Set(prev).add(field));
    setFocusedField(null);
    const value = field === "email" ? email : password;
    const err = field === "email" ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => {
      const filtered = prev.filter((e) => e.field !== field);
      if (err) filtered.push({ field, message: err });
      return filtered;
    });
  };

  const handleChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value);
    else setPassword(value);
    setErrors((prev) => prev.filter((e) => e.field !== field));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(new Set(["email", "password"]));
    const result = validateAll({ email, password });
    setErrors(result.errors);
    if (!result.valid) return;
    await onSubmit({ email, password });
  };

  const isFormValid = email.trim().length > 0 && password.length >= 6 && !loading;
  const emailError = getFieldError("email");
  const passwordError = getFieldError("password");

  const inputStyle = (field: string) => ({
    background: "var(--surface-input)",
    border:
      focusedField === field
        ? "1px solid rgba(111,174,155,0.35)"
        : getFieldError(field as "email" | "password")
          ? "1px solid rgba(251,113,133,0.35)"
          : "1px solid var(--border-medium)",
    boxShadow:
      focusedField === field
        ? "0 0 0 3px rgba(111,174,155,0.06)"
        : getFieldError(field as "email" | "password")
          ? "0 0 0 3px rgba(251,113,133,0.06)"
          : "none",
    fontFamily: "var(--font-body)",
  });

  return (
    <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-[10px] uppercase tracking-[0.15em] text-white/30"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          E-mail
        </label>
        <div className="relative">
          <Mail
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-200 ${
              focusedField === "email" ? "text-brand-primary" : "text-white/20"
            }`}
          />
          <input
            type="email"
            placeholder="seu@email.com"
            required
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => handleBlur("email")}
            className="w-full text-sm text-white placeholder:text-white/20 pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
            style={inputStyle("email")}
          />
        </div>
        {emailError && (
          <p className="text-[10px] text-rose-400" style={{ fontFamily: "var(--font-body)" }}>
            {emailError}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-[10px] uppercase tracking-[0.15em] text-white/30"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Senha
        </label>
        <div className="relative">
          <KeyRound
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-200 ${
              focusedField === "password" ? "text-brand-primary" : "text-white/20"
            }`}
          />
          <input
            type="password"
            placeholder="********"
            required
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => handleBlur("password")}
            className="w-full text-sm text-white placeholder:text-white/20 pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
            style={inputStyle("password")}
          />
        </div>
        {passwordError && (
          <p className="text-[10px] text-rose-400" style={{ fontFamily: "var(--font-body)" }}>
            {passwordError}
          </p>
        )}
        <div className="flex justify-end">
          <a
            href="#"
            className="text-[11px] text-white/25 hover:text-brand-primary transition-colors duration-200"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Esqueceu a senha?
          </a>
        </div>
      </div>

      {serverError && (
        <p
          className="text-[11px] text-rose-400 text-center"
          style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
        >
          {serverError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #6fae9b, #5f9d8c)",
          color: "#07070c",
          boxShadow: "0 0 24px rgba(111,174,155,0.25)",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
        }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {loading ? "Entrando..." : "Entrar"}
      </button>

      {/* Create account link */}
      <p className="text-center">
        <a
          href="#"
          className="text-[11px] text-white/25 hover:text-brand-primary transition-colors duration-200"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Criar conta
        </a>
      </p>
    </form>
  );
}
