import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/getProfileService";
import { getMoodProfile } from "../services/getMoodProfile";

export function useMoodProfile(){
    return useQuery({
        queryKey:["moodProfile"],
        queryFn: getMoodProfile,
        staleTime:Infinity,
    })
}