import { Music } from "../types/music";

export async function getRecentMusics(): Promise<Music[]> {
    return [
        { id: '1', name: 'Bohemian Rhapsody', artist: 'Queen', mood: 'Nostálgico' },
        { id: '2', name: 'Happy', artist: 'Pharrell Williams', mood: 'Feliz' },
        { id: '3', name: 'Clair de Lune', artist: 'Debussy', mood: 'Calmo' },
        { id: '4', name: 'Bad Guy', artist: 'Billie Eilish', mood: 'Intenso' },
        { id: '5', name: 'Weightless', artist: 'Marconi Union', mood: 'Calmo' },
        { id: '6', name: 'Don\'t Stop Me Now', artist: 'Queen', mood: 'Feliz' },
    ]
}