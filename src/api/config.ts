// config.ts
import Taro from '@tarojs/taro'

// 获取Taro运行环境
const ENV = Taro.getEnv()

export const config = {
    // H5环境使用window全局变量，小程序环境使用本地存储
    useMock: ENV === Taro.ENV_TYPE.WEB
        ? window.__MOCK_MODE__
        : Taro.getStorageSync('USE_MOCK') === 'true'
};

// 为TypeScript声明全局变量类型
declare global {
    interface Window {
        __MOCK_MODE__?: boolean;
    }
}

// 设置mock模式的工具函数
export function setMockMode(useMock: boolean) {
    if (ENV === Taro.ENV_TYPE.WEB) {
        window.__MOCK_MODE__ = useMock;
    } else {
        Taro.setStorageSync('USE_MOCK', useMock ? 'true' : 'false');
    }
}

// 获取当前mock状态的工具函数
export function getMockMode(): boolean {
    if (ENV === Taro.ENV_TYPE.WEB) {
        return window.__MOCK_MODE__ || false;
    }
    return Taro.getStorageSync('USE_MOCK') === 'true';
}

// 开发环境配置
const devConfig = {
    baseURL: 'http://localhost:8000',  // 修改为你的后端服务地址
    mockEnabled: false
}

// 生产环境配置
const prodConfig = {
    baseURL: 'https://api.example.com',
    mockEnabled: false
}

// 根据环境导出对应配置
export const apiConfig = ENV === Taro.ENV_TYPE.WEB && process.env.NODE_ENV === 'development'
    ? devConfig
    : prodConfig;