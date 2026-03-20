import { useQuery } from "@tanstack/react-query";
import { getListeningNow } from "../services/getListeningNow";

export function useListeningNow() {
    return useQuery({
        queryKey: ["listeningNow"],
        queryFn: getListeningNow,
        staleTime: Infinity,
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
    });
}
