"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { ProviderConfig } from "../types";

interface OAuthProvidersProps {
  providers: ProviderConfig[];
}

export function OAuthProviders({ providers }: OAuthProvidersProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-2">
      {providers.map((p) => {
        const isLoading = loadingId === p.id;

        return (
          <a
            key={p.id}
            href={p.href}
            title={p.label}
            onClick={(e) => {
              e.preventDefault();
              setLoadingId(p.id);
              setTimeout(() => {
                window.location.href = p.href;
              }, 150);
            }}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 active:scale-95"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-medium)",
              color: p.color,
              pointerEvents: isLoading ? "none" : "auto",
            }}
            onMouseEnter={(e) => {
              if (isLoading) return;
              e.currentTarget.style.background = `${p.color}12`;
              e.currentTarget.style.borderColor = `${p.color}35`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface-card)";
              e.currentTarget.style.borderColor = "var(--border-medium)";
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: p.color }} />
            ) : (
              p.icon
            )}
            <span
              className="text-[9px] uppercase tracking-wider text-white/30"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              {p.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
