// src/types/api.ts
import {Hospital} from "@/types/models";

export interface ResponseData<T> {
    code: number
    message: string
    data: T
}

export interface HospitalListResponse {
    list: Hospital[]
    total: number
    hasMore: boolean
}