import Taro from '@tarojs/taro'

configureRequest({
    baseURL: 'http://localhost:8000',
    timeout: 30000,
    tokenKey: 'auth_token',
    loginPath: '/pages/auth/login'
});

// Configuration types
export interface RequestConfig {
    baseURL?: string
    timeout?: number
    headers?: Record<string, string>
    tokenKey?: string
    loginPath?: string
}

// Request options interface
export interface RequestOptions {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    params?: Record<string, any>
    headers?: Record<string, string>
    timeout?: number
}

// Response interface
export interface ResponseData<T = any> {
    code: number
    message: string
    data: T
}

// Custom error class
export class RequestError extends Error {
    code: number
    data?: any

    constructor(message: string, code: number, data?: any) {
        super(message)
        this.code = code
        this.data = data
        this.name = 'RequestError'
    }
}

// Default configuration
const defaultConfig: RequestConfig = {
    baseURL: 'http://localhost:8000',
    timeout: 60000,
    tokenKey: 'token',
    loginPath: '/pages/auth/login'
}

let globalConfig: RequestConfig = { ...defaultConfig }

// Configure global settings
export function configureRequest(config: Partial<RequestConfig>) {
    globalConfig = {
        ...defaultConfig,
        ...config
    }
}

// Request interceptor
async function requestInterceptor(options: RequestOptions) {
    const token = Taro.getStorageSync(globalConfig.tokenKey || 'token')
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    }

    return {
        ...options,
        header: {
            ...defaultHeaders,
            ...globalConfig.headers,
            ...options.headers
        }
    }
}

// Response interceptor
function responseInterceptor(response: Taro.request.SuccessCallbackResult<ResponseData>) {
    const { statusCode, data } = response

    // Handle specific status codes
    switch (statusCode) {
        case 401:
            Taro.removeStorageSync(globalConfig.tokenKey || 'token')
            Taro.navigateTo({ url: globalConfig.loginPath || '/pages/auth/login' })
            throw new RequestError('Unauthorized access', 401, data)
        case 403:
            throw new RequestError('Access forbidden', 403, data)
        case 404:
            throw new RequestError('Resource not found', 404, data)
        case 500:
            throw new RequestError('Server error', 500, data)
    }

    // Handle business logic errors
    if (data.code !== 0 && data.code !== 200) {
        throw new RequestError(data.message || 'Business logic error', data.code, data)
    }

    return data
}

// Main request function
export async function request<T>({
                                     url,
                                     method = 'GET',
                                     data,
                                     params,
                                     headers,
                                     timeout
                                 }: RequestOptions): Promise<ResponseData<T>> {
    try {
        // Build URL with query parameters
        const queryString = params ? new URLSearchParams(params).toString() : ''
        const finalUrl = `${globalConfig.baseURL || ''}${url}${queryString ? `?${queryString}` : ''}`

        // Apply request interceptor
        const interceptedOptions = await requestInterceptor({
            url: finalUrl,
            method,
            data,
            headers,
            timeout: timeout || globalConfig.timeout
        })

        // Make request
        const response = await Taro.request({
            ...interceptedOptions,
            url: finalUrl
        })

        // Apply response interceptor
        return responseInterceptor(response)
    } catch (error) {
        if (error instanceof RequestError) {
            throw error
        }

        // Handle network errors
        throw new RequestError(
            error.message || 'Network error',
            error.code || 500,
            error.data
        )
    }
}

// Convenience methods
export const http = {
    get: <T>(url: string, params?: Record<string, any>, options?: Partial<RequestOptions>) =>
        request<T>({ ...options, url, method: 'GET', params }),

    post: <T>(url: string, data?: any, options?: Partial<RequestOptions>) =>
        request<T>({ ...options, url, method: 'POST', data }),

    put: <T>(url: string, data?: any, options?: Partial<RequestOptions>) =>
        request<T>({ ...options, url, method: 'PUT', data }),

    delete: <T>(url: string, options?: Partial<RequestOptions>) =>
        request<T>({ ...options, url, method: 'DELETE' })
}