import { Hospital, SearchParams } from './types';

// 实际API调用
/*
export const searchHospitals = async (params: SearchParams): Promise<Hospital[]> => {
  const response = await request.get('/api/v1/hospitals', { params });
  return response.data;
};

export const getNearbyHospitals = async (params: SearchParams): Promise<Hospital[]> => {
  const response = await request.get('/api/v1/hospitals', {
    params: { ...params, sort: 'distance' }
  });
  return response.data;
};

export const getFavoriteHospitals = async (): Promise<Hospital[]> => {
  const response = await request.get('/api/v1/favorites');
  return response.data;
};
*/

// Mock数据实现
const mockHospitals = [
    {
        id: '1',
        name: '第一人民医院',
        level: '三级甲等',
        address: '北京市朝阳区',
        latitude: 39.9042,
        longitude: 116.4074,
        rating: 4.5,
        distance: 1.2
    },
    {
        id: '2',
        name: '协和医院',
        level: '三级甲等',
        address: '北京市东城区',
        latitude: 39.9138,
        longitude: 116.4124,
        rating: 4.8,
        distance: 2.1
    },
    {
        id: '3',
        name: '同仁医院',
        level: '三级甲等',
        address: '北京市东城区',
        latitude: 39.9259,
        longitude: 116.4173,
        rating: 4.6,
        distance: 2.8
    }
];

export const searchHospitals = async (params: SearchParams): Promise<Hospital[]> => {
    return mockHospitals.filter(hospital => {
        if (!params.keyword) return true;
        return hospital.name.includes(params.keyword);
    });
};

export const getNearbyHospitals = async (params: SearchParams): Promise<Hospital[]> => {
    console.log('Searching nearby hospitals...', params);
    return [...mockHospitals].sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

export const getFavoriteHospitals = async (): Promise<Hospital[]> => {
    return mockHospitals.slice(0, 2); // 返回前两个作为收藏的医院
};