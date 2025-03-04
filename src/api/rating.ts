// src/api/rating.ts
import { http } from '@/utils/request';
import { config } from './config';
import type { Rating } from '@/types/models';

// 评分维度接口
export interface RatingDimension {
    id: string;
    name: string;
    description: string;
}

// 评分统计接口
export interface RatingStatistics {
    medical_quality: number;
    service: number;
    environment: number;
    efficiency: number;
    equipment: number;
    overall: number;
    count: number;
}

// 医院评分响应接口
export interface HospitalRatingResponse {
    statistics: RatingStatistics;
    recent_ratings: Rating[];
}

// 提交评分请求参数
export interface RatingSubmitParams {
    medical_quality: number;
    service: number;
    environment: number;
    efficiency: number;
    equipment: number;
    comment?: string;
}

// 模拟评分维度数据
const mockDimensions: RatingDimension[] = [
    {
        id: "medical_quality",
        name: "医疗质量",
        description: "医护人员的专业水平和治疗效果"
    },
    {
        id: "service",
        name: "服务态度",
        description: "医护人员的服务态度和沟通质量"
    },
    {
        id: "environment",
        name: "环境设施",
        description: "医院环境、设施和卫生状况"
    },
    {
        id: "efficiency",
        name: "就诊效率",
        description: "挂号、等待和就诊的时间效率"
    },
    {
        id: "equipment",
        name: "设备先进度",
        description: "医疗设备的先进程度和完善程度"
    }
];

// 模拟评分数据
const mockRatings: Rating[] = [
    {
        id: '1',
        hospitalId: '1',
        userId: '1',
        medical_quality: 4.5,
        service: 4.0,
        environment: 4.2,
        efficiency: 3.8,
        equipment: 4.3,
        comment: '医生很专业，服务态度也很好，但是等待时间有点长。',
        createdAt: '2023-10-01T10:00:00Z'
    },
    {
        id: '2',
        hospitalId: '1',
        userId: '2',
        medical_quality: 4.8,
        service: 4.3,
        environment: 4.5,
        efficiency: 4.0,
        equipment: 4.7,
        comment: '设备先进，医生认真负责，整体体验很好。',
        createdAt: '2023-09-20T14:30:00Z'
    }
];

// 模拟统计数据
const mockStatistics: RatingStatistics = {
    medical_quality: 4.65,
    service: 4.15,
    environment: 4.35,
    efficiency: 3.9,
    equipment: 4.5,
    overall: 4.31,
    count: 2
};

// 获取评分维度
export const getRatingDimensions = async (): Promise<RatingDimension[]> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockDimensions;
    }

    const response = await http.get<RatingDimension[]>('/api/v1/rating-dimensions');
    return response.data;
};

// 获取医院评分列表
export const getHospitalRatings = async (hospitalId: string): Promise<HospitalRatingResponse> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            statistics: mockStatistics,
            recent_ratings: mockRatings.filter(rating => rating.hospitalId === hospitalId)
        };
    }

    const response = await http.get<HospitalRatingResponse>(`/api/v1/hospitals/${hospitalId}/ratings`);
    return response.data;
};

// 提交医院评分
export const submitHospitalRating = async (hospitalId: string, data: RatingSubmitParams): Promise<Rating> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newRating: Rating = {
            id: Date.now().toString(),
            hospitalId,
            userId: '1', // 模拟当前用户ID
            medical_quality: data.medical_quality,
            service: data.service,
            environment: data.environment,
            efficiency: data.efficiency,
            equipment: data.equipment,
            comment: data.comment || '',
            createdAt: new Date().toISOString()
        };

        // 将新评分添加到模拟数据中
        mockRatings.unshift(newRating);

        // 更新统计数据
        const ratings = mockRatings.filter(r => r.hospitalId === hospitalId);
        if (ratings.length > 0) {
            mockStatistics.medical_quality = ratings.reduce((sum, r) => sum + r.medical_quality, 0) / ratings.length;
            mockStatistics.service = ratings.reduce((sum, r) => sum + r.service, 0) / ratings.length;
            mockStatistics.environment = ratings.reduce((sum, r) => sum + r.environment, 0) / ratings.length;
            mockStatistics.efficiency = ratings.reduce((sum, r) => sum + r.efficiency, 0) / ratings.length;
            mockStatistics.equipment = ratings.reduce((sum, r) => sum + r.equipment, 0) / ratings.length;
            mockStatistics.overall = (mockStatistics.medical_quality + mockStatistics.service +
                mockStatistics.environment + mockStatistics.efficiency + mockStatistics.equipment) / 5;
            mockStatistics.count = ratings.length;
        }

        return newRating;
    }

    const response = await http.post<Rating>(`/api/v1/hospitals/${hospitalId}/ratings`, data);
    return response.data;
};

// 获取用户评分历史
export const getUserRatings = async (): Promise<Rating[]> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return mockRatings.filter(rating => rating.userId === '1'); // 模拟当前用户ID
    }

    const response = await http.get<Rating[]>('/api/v1/ratings');
    return response.data;
};