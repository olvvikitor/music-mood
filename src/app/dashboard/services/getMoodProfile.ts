import api from "@/shared/services/apiService"

export type MoodProfileResponse={
    moodScore:string
    sentiment: string
    emoticon:string
    emotions: string[]
}



export async function getMoodProfile():Promise<MoodProfileResponse>{
    
    return await api.get('user/mood').then((response)=>response.data)
}