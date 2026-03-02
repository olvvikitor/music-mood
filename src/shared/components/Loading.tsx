
interface LoadingProps {
    type?: 'profile' | 'list' | "header";
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

    return (
<div className="glass-card p-4 animate-pulse">
      {/* Título do Card */}
      <div className="h-6 w-40 bg-white/10 rounded mb-4 border-b border-white/10 pb-6" />

      {/* 📱 Mobile Skeleton (Cards) */}
      <div className="space-y-2 md:hidden">
        {[1,2,3,4,5].map((_, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border border-white/5 flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-3 w-24 bg-white/5 rounded" />
            </div>
            <div className="h-6 w-20 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>

      {/* 💻 Desktop Skeleton (Table) */}
      <div className="hidden md:block">
        <div className="w-full border-separate border-spacing-0">
          {/* Header da Tabela */}
          <div className="flex border-b border-white/10 pb-3 mb-2 px-2">
            <div className="h-3 w-1/3 bg-white/5 rounded" />
            <div className="h-3 w-1/3 bg-white/5 rounded" />
            <div className="h-3 w-1/3 bg-white/5 rounded ml-auto" />
          </div>
          
          {/* Linhas da Tabela */}
          <div className="space-y-4">
            {[1,2,3,4,5].map((_, i) => (
              <div key={i} className="flex items-center px-2 py-2">
                <div className="h-4 w-1/3 bg-white/10 rounded" />
                <div className="h-4 w-1/4 bg-white/5 rounded" />
                <div className="h-6 w-24 bg-white/10 rounded-full ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
}