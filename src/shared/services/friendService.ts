import api from '@/shared/services/apiService';

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED' | null;

export type UserSearchResult = {
    id: string;
    display_name: string;
    img_profile: string;
    country: string;
    friendshipStatus: FriendshipStatus;
    friendshipId: string | null;
};

export type Friend = {
    friendshipId: string;
    id: string;
    display_name: string;
    img_profile: string;
    country: string;
    since: string;
};

export type PendingRequest = {
    id: string;
    requesterId: string;
    createdAt: string;
    requester: {
        id: string;
        display_name: string;
        img_profile: string;
        country: string;
    };
};

export type MoodData = {
    moodScore: number;
    sentiment: string;
    emotions: Record<string, number>;
    coreAxes: Record<string, number>;
    analyzedAt: string;
    image_mood?: string;
} | null;

// isPlaying: false → nada tocando; isPlaying: true → dados completos
export type ListeningNowData =
    | { isPlaying: false }
    | {
        isPlaying: true;
        moodScore: number;
        dominantSentiment: string;
        tracks: {
            music: string;
            artist: string;
            img_url: string;
            moodScore: number;
            dominantSentiment: string;
            reasoning: string;
            coreAxes: Record<string, number>;
        }[];
    };

export type CompareMoodData = {
    me: MoodData;
    friend: MoodData & { display_name: string; img_profile: string };
};

// ─── Friendship CRUD ─────────────────────────────────────────────────────────

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
    return api.get(`/friendship/search?q=${encodeURIComponent(query)}`).then((r) => r.data);
}

export async function sendFriendRequest(addresseeId: string): Promise<void> {
    return api.post('/friendship/request', { addresseeId }).then((r) => r.data);
}

export async function respondFriendRequest(friendshipId: string, accept: boolean): Promise<void> {
    return api.put('/friendship/respond', { friendshipId, accept }).then((r) => r.data);
}

export async function getFriends(): Promise<Friend[]> {
    return api.get('/friendship').then((r) => r.data);
}

export async function getPendingRequests(): Promise<PendingRequest[]> {
    return api.get('/friendship/requests').then((r) => r.data);
}

export async function removeFriend(friendshipId: string): Promise<void> {
    return api.delete(`/friendship/${friendshipId}`).then((r) => r.data);
}

// ─── Funcionalidades sociais ──────────────────────────────────────────────────

export async function getFriendMood(friendId: string): Promise<MoodData> {
    return api.get(`/friendship/${friendId}/mood`).then((r) => r.data);
}

export async function getFriendListeningNow(friendId: string): Promise<ListeningNowData> {
    return api.get(`/friendship/${friendId}/listening-now`).then((r) => r.data);
}

export async function compareMood(friendId: string): Promise<CompareMoodData> {
    return api.get(`/friendship/${friendId}/compare-mood`).then((r) => r.data);
}
