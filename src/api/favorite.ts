// src/api/favorite.ts
import { http } from '@/utils/request';
import { config } from './config';
import type { Hospital } from '@/types/models';
import { mockHospitals } from './mockData';

// 模拟当前用户的收藏医院ID
let mockFavoriteIds: string[] = ['1', '3', '5'];

// 获取用户收藏的医院列表
export const getFavoriteHospitals = async (): Promise<Hospital[]> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockHospitals.filter(hospital => mockFavoriteIds.includes(hospital.id));
    }

    const response = await http.get<Hospital[]>('/api/v1/favorites');
    return response.data;
};

// 添加医院收藏
export const addFavorite = async (hospitalId: string): Promise<{ success: boolean }> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!mockFavoriteIds.includes(hospitalId)) {
            mockFavoriteIds.push(hospitalId);
        }

        return { success: true };
    }

    const response = await http.post<{ success: boolean }>(`/api/v1/favorites/${hospitalId}`);
    return response.data;
};

// 删除医院收藏
export const removeFavorite = async (hospitalId: string): Promise<{ success: boolean }> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));

        mockFavoriteIds = mockFavoriteIds.filter(id => id !== hospitalId);

        return { success: true };
    }

    const response = await http.delete<{ success: boolean }>(`/api/v1/favorites/${hospitalId}`);
    return response.data;
};

// 检查医院是否已收藏
export const checkIsFavorite = async (hospitalId: string): Promise<boolean> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockFavoriteIds.includes(hospitalId);
    }

    try {
        const favorites = await getFavoriteHospitals();
        return favorites.some(hospital => hospital.id === hospitalId);
    } catch (error) {
        console.error('检查收藏状态失败:', error);
        return false;
    }
};

// 切换收藏状态
export const toggleFavorite = async (hospitalId: string): Promise<boolean> => {
    const isFavorite = await checkIsFavorite(hospitalId);

    if (isFavorite) {
        await removeFavorite(hospitalId);
        return false;
    } else {
        await addFavorite(hospitalId);
        return true;
    }
};