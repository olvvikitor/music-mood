"use client";

import { JSX } from "react";

// ── Mood Icons — linha fina, stroke-based, 24×24 viewBox ──────────────────────
// Cada ícone é um componente React que aceita color e size como props.
// Uso: <MoodIcon mood="tô voando" color="#34d399" size={24} />

type IconProps = { color?: string; size?: number };

const icons: Record<string, (p: IconProps) => JSX.Element> = {

  // 🔥 Positivo + Alta Energia

  "tô voando": ({ color = "currentColor", size = 24 }) => (
    // Foguete subindo
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 16 6 16 11a4 4 0 0 1-8 0C8 6 12 2 12 2z" />
      <path d="M8 11l-3 4h14l-3-4" />
      <line x1="10" y1="19" x2="9" y2="22" />
      <line x1="14" y1="19" x2="15" y2="22" />
      <circle cx="12" cy="10" r="1.5" fill={color} stroke="none" />
    </svg>
  ),

  "na minha era": ({ color = "currentColor", size = 24 }) => (
    // Coroa
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17L5 8l4.5 4.5L12 5l2.5 7.5L19 8l2 9H3z" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  ),

  "adrenalina pura": ({ color = "currentColor", size = 24 }) => (
    // Raio duplo
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L6 13h6l-1 9 9-11h-6l1-9z" />
    </svg>
  ),

  "caos controlado": ({ color = "currentColor", size = 24 }) => (
    // Espiral controlada
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12c0 0-6-3-6-7a6 6 0 0 1 12 0c0 4-6 7-6 7z" />
      <path d="M12 12c0 0 6 3 6 7a6 6 0 0 1-12 0c0-4 6-7 6-7z" />
    </svg>
  ),

  // 🌤 Positivo + Baixa Energia

  "apaixonadx": ({ color = "currentColor", size = 24 }) => (
    // Coração com pulso
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z" />
      <path d="M7 11h2l1.5-3 2 5 1.5-2H17" />
    </svg>
  ),

  "no calor do abraço": ({ color = "currentColor", size = 24 }) => (
    // Dois arcos se encontrando (abraço)
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a4 4 0 0 0 0 8" />
      <path d="M18 8a4 4 0 0 1 0 8" />
      <circle cx="9" cy="7" r="2" />
      <circle cx="15" cy="7" r="2" />
      <path d="M9 13h6" />
      <path d="M9 16c0 1.5 6 1.5 6 0" />
    </svg>
  ),

  "saudade boa": ({ color = "currentColor", size = 24 }) => (
    // Sol nascendo sobre linha do horizonte
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17a7 7 0 0 1 14 0" />
      <line x1="12" y1="3" x2="12" y2="5" />
      <line x1="4.22" y1="6.22" x2="5.64" y2="7.64" />
      <line x1="1" y1="13" x2="3" y2="13" />
      <line x1="21" y1="13" x2="23" y2="13" />
      <line x1="18.36" y1="7.64" x2="19.78" y2="6.22" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  ),

  "na paz": ({ color = "currentColor", size = 24 }) => (
    // Onda suave
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9c2-2 4 0 6 0s4-2 6 0 4 0 6 0" />
      <path d="M2 13c2-2 4 0 6 0s4-2 6 0 4 0 6 0" />
      <path d="M2 17c2-2 4 0 6 0s4-2 6 0 4 0 6 0" />
    </svg>
  ),

  "zerado": ({ color = "currentColor", size = 24 }) => (
    // Folha / planta minimalista
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M12 12C12 12 6 10 5 5c5 0 7 3 7 7z" />
      <path d="M12 12c0 0 6-2 7-7-5 0-7 3-7 7z" />
    </svg>
  ),

  "viajando": ({ color = "currentColor", size = 24 }) => (
    // Estrelas / cosmos
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18" strokeDasharray="2 2" />
      <circle cx="8" cy="9" r="1" fill={color} stroke="none" />
      <circle cx="14" cy="7" r="0.75" fill={color} stroke="none" />
      <circle cx="16" cy="13" r="1" fill={color} stroke="none" />
      <circle cx="9" cy="15" r="0.75" fill={color} stroke="none" />
    </svg>
  ),

  // ⚡ Negativo + Alta Energia

  "pressentindo": ({ color = "currentColor", size = 24 }) => (
    // Triângulo de alerta com ponto de interrogação
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L2 20h20L12 3z" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <circle cx="12" cy="17" r="0.5" fill={color} stroke="none" />
    </svg>
  ),

  "engolindo seco": ({ color = "currentColor", size = 24 }) => (
    // Boca fechada com linha de tensão
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 15h6" />
      <circle cx="9" cy="10" r="1" fill={color} stroke="none" />
      <circle cx="15" cy="10" r="1" fill={color} stroke="none" />
      <path d="M7 7l2 1M17 7l-2 1" />
    </svg>
  ),

  "tô no limite": ({ color = "currentColor", size = 24 }) => (
    // Medidor no vermelho
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17a7 7 0 0 1 14 0" />
      <line x1="12" y1="17" x2="17" y2="10" />
      <circle cx="12" cy="17" r="1.5" fill={color} stroke="none" />
      <line x1="5" y1="17" x2="3" y2="17" />
      <line x1="19" y1="17" x2="21" y2="17" />
      <line x1="12" y1="10" x2="12" y2="8" />
    </svg>
  ),

  "surtando": ({ color = "currentColor", size = 24 }) => (
    // Explosão / burst
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2 4 4-1-2 4 4 2-4 1 1 4-3-3-3 3 1-4-4-1 4-2-2-4 4 1 2-4z" />
    </svg>
  ),

  // 🌧 Negativo + Baixa Energia

  "chorando no banheiro": ({ color = "currentColor", size = 24 }) => (
    // Nuvem com gotas de chuva
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 14a4 4 0 0 1 .5-8A5 5 0 0 1 17 8a3 3 0 0 1-1 6H6z" />
      <line x1="8" y1="18" x2="8" y2="20" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="16" y1="18" x2="16" y2="20" />
    </svg>
  ),

  "apagado": ({ color = "currentColor", size = 24 }) => (
    // Bateria vazia
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="16" height="8" rx="2" />
      <line x1="20" y1="11" x2="20" y2="13" strokeWidth="2.5" />
      <line x1="5" y1="12" x2="5" y2="12" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),

  // 🌀 Centro / Transição

  "alma aberta": ({ color = "currentColor", size = 24 }) => (
    // Peito aberto / flor
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />
    </svg>
  ),

  "tô confuso": ({ color = "currentColor", size = 24 }) => (
    // Setas circulares conflitantes
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4" />
      <path d="M3 9l3-3-3-3" />
      <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
      <path d="M21 15l-3 3 3 3" />
      <path d="M12 7v10M8 10l4-3 4 3" />
    </svg>
  ),

  "travado": ({ color = "currentColor", size = 24 }) => (
    // Cadeado aberto pela metade
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-1.9" />
      <circle cx="12" cy="16" r="1" fill={color} stroke="none" />
    </svg>
  ),
};

// ── Componente público ─────────────────────────────────────────────────────────
type MoodIconProps = {
  mood: string;
  color?: string;
  size?: number;
  className?: string;
};

export function MoodIcon({ mood, color = "currentColor", size = 24, className }: MoodIconProps) {
  const Icon = icons[mood];
  if (!Icon) {
    // Fallback: nota musical
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    );
  }
  return (
    <span className={className}>
      <Icon color={color} size={size} />
    </span>
  );
}

export { icons as moodIcons };