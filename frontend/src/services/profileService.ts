import api from './api';

export interface Profile {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}

export interface Analytics {
    totalMedia: number;
    finishedCount: number;
    unfinishedCount: number;
    averageRating: number;
    mediaTypeBreakdown: Record<string, number>;
}

const API_ORIGIN = 'http://localhost:8081';

const normalize = (p: Profile) => {
    if (p && p.avatarUrl && p.avatarUrl.startsWith('/')) {
        p.avatarUrl = API_ORIGIN + p.avatarUrl;
    }
    return p;
};

const profileService = {
    getProfile: async (): Promise<Profile> => {
        const resp = await api.get<Profile>('/profile');
        return normalize(resp.data);
    },

    updateProfile: async (payload: { username: string; firstName?: string; lastName?: string }) => {
        const resp = await api.put<Profile>('/profile', payload);
        return normalize(resp.data);
    },

    uploadAvatar: async (file: File) => {
        const form = new FormData();
        form.append('file', file);
        const resp = await api.post<Profile>('/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return normalize(resp.data);
    },

    getAnalytics: async (): Promise<Analytics> => {
        const resp = await api.get<Analytics>('/profile/analytics');
        return resp.data;
    }
};

export default profileService;
