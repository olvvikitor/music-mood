import { useMoodProfile } from "../hooks/useMoodProfile";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { MoodCard } from "@/shared/components/MoodCard";

export function EmotionalCardChart() {
    const { data, isLoading, isError, isFetching } = useMoodProfile();

    if (isLoading || isFetching) return <LoadingComponent type="emotionalChart" />;
    if (isError || !data?.tracksAnalyzeds) return <ErrorComponent type="emotionalChart" />;

    return (
        <div
            className="w-full h-auto md:h-full overflow-y-visible md:overflow-y-auto custom-scrollbar pr-0 md:pr-1"
            style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorY: "contain",
            }}
        >
            <MoodCard
                data={{
                    dominantSentiment: data.sentiment,
                    emotionalVector: data.emotions,
                    coreAxes: data.coreAxes,
                    moodScore: data.moodScore,
                }}
                mode="hero"
            />
        </div>
    );
}
