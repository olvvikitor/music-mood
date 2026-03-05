
interface LoadingProps {
  type?: 'profile' | 'list' | "header" | "emotionalChart"|"listCompact";
}

export default function LoadingComponent({ type = 'list' }: LoadingProps) {
  if (type === 'profile') {
    return (
      <div className="md:col-span-4 glass-card p-6 flex flex-col gap-6 h-full animate-pulse">

        {/* 1. SEÇÃO PERFIL (Header) */}
        <div className="flex justify-between pr-5">
          {/* Avatar Circle */}
          <div className="w-14 h-14 rounded-full bg-white/10 shrink-0" />

          {/* Name and Plan */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-32 bg-white/10 rounded-md" />
            <div className="h-6 w-20 bg-blue-400/10 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 items-center pt-4 border-t border-white/5">

          {/* 2. TEXTO INFORMATIVO (Mood Label) */}
          <div className="flex flex-col gap-2 items-center">
            <div className="h-3 w-24 bg-white/5 rounded" />
            <div className="h-4 w-16 bg-white/10 rounded" />
          </div>

          {/* 3. GIF / MOOD IMAGE PLACEHOLDER */}
          <div className="flex justify-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-xl bg-white/5" />
          </div>

        </div>
      </div>
    );
  }
  if (type === "header") {
    return (
      <div className="flex items-center gap-2 p-1 pr-3 rounded-full glass-card animate-pulse">
        {/* Círculo da foto */}
        <div className="w-8 h-8 rounded-full bg-white/10" />

        {/* Barrinha simulando o nome */}
        <div className="h-3 bg-white/10 w-16 rounded-md" />
      </div>
    )
  }

  if (type === "emotionalChart") {
    return (
      <div className="flex flex-col gap-3 h-full animate-pulse">

        {/* ── Hero: Sentimento principal Skeleton ── */}
        <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.03] relative overflow-hidden">
          <div className="relative flex flex-col gap-4">

            {/* Topo: label + emoji placeholder */}
            <div className="flex items-center justify-between">
              <div className="h-2 w-24 bg-white/10 rounded-full" />
              <div className="w-8 h-8 bg-white/10 rounded-lg" />
            </div>

            {/* Nome do sentimento placeholder */}
            <div className="flex flex-col gap-2">
              <div className="h-7 w-40 bg-white/15 rounded-lg" />
              <div className="h-3 w-32 bg-white/10 rounded-md" />
            </div>

            {/* Barra de intensidade placeholder */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between">
                <div className="h-2 w-16 bg-white/5 rounded-full" />
                <div className="h-2 w-12 bg-white/5 rounded-full" />
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full" />
            </div>
          </div>
        </div>

        {/* ── Quadrante emocional Skeleton ── */}
        <div className="rounded-xl px-4 py-3 border border-white/5 bg-white/[0.02] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-2 w-12 bg-white/5 rounded-full" />
            <div className="h-3 w-20 bg-white/10 rounded-md" />
          </div>
        </div>

        {/* ── Valência + Energia Skeleton ── */}
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl p-3.5 border border-white/5 bg-white/[0.02] flex flex-col gap-3">
              <div className="h-2 w-10 bg-white/5 rounded-full" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/10 rounded-full" />
                <div className="h-3 flex-1 bg-white/10 rounded-md" />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full" />
            </div>
          ))}
        </div>

        {/* ── Estatísticas do dia Skeleton (Modo Full) ── */}
        <div className="rounded-xl p-4 border border-white/5 bg-white/[0.02] space-y-4">
          <div className="flex justify-between">
            <div className="h-2 w-16 bg-white/5 rounded-full" />
            <div className="h-2 w-10 bg-white/5 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-white/10 rounded-md" />
            <div className="flex-1 h-2 bg-white/5 rounded-full" />
            <div className="h-6 w-6 bg-white/10 rounded-md" />
          </div>
        </div>

        {/* ── Emoções predominantes Skeleton ── */}
        <div className="rounded-xl p-4 border border-white/5 bg-white/[0.02] space-y-3">
          <div className="h-2 w-24 bg-white/5 rounded-full mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-5 h-5 bg-white/10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="h-2 w-16 bg-white/10 rounded-full" />
                  <div className="h-2 w-6 bg-white/5 rounded-full" />
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (type === 'listCompact') {
    const compact = true
    const rows = Array.from({ length: compact ? 5 : 8 });

    // Default: List style
    return (
      <div className={`glass-card animate-pulse ${compact ? "p-3" : "p-4"}`}>

        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-1 mb-3 pb-2 border-b border-white/10">
          <div className={`h-4 bg-white/10 rounded-md ${compact ? "w-24" : "w-32"}`} />
          {compact && <div className="h-2 w-12 bg-white/5 rounded-full" />}
        </div>

        {/* 📱 Mobile Skeleton (Hidden on md+) */}
        <div className="md:hidden space-y-2">
          {rows.slice(0, 4).map((_, i) => (
            <div key={i} className="p-2.5 rounded-xl border border-white/5 bg-white/[0.03] flex gap-2.5 items-center">
              <div className={`shrink-0 bg-white/10 rounded-lg ${compact ? "w-8 h-8" : "w-10 h-10"}`} />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-24 bg-white/10 rounded-full" />
                <div className="h-2 w-16 bg-white/5 rounded-full" />
              </div>
              <div className="h-5 w-14 bg-white/10 rounded-full" />
            </div>
          ))}
        </div>

        {/* 🖥 Desktop Skeleton (Hidden on sm) */}
        <div className="hidden md:block">
          <table className="w-full border-separate border-spacing-0">
            {!compact && (
              <thead>
                <tr>
                  <th className="pb-3 pt-2 px-4"><div className="h-2 w-4 bg-white/5 rounded" /></th>
                  <th className="pb-3 pt-2 px-2"><div className="h-2 w-16 bg-white/5 rounded" /></th>
                  <th className="pb-3 pt-2 px-2"><div className="h-2 w-16 bg-white/5 rounded" /></th>
                  <th className="pb-3 pt-2 px-2 text-right"><div className="h-2 w-12 bg-white/5 rounded ml-auto" /></th>
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((_, i) => (
                <tr key={i}>
                  {/* Capa e Index */}
                  <td className={`border-b border-white/5 ${compact ? "py-1.5 px-2" : "py-3 px-4"}`}>
                    <div className="flex items-center gap-3">
                      {!compact && <div className="h-2 w-3 bg-white/5 rounded" />}
                      <div className={`shrink-0 bg-white/10 rounded-md ${compact ? "w-7 h-7" : "w-10 h-10"}`} />
                    </div>
                  </td>

                  {/* Título/Artista */}
                  <td className={`border-b border-white/5 ${compact ? "py-1.5 px-2" : "py-3 px-2"}`}>
                    <div className="space-y-2">
                      <div className={`h-2.5 bg-white/10 rounded-full ${compact ? "w-20" : "w-32"}`} />
                      {compact && <div className="h-2 w-16 bg-white/5 rounded-full" />}
                    </div>
                  </td>

                  {/* Artista (Apenas Desktop Normal) */}
                  {!compact && (
                    <td className="py-3 px-2 border-b border-white/5">
                      <div className="h-2 w-20 bg-white/5 rounded-full" />
                    </td>
                  )}

                  {/* Emoção Tag */}
                  <td className={`border-b border-white/5 text-right ${compact ? "py-1.5 px-2" : "py-3 px-2"}`}>
                    <div className={`inline-block bg-white/10 rounded-full ml-auto ${compact ? "h-4 w-10" : "h-6 w-20"}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}