import Taro from '@tarojs/taro'

export async function getLocation() {
    try {
        const res = await Taro.getLocation({
            type: 'gcj02'
        })
        return {
            latitude: res.latitude,
            longitude: res.longitude
        }
    } catch (error) {
        console.error('获取位置信息失败:', error)
        return null
    }
}