// src/types/store.ts

// 导入基础模型定义
import { User, Hospital, Department } from './models'

// 根状态接口
export interface RootState {
    auth: AuthState
    hospital: HospitalState
    app: AppState
}

// 认证模块状态
export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

// 医院模块状态
export interface HospitalState {
    hospitals: Hospital[]
    currentHospital: Hospital | null
    currentDepartments: Department[]
    favoriteHospitals: Hospital[]
    currentHospitalRatings: Rating[]
    loading: boolean
    page: number
    hasMore: boolean
    searchQuery: string
    error: string | null
    filters: {
        level?: string
        distance?: number
        rating?: number
    }
}

// Updated HospitalMutationTypes
export type HospitalMutationTypes = {
    SET_HOSPITALS: 'SET_HOSPITALS'
    APPEND_HOSPITALS: 'APPEND_HOSPITALS'
    SET_CURRENT_HOSPITAL: 'SET_CURRENT_HOSPITAL'
    SET_DEPARTMENTS: 'SET_DEPARTMENTS'
    SET_FAVORITE_HOSPITALS: 'SET_FAVORITE_HOSPITALS'
    SET_CURRENT_HOSPITAL_RATINGS: 'SET_CURRENT_HOSPITAL_RATINGS'
    ADD_FAVORITE: 'ADD_FAVORITE'
    REMOVE_FAVORITE: 'REMOVE_FAVORITE'
    SET_LOADING: 'SET_LOADING'
    SET_PAGE: 'SET_PAGE'
    SET_HAS_MORE: 'SET_HAS_MORE'
    SET_SEARCH_QUERY: 'SET_SEARCH_QUERY'
    SET_FILTERS: 'SET_FILTERS'
    SET_ERROR: 'SET_ERROR'
}

// Updated HospitalGetters
export interface HospitalGetters {
    filteredHospitals: Hospital[]
    isLoading: boolean
    hasMore: boolean
    currentHospital: Hospital | null
    favoriteHospitals: Hospital[]
    currentHospitalRatings: Rating[]
}

// 应用全局状态
export interface AppState {
    location: {
        latitude: number
        longitude: number
    } | null
    systemInfo: SystemInfo | null
    networkType: string
    theme: 'light' | 'dark'
    loading: boolean
    error: string | null
}

// 系统信息接口
export interface SystemInfo {
    brand: string
    model: string
    pixelRatio: number
    screenWidth: number
    screenHeight: number
    windowWidth: number
    windowHeight: number
    statusBarHeight: number
    language: string
    version: string
    platform: string
}

// Vuex 提交事件类型
export type AuthMutationTypes = {
    SET_USER: 'SET_USER'
    SET_TOKEN: 'SET_TOKEN'
    SET_LOADING: 'SET_LOADING'
    SET_ERROR: 'SET_ERROR'
    CLEAR_AUTH: 'CLEAR_AUTH'
}

export type HospitalMutationTypes = {
    SET_HOSPITALS: 'SET_HOSPITALS'
    APPEND_HOSPITALS: 'APPEND_HOSPITALS'
    SET_CURRENT_HOSPITAL: 'SET_CURRENT_HOSPITAL'
    SET_DEPARTMENTS: 'SET_DEPARTMENTS'
    SET_LOADING: 'SET_LOADING'
    SET_PAGE: 'SET_PAGE'
    SET_HAS_MORE: 'SET_HAS_MORE'
    SET_SEARCH_QUERY: 'SET_SEARCH_QUERY'
    SET_FILTERS: 'SET_FILTERS'
    SET_ERROR: 'SET_ERROR'
}

export type AppMutationTypes = {
    SET_LOCATION: 'SET_LOCATION'
    SET_SYSTEM_INFO: 'SET_SYSTEM_INFO'
    SET_NETWORK_TYPE: 'SET_NETWORK_TYPE'
    SET_THEME: 'SET_THEME'
    SET_LOADING: 'SET_LOADING'
    SET_ERROR: 'SET_ERROR'
}

// Vuex Action 参数类型
export interface LoginActionPayload {
    code: string
}

export interface SearchHospitalsPayload {
    keyword?: string
    lat?: number
    lng?: number
    radius?: number
    page?: number
    size?: number
}

export interface UpdateFiltersPayload {
    level?: string
    distance?: number
    rating?: number
}

// Getters 返回类型
export interface HospitalGetters {
    filteredHospitals: Hospital[]
    nearbyHospitals: Hospital[]
    favoriteHospitals: Hospital[]
    isLoading: boolean
}

export interface AuthGetters {
    isAuthenticated: boolean
    currentUser: User | null
    isLoading: boolean
}

export interface AppGetters {
    currentLocation: { latitude: number; longitude: number } | null
    isDarkTheme: boolean
    isOnline: boolean
}