// components/Profile.tsx
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useMoodProfile } from "../hooks/useMoodProfile";

export default function MoodProfile() {
    const { data, isLoading, isError } = useMoodProfile();

    if (isLoading) return <LoadingComponent type="profile" />;

    if (isError || !data) return <ErrorComponent type="profile" />;

    return (
        <>
            <div className="flex items-center gap-3 mt-1">
                {/* Seu GIF aqui com tamanho controlado */}
                <img src="seu-gif.gif" className="w-12 h-12 rounded-lg object-cover" />

                {/* O texto "Resiliente" */}
                <span className="text-lg font-medium text-white/90">Resiliente</span>
            </div>
        </>
    );
}