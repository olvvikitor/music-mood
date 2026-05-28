interface LoginDividerProps {
  label?: string;
}

export function LoginDivider({ label = "ou conecte via" }: LoginDividerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
      <span
        className="text-[9px] uppercase tracking-[0.2em] text-white/20 shrink-0"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
    </div>
  );
}
