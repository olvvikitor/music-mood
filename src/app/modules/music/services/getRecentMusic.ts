import { Music } from "../types/music";

export async function getRecentMusics(): Promise<Music[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
        { id: "1", name: "Blinding Lights", artist: "The Weeknd", mood: "energetic" },
        { id: "2", name: "Someone Like You", artist: "Adele", mood: "sad" },
        { id: "3", name: "Happy", artist: "Pharrell Williams", mood: "happy" },
        { id: "4", name: "Weightless", artist: "Marconi Union", mood: "calm" },
        { id: "5", name: "Levitating", artist: "Dua Lipa", mood: "energetic" }
    ]
}