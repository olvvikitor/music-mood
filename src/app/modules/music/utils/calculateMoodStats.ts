import { Mood, Music } from "../types/music";

export function calculateMoodStats(musics:Music[]){
    const total = musics.length

    const moodCount: Record<Mood, number>={
        happy:0,
        sad:0,
        energetic:0,
        calm:0
    }

    musics.forEach((music) =>{
        moodCount[music.mood]++
    })

    let predominantMood:Mood = 'happy'
    let max = 0

    for (const mood in moodCount){
        if(moodCount[mood as Mood]>max){
            max = moodCount[mood as Mood]
            predominantMood = mood as Mood
        }
    }

    return {
        total, 
        moodCount,
        predominantMood
    }

}