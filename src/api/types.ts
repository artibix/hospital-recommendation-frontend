export interface Hospital {
    id: string;
    name: string;
    level: string;
    address: string;
    latitude: number;
    longitude: number;
    rating?: number;
    distance?: number;
}

export interface SearchParams {
    keyword?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    page?: number;
    size?: number;
}