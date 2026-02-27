"use client"

import LoadingComponent from "@/shared/components/Loading"
import ErrorComponent from "@/shared/components/Error"
import { useMoodProfile } from "../hooks/useMoodProfile"



export default function MoodProfile() {

    const { data, isLoading, isError } = useMoodProfile()



    if (isLoading) return <LoadingComponent type="profile" />
    if (isError || !data) return <ErrorComponent type="profile" />


    return (

        <div className="grid grid-cols-2 gap-4 items-center pt-4 border-t border-white/5">

            {/* Coluna 1: Texto informativo */}
            <div className="flex flex-col gap-1">
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                    Humor de Hoje
                </p>
                <span className="text-sm font-medium text-white/80">
                    {data.sentiment}
                </span>
            </div>

            {/* Coluna 2: GIF / MoodProfile */}
            <div className="flex justify-end">
                <div className="w-25 h-25 rounded-xl overflow-hidden flex items-center justify-center">
                    <div className="flex items-center gap-3 mt-1">
                        {data.url_gif && (
                            <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0">
                                {data.url_gif && (
                                    <img
                                        src={data.url_gif}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>

    )
}