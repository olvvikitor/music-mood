import { useMoodProfile } from "../hooks/useMoodProfile";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { MoodCard } from "@/shared/components/MoodCard";

export function EmotionalCardChart() {
    const { data, isLoading, isError, isFetching } = useMoodProfile();
    if (isLoading || isFetching) return <LoadingComponent type="list" />;
    if (isError || !data?.tracksAnalyzeds) return <ErrorComponent type="list" />;
    return (
        <div className="w-full h-full shrink-0 px-2 overflow-y-auto">
            <MoodCard data={data}/>
        </div>
    )
}