"use client";

import { useState } from "react";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useMoodProfile } from "../hooks/useMoodProfile";
import Image from "next/image";
import { Track } from "../types/music";
import { MoodBadge } from "@/shared/components/MoodBadge";
import { TrackDrawer } from "./TrackDrawer";

export default function RecentSongs({ compact = false }: { compact?: boolean }) {
    const { data, isLoading, isError, isFetching } = useMoodProfile();
    const [drawerTrack, setDrawerTrack] = useState<Track | null>(null);

    if (isLoading || (isFetching && compact)) return <LoadingComponent type="listCompact" />;
    if (isError || !data?.tracksAnalyzeds) return <ErrorComponent type="list" />;

    const tracks = compact ? data.tracksAnalyzeds.slice(0, 15) : data.tracksAnalyzeds;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div
                className="flex flex-col gap-0.5 overflow-y-visible md:overflow-y-auto custom-scrollbar h-auto md:h-full pr-1"
                style={{ maxHeight: compact ? "none" : "520px" }}
            >
                {tracks.map((song, index) => (
                    <button
                        key={`${song.id}-${index}`}
                        onClick={() => setDrawerTrack(song)}
                        className="group flex items-center gap-3 px-2 py-2 rounded-xl w-full text-left transition-all duration-200 active:scale-[0.98]"
                        style={{
                            opacity: 0,
                            animation: `fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 35}ms both`,
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        }}
                    >
                        {/* Index */}
                        {!compact && (
                            <span className="w-5 text-right shrink-0 text-[10px] font-700 text-white/15 group-hover:text-white/30 transition-colors tabular-nums"
                                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                {(index + 1).toString().padStart(2, "0")}
                            </span>
                        )}

                        {/* Cover */}
                        <div className={`relative shrink-0 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 ${compact ? "w-9 h-9" : "w-10 h-10"}`}
                            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                            <Image
                                src={song.img_url ?? ""}
                                alt={song.music}
                                fill
                                className="object-cover"
                                sizes="40px"
                                unoptimized
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <span
                                className={`font-600 text-white/85 truncate group-hover:text-white transition-colors leading-tight ${compact ? "text-[13px]" : "text-sm"}`}
                                style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
                            >
                                {song.music}
                            </span>
                            <span className="text-[10px] text-white/30 truncate uppercase tracking-wider"
                                style={{ fontFamily: "var(--font-body)" }}>
                                {song.artist.split(",")[0]}
                            </span>
                        </div>

                        {/* Badge */}
                        <div className="shrink-0">
                            <MoodBadge mood={song.dominantSentiment} size="sm" label={song.dominantSentiment} />
                        </div>
                    </button>
                ))}
            </div>

            {drawerTrack && (
                <TrackDrawer track={drawerTrack} onClose={() => setDrawerTrack(null)} />
            )}
        </div>
    );
}
