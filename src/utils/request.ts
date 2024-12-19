import Taro from '@tarojs/taro'

interface RequestOptions {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    params?: Record<string, any>
}

interface ResponseData<T = any> {
    code: number
    message: string
    data: T
}

class RequestError extends Error {
    code: number
    constructor(message: string, code: number) {
        super(message)
        this.code = code
    }
}

export async function request<T>({
                                     url,
                                     method = 'GET',
                                     data,
                                     params
                                 }: RequestOptions): Promise<ResponseData<T>> {
    try {
        // Add query parameters to URL if they exist
        const finalUrl = params
            ? `${url}?${new URLSearchParams(params).toString()}`
            : url

        const token = Taro.getStorageSync('token')

        const response = await Taro.request({
            url: finalUrl,
            method,
            data,
            header: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        })

        if (response.statusCode === 401) {
            // Handle unauthorized access
            Taro.removeStorageSync('token')
            Taro.navigateTo({ url: '/pages/login/index' })
            throw new RequestError('Unauthorized access', 401)
        }

        if (response.statusCode >= 400) {
            throw new RequestError(
                response.data.message || 'Request failed',
                response.statusCode
            )
        }

        return response.data
    } catch (error) {
        if (error instanceof RequestError) {
            throw error
        }
        throw new RequestError(error.message || 'Network error', 500)
    }
}