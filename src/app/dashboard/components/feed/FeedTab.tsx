"use client";

import { useEffect, useState } from "react";
import {
    getFriends, getFriendMood, getFriendListeningNow,
    type Friend,
} from "@/shared/services/friendService";
import { FeedPost, FeedPostSkeleton, type FeedPostData } from "./FeedPost";
import { Users } from "lucide-react";
import Link from "next/link";

export function FeedTab() {
    const [posts, setPosts]   = useState<FeedPostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const friends: Friend[] = await getFriends();
                if (!friends.length) { setLoading(false); return; }

                // Carrega dados de todos os amigos em paralelo
                const enriched = await Promise.all(
                    friends.map(async (f): Promise<FeedPostData> => {
                        const [moodData, listeningData] = await Promise.allSettled([
                            getFriendMood(f.id),
                            getFriendListeningNow(f.id),
                        ]);

                        const mood = moodData.status === "fulfilled" ? moodData.value : null;
                        const listening = listeningData.status === "fulfilled" ? listeningData.value : null;
                        const isPlaying = !!(listening && listening.isPlaying);
                        const track = isPlaying && listening && "tracks" in listening
                            ? listening.tracks[0]
                            : undefined;

                        return { ...f, isPlaying, track, mood };
                    })
                );

                // Amigos ouvindo agora primeiro, depois por mood score desc
                const sorted = enriched.sort((a, b) => {
                    if (a.isPlaying && !b.isPlaying) return -1;
                    if (!a.isPlaying && b.isPlaying) return 1;
                    return (b.mood?.moodScore ?? 0) - (a.mood?.moodScore ?? 0);
                });

                setPosts(sorted);
            } catch { /* silencia */ }
            finally { setLoading(false); }
        }

        load();
    }, []);

    if (loading) return (
        <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <FeedPostSkeleton key={i} />)}
        </div>
    );

    if (!posts.length) return (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}>
                <Users className="w-7 h-7 text-white/20" />
            </div>
            <div>
                <p className="text-sm font-semibold text-white/50" style={{ fontFamily: "var(--font-display)" }}>
                    Nenhum amigo ainda
                </p>
                <p className="text-xs text-white/25 mt-1">Adicione amigos para ver o feed deles aqui.</p>
            </div>
            <Link
                href="/friends"
                className="text-xs font-semibold transition-colors"
                style={{ color: "#6fae9b" }}
            >
                Buscar amigos â†’
            </Link>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            {posts.map(p => (
                <FeedPost key={p.id} post={p} />
            ))}
        </div>
    );
}

