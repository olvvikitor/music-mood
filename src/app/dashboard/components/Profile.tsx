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
      {/* CÍRCULO DA FOTO */}
      <div className="w-32 h-32 rounded-full mb-4 border-4 border-white/20 overflow-hidden bg-blue-300/30 flex items-center justify-center">
        {data.img_profile ? (
          <img
            src={data.img_profile}
            alt={data.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserCircle className="w-20 h-20 text-white/50" />
        )}
      </div>

      <h2 className="text-xl font-bold">{data.display_name}</h2>
      <p className="text-blue-200/80 text-sm">{data.email}</p>

      <span className="px-4 py-1 mt-2 text-xs font-semibold bg-blue-500/30 rounded-full border border-blue-400/30">
        Pro Plan
      </span>
      <MoodProfile></MoodProfile>


    </>
  );
}