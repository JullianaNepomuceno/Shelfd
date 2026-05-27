import api from './api';

export type MediaType = 'MOVIE' | 'BOOK' | 'COMIC' | 'TV_SHOW' | 'GAME';
export type MediaStatus = 'FINISHED' | 'UNFINISHED' | 'IN_PROGRESS';

export interface MediaItemRequest {
    title: string;
    creator: string;
    mediaLink?: string;
    coverUrl?: string;
    comment?: string;
    type: MediaType;
    status: MediaStatus;
    rating?: number;
}

export interface MediaItemResponse {
    id: number;
    title: string;
    creator: string;
    mediaLink?: string;
    coverUrl?: string;
    comment?: string;
    type: MediaType;
    status: MediaStatus;
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
        const response = await api.get<MediaItemResponse[]>(`/shelves/${shelfId}/media`);
        return response.data;
    },

    addMediaItem: async (shelfId: number, payload: MediaItemRequest): Promise<MediaItemResponse> => {
        const response = await api.post<MediaItemResponse>(`/shelves/${shelfId}/media`, payload);
        return response.data;
    },

    updateMediaItem: async (shelfId: number, itemId: number, payload: MediaItemRequest): Promise<MediaItemResponse> => {
        const response = await api.put<MediaItemResponse>(`/shelves/${shelfId}/media/${itemId}`, payload);
        return response.data;
    },

    deleteMediaItem: async (shelfId: number, itemId: number): Promise<void> => {
        await api.delete(`/shelves/${shelfId}/media/${itemId}`);
    },

    rateMediaItem: async (shelfId: number, itemId: number, rating: number): Promise<MediaItemResponse> => {
        const response = await api.post<MediaItemResponse>(`/shelves/${shelfId}/media/${itemId}/ratings`, { rating });
        return response.data;
    },
};

export default mediaService;
