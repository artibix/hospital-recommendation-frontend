import {Hospital} from "@/types/models";

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
