import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/getProfileService";

export function useProfile(){
    return useQuery({
        queryKey:["userProfile"],
        queryFn: getProfile,
        staleTime:Infinity,
    })
}