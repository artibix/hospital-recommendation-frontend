import {SearchParams, HospitalCategory } from '@/types/api';
import {Department, Hospital} from "@/types/models";
import { http } from '@/utils/request';
import { config } from './config';
import {
    mockHospitals,
    mockCategories,
    mockDepartments,
    mockFavorites
} from './mockData';

export const getHospitalDetail = async (id: string): Promise<Hospital> => {
    if (config.useMock) {
        return mockHospitals.find(hospital => hospital.id === id) || mockHospitals[0];
    }
    const response = await http.get<Hospital>(`/api/v1/hospitals/${id}`);
    return response.data;
};

export const searchHospitals = async (params: SearchParams): Promise<Hospital[]> => {
    if (config.useMock) {
        if (!params.keyword) {
            return mockHospitals;
        }
        return mockHospitals.filter(hospital =>
            hospital.name.toLowerCase().includes(params.keyword?.toLowerCase() || '') ||
            hospital.tags?.some(tag => tag.toLowerCase().includes(params.keyword?.toLowerCase() || ''))
        );
    }
    const response = await http.get<Hospital[]>('/api/v1/hospitals', params);
    return response.data;
};

export const getHospitalCategories = async (): Promise<HospitalCategory[]> => {
    if (config.useMock) {
        return mockCategories;
    }
    const response = await http.get<HospitalCategory[]>('/api/v1/hospital-categories');
    return response.data;
};

export const getNearbyHospitals = async (params: SearchParams): Promise<Hospital[]> => {
    if (config.useMock) {
        console.log('Searching nearby hospitals...');
        console.log(`Latitude: ${params.lat}, Longitude: ${params.lng}`);
        return [...mockHospitals].sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    const response = await http.get<Hospital[]>('/api/v1/hospitals/nearby', params);
    return response.data;
};

export const getFavoriteHospitals = async (): Promise<Hospital[]> => {
    if (config.useMock) {
        return mockFavorites;
    }
    const response = await http.get<Hospital[]>('/api/v1/favorites');
    return response.data;
};

export const getHospitalDepartments = async (id: string): Promise<Department[]> => {
    if (config.useMock) {
        console.log(`Fetching departments for hospital ${id}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockDepartments;
    }
    const response = await http.get<Department[]>(`/api/v1/hospitals/${id}/departments`);
    return response.data;
};