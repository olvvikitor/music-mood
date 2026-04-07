import { useQuery } from "@tanstack/react-query";
import { getMoodProfile } from "../services/getMoodProfile";

export function useMoodProfile() {
    return useQuery({
        queryKey: ["moodProfile"],
        queryFn: getMoodProfile,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
}
