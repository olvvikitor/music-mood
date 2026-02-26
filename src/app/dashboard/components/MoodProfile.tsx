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
            <div className="mt-8">
                <div className="text-6xl mb-4">{data.emoticon}</div>
                <p className="text-sm text-blue-100/90">Seu humor predominante hoje:</p>
                <p className="text-lg font-bold">{data.sentiment}</p>
            </div>
        </>
    );
}