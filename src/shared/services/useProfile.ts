import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/shared/services/userService";

export function useProfile() {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: getProfile,
        staleTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: true,
    });
}
