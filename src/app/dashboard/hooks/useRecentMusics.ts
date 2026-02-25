import { useQuery } from "@tanstack/react-query";
import { getRecentMusics } from "../services/getRecentMusic";

export function useRecentMusics(){
    return useQuery({
        queryKey:["recents-musics"],
        queryFn: getRecentMusics,
        staleTime:1000*60*5,
    })
}