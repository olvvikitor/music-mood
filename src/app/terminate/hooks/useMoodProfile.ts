import { useQuery } from "@tanstack/react-query";
import { getInfoUserPlataform} from "../services/getProfileService";

export function usePlataformProfile(){
    return useQuery({
        queryKey:["userPlataformProfile"],
        queryFn: getInfoUserPlataform,
        staleTime:Infinity
    })
}