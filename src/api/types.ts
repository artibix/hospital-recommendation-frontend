export interface Hospital {
    id: string;
    name: string;
    level: string;
    address: string;
    latitude: number;
    longitude: number;
    rating?: number;
    distance?: number;
    tags?: string[];
    description: string;
    workingHours: string
}

export interface HospitalCategory {
    id: string;
    name: string;
    hospitals: Hospital[];
}

export interface SearchParams {
    keyword?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    page?: number;
    size?: number;
}
