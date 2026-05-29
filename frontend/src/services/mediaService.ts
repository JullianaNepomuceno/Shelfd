import api from './api';

export type MediaType = 'MOVIE' | 'BOOK' | 'COMIC' | 'TV_SHOW' | 'GAME';
export type SeriesStatus = 'FINISHED' | 'UNFINISHED' | 'IN_PROGRESS';
export type UserStatus = 'FINISHED' | 'UNFINISHED' | 'IN_PROGRESS';

export interface MediaItemRequest {
    title: string;
    creator: string;
    mediaLink?: string;
    coverUrl?: string;
    comment?: string;
    type: MediaType;
    seriesStatus: SeriesStatus;
    userStatus: UserStatus;
    genres?: string[];
    rating?: number;
}

export interface MediaItemResponse {
    id: number;
    title: string;
    creator: string;
    mediaLink?: string;
    coverUrl?: string;
    coverImageUrl?: string;
    hasCoverImage?: boolean;
    comment?: string;
    type: MediaType;
    seriesStatus: SeriesStatus;
    userStatus: UserStatus;
    genres?: string[];
    rating?: number;
    ratingAverage?: number;
    ratingCount?: number;
    shelfId: number;
    createdAt: string;
}

export interface RatingRequest {
    rating: number;
}

const mediaService = {
    getMediaItems: async (shelfId: number): Promise<MediaItemResponse[]> => {
        const token = localStorage.getItem('token');
        const response = await api.get<MediaItemResponse[]>(`/shelves/${shelfId}/media`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    addMediaItem: async (shelfId: number, payload: MediaItemRequest): Promise<MediaItemResponse> => {
        const token = localStorage.getItem('token');
        const response = await api.post<MediaItemResponse>(`/shelves/${shelfId}/media`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    updateMediaItem: async (shelfId: number, itemId: number, payload: MediaItemRequest): Promise<MediaItemResponse> => {
        const token = localStorage.getItem('token');
        const response = await api.put<MediaItemResponse>(`/shelves/${shelfId}/media/${itemId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    deleteMediaItem: async (shelfId: number, itemId: number): Promise<void> => {
        const token = localStorage.getItem('token');
        await api.delete(`/shelves/${shelfId}/media/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    rateMediaItem: async (shelfId: number, itemId: number, rating: number): Promise<MediaItemResponse> => {
        const token = localStorage.getItem('token');
        const response = await api.post<MediaItemResponse>(
            `/shelves/${shelfId}/media/${itemId}/ratings`,
            { rating },
            { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
    },

    uploadCoverImage: async (shelfId: number, itemId: number, file: File): Promise<MediaItemResponse> => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<MediaItemResponse>(
            `/shelves/${shelfId}/media/${itemId}/cover`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    },
};

export default mediaService;
