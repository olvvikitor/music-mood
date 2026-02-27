// components/Profile.tsx
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useProfile } from "../hooks/useProfile";
import { UserCircle } from 'lucide-react'; // Ícone de fallback
import MoodProfile from "./MoodProfile";

export default function Profile() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading) return <LoadingComponent type="profile" />;

  if (isError || !data) return <ErrorComponent type="profile" />;

  return (
    <>
      <div className="md:col-span-4 glass-card p-6 flex flex-col gap-6 h-fit">

        {/* 1. SEÇÃO PERFIL (Horizontal - 1 Coluna cheia) */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-blue-300/10 flex-shrink-0">
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

        {/* 2. SEÇÃO HUMOR (Horizontal - Dividida em 2 colunas) */}
        <MoodProfile></MoodProfile>

      </div>
    </>
  );
}