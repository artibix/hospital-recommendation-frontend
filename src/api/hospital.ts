import {Hospital, SearchParams, HospitalCategory} from './types';
import {Department} from "@/types/models";
// import request from '@/utils/request';

// Mock 数据
const mockHospitals: Hospital[] = [
    {
        id: '1',
        name: '北京协和医院',
        level: '三级甲等',
        address: '北京市东城区帅府园一号',
        latitude: 39.9138,
        longitude: 116.4124,
        rating: 4.8,
        distance: 2.1,
        tags: ['综合医院', '三甲医院'],
        description: '北京协和医院是中国最早的西医院之一，是一所集医疗、教学、科研为一体的大型综合性医院。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    },
    {
        id: '2',
        name: '北京大学第一医院',
        level: '三级甲等',
        address: '北京市西城区西什库大街8号',
        latitude: 39.9289,
        longitude: 116.3744,
        rating: 4.7,
        distance: 3.2,
        tags: ['综合医院', '教学医院'],
        description: '北京协和医院是中国最早的西医院之一，是一所集医疗、教学、科研为一体的大型综合性医院。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    },
    {
        id: '3',
        name: '北京同仁医院',
        level: '三级甲等',
        address: '北京市东城区东交民巷1号',
        latitude: 39.9067,
        longitude: 116.4073,
        rating: 4.6,
        distance: 1.8,
        tags: ['眼科专科', '三甲医院'],
        description: '北京协和医院是中国最早的西医院之一，是一所集医疗、教学、科研为一体的大型综合性医院。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    }
];

const mockCategories: HospitalCategory[] = [
    {
        id: '1',
        name: '综合医院',
        hospitals: [
            mockHospitals[0],
            mockHospitals[1]
        ]
    },
    {
        id: '2',
        name: '专科医院',
        hospitals: [
            mockHospitals[2]
        ]
    }
];

const mockDepartments: Department[] = [
    {
        id: '1',
        hospitalId: '1',
        name: '内科',
        description: '诊治内科常见病、多发病'
    },
    {
        id: '2',
        hospitalId: '2',
        name: '外科',
        description: '开展各类手术治疗'
    },
    {
        id: '3',
        hospitalId: '3',
        name: '儿科',
        description: '专注儿童健康'
    },
    // Add more mock departments as needed
];

const mockFavorites: Hospital[] = [mockHospitals[0], mockHospitals[2]];

// API实现（实际API - 暂时注释）
/*
export const searchHospitals = async (params: SearchParams): Promise<Hospital[]> => {
  const response = await request.get('/api/v1/hospitals', { params });
  return response.data;
};

export const getHospitalCategories = async (): Promise<HospitalCategory[]> => {
  const response = await request.get('/api/v1/hospital-categories');
  return response.data;
};

export const getNearbyHospitals = async (params: SearchParams): Promise<Hospital[]> => {
  const response = await request.get('/api/v1/hospitals/nearby', { params });
  return response.data;
};

export const getFavoriteHospitals = async (): Promise<Hospital[]> => {
  const response = await request.get('/api/v1/favorites');
  return response.data;
};
export const getHospitalDetail = async (id: string): Promise<Hospital> => {
  const response = await request.get(`/api/v1/hospitals/${id}`);
  return response.data;
};
*/

// Mock API实现（当前使用）
export const getHospitalDetail = async (id: string): Promise<Hospital> => {
    return mockHospitals.find(hospital => hospital.id === id) || mockHospitals[0];
};
export const searchHospitals = async (params: SearchParams): Promise<Hospital[]> => {
    if (!params.keyword) {
        return mockHospitals;
    }
    return mockHospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(params.keyword?.toLowerCase() || '') ||
        hospital.tags?.some(tag => tag.toLowerCase().includes(params.keyword?.toLowerCase() || ''))
    );
};

export const getHospitalCategories = async (): Promise<HospitalCategory[]> => {
    return mockCategories;
};

export const getNearbyHospitals = async (params: SearchParams): Promise<Hospital[]> => {
    // 模拟按距离排序
    console.log('Searching nearby hospitals...');
    console.log(`Latitude: ${params.lat}, Longitude: ${params.lng}`);
    return [...mockHospitals].sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

export const getFavoriteHospitals = async (): Promise<Hospital[]> => {
    return mockFavorites;
};

export const getHospitalDepartments = async (id: string): Promise<Department[]> => {
    console.log(`Fetching departments for hospital ${id}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return the mock departments data
    return mockDepartments;
};