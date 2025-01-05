// src/types/models.ts
export interface User {
    id: string
    openid: string
    phone?: string
    nickname?: string
    avatarUrl?: string
    gender?: number
    createdAt: string
    updatedAt: string
    lastLoginAt?: string
    status: number
}

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

export interface Department {
    id: string
    hospitalId: string
    name: string
    description?: string
}

export interface Rating {
    id: string
    hospitalId: string
    userId: string
    medicalQuality: number
    service: number
    environment: number
    comment?: string
    createdAt: string
}

export interface UserFavorite {
    id: string
    userId: string
    hospitalId: string
    createdAt: string
}

export interface UserBehavior {
    id: string
    userId: string
    hospitalId: string
    departmentId?: string
    behaviorType: string
    startLocation?: string
    startLatitude?: number
    startLongitude?: number
    visitDate?: string
    createdAt: string
}

export interface RecommendationLog {
    id: string
    userId: string
    hospitalId: string
    recommendationType: string
    score: number
    isClicked: boolean
    createdAt: string
}

export interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: number;
    recommendations?: Hospital[];
}
