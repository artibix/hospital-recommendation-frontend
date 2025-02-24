// src/api/auth.ts
import { http } from '@/utils/request'
import { config } from './config'
import type { User } from '@/types/models'

// Mock用户数据
const mockUserData = {
    id: '1',
    openid: 'test_openid_001',
    nickname: '测试用户',
    avatarUrl: 'https://example.com/avatar.jpg',
    phone: '13800138000',
    gender: 1,
    createdAt: '2023-07-01T12:00:00Z',
    updatedAt: '2023-07-01T12:00:00Z',
    lastLoginAt: '2023-07-01T12:00:00Z',
    status: 1
}

export interface LoginResponse {
    token: string
    user: User
}

// 微信登录
export const wxLogin = async (code: string, userInfo: any): Promise<LoginResponse> => {
    console.log('Login attempt with code:', code)
    console.log('User info:', userInfo)
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
        return {
            token: 'mock_token_123',
            user: mockUserData
        }
    }

    const response = await http.post<LoginResponse>('/api/v1/auth/login', {
        code,
        userInfo
    })
    return response.data
}

// 获取用户信息
export const getUserInfo = async (): Promise<User> => {
    if (config.useMock) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockUserData
    }

    const response = await http.get<User>('/api/v1/auth/profile')
    return response.data
}