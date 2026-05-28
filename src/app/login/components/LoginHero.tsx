interface LoginHeroProps {
  className?: string;
}

export function LoginHero({ className = "" }: LoginHeroProps) {
  return (
    <div
      className={`hidden lg:flex flex-col gap-3 pointer-events-none select-none ${className}`}
      style={{ animation: "fadeUp 0.8s 0.4s ease-out both" }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.35em]"
        style={{ color: "var(--color-brand-accent)", fontFamily: "var(--font-display)", fontWeight: 800 }}
      >
        Análise emocional de música
      </p>
      <h2
        className="text-6xl xl:text-7xl font-black uppercase leading-[0.88] text-white/10"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Sua<br />alma<br />em notas
      </h2>
    </div>
  );
}
