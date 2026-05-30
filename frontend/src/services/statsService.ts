import api from './api';

export interface RankEntry {
    label: string;
    count: number;
}

export interface TopShelfEntry {
    id: number;
    name: string;
    ownerUsername: string;
    ratingAverage: number;
    ratingCount: number;
}

export interface MonthlyStats {
    topMediaTypes: RankEntry[];
    topGenres: RankEntry[];
    topShelves: TopShelfEntry[];
    personalTopMediaTypes: RankEntry[];
    personalTopGenres: RankEntry[];
}

const statsService = {
    getMonthlyStats: async (): Promise<MonthlyStats> => {
        const response = await api.get<MonthlyStats>('/stats/monthly');
        return response.data;
    },
};

export default statsService;
