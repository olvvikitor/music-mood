import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/apiService";
import { getMoodDisplayName } from "@/shared/lib/moodHelpers";

export function useTodayTracks() {
    return useQuery({
        queryKey: ["todayTracks"],
        queryFn: async () => {
            const data: any[] = await api
                .get("user/today-tracks")
                .then((r) => r.data);

            return data.map((track) => ({
                ...track,
                dominantSentiment: getMoodDisplayName(track.dominantSentiment, track.dominantSentiment),
            }));
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
}
