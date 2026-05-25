import api from './api';

export interface ShelfRequest {
    name: string;
    description: string;
    isPublic: boolean;
}

export interface ShelfResponse {
    id: number;
    name: string;
    description: string;
    isPublic: boolean;
    ownerUsername: string;
    createdAt: string;
}

const shelfService = {
    getMyShelves: async (): Promise<ShelfResponse[]> => {
        const response = await api.get<ShelfResponse[]>('/shelves');
        return response.data;
    },

    createShelf: async (payload: ShelfRequest): Promise<ShelfResponse> => {
        const response = await api.post<ShelfResponse>('/shelves', payload);
        return response.data;
    },

    updateShelf: async (id: number, payload: ShelfRequest): Promise<ShelfResponse> => {
        const response = await api.put<ShelfResponse>(`/shelves/${id}`, payload);
        return response.data;
    },

    deleteShelf: async (id: number): Promise<void> => {
        await api.delete(`/shelves/${id}`);
    },
};

export default shelfService;
