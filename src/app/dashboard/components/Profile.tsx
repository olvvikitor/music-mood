// components/Profile.tsx
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useProfile } from "../hooks/useProfile";
import { UserCircle } from 'lucide-react'; // Ícone de fallback
import MoodProfile from "./MoodProfile";
import { useMoodProfile } from "../hooks/useMoodProfile";

export default function Profile() {
  const { data, isLoading, isError } = useProfile();
  const {mood, isLoading, isError} = useMoodProfile();

  if (isLoading) return <LoadingComponent type="profile" />;

  if (isError || !data) return <ErrorComponent type="profile" />;

  return (
    <>
      <div className="md:col-span-4 glass-card p-6 flex flex-col gap-6 h-full">

        {/* 1. SEÇÃO PERFIL (Horizontal - 1 Coluna cheia) */}
        <div className="flex justify-between pr-5">
          <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-blue-300/10 shrink-0">
            {data.img_profile ? (
              <img src={data.img_profile} alt={data.display_name} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-full h-full text-white/20" />
            )}
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-1 leading-tight">{data.display_name}</h2>
            <span className="w-fit px-3 py-1.5 text-[10px] font-bold text-blue-400 rounded-full border border-blue-200/20 uppercase tracking-tight">
              Pro Plan
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 items-center pt-4 border-t border-white/5">

          {/* Coluna 1: Texto informativo */}
          <div className="flex flex-col gap-1 items-center">
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
              Humor de Hoje
            </p>
            <span className="text-sm font-medium text-white/80">
              {data.sentiment}
            </span>
          </div>

          {/* Coluna 2: GIF / MoodProfile */}
          <div className="flex justify-center">
            <div className="mx-auto rounded-xl overflow-hidden flex items-center justify-center">
              <div className="flex items-center gap-3 mt-1">
                {data.url_gif && (
                  <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-xl overflow-hidden relative shrink-0">                                {data.url_gif && (
                    <img
                      src={data.url_gif}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>


      </div>
    </>
  );
}