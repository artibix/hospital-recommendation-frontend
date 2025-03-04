//src/pages/index/index.vue
<template>
  <view class="index-container">
    <!-- 搜索栏 -->
    <SearchBar />

    <!-- 功能区域 -->
    <view class="function-area">
      <nut-grid :column-num="2">
        <nut-grid-item
            text="医院列表"
            @click="goToHospitalList"
            class="hospital-list-item"
        >
          <Category class="grid-icon" />
        </nut-grid-item>

        <nut-grid-item
            text="我的收藏"
            @click="goToFavorites"
            class="favorites-item"
        >
          <Heart class="grid-icon" />
        </nut-grid-item>
      </nut-grid>
    </view>

    <!-- 附近医院 -->
    <view class="nearby-section">
      <view class="section-header">
        <text class="section-title">附近医院</text>
        <text class="section-subtitle">根据您的位置为您推荐</text>
      </view>

      <view class="hospital-list">
        <hospital-card
            v-for="hospital in nearbyHospitals"
            :key="hospital.id"
            :hospital="hospital"
            :check-favorite-status="true"
            @favorite="handleFavoriteChange"
        />

        <view v-if="nearbyHospitals.length > 3" class="view-more" @click="goToHospitalList">
          <text class="view-more-text">查看更多医院</text>
          <nut-icon name="right" size="16" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
//src/pages/index/index.vue - Updated Script Section with fixed handleFavoriteChange
import { ref, onMounted, computed } from 'vue';
import { Category, Heart } from '@nutui/icons-vue-taro';
import { getNearbyHospitals } from '@/api/hospital';
import Taro from '@tarojs/taro';
import SearchBar from '@/components/base/SearchBar.vue';
import HospitalCard from '@/components/hospital/HospitalCard.vue';
import { Hospital } from "@/types/models";
import { useStore } from 'vuex';
import { checkIsFavorite, toggleFavorite } from '@/api/favorite';

// 状态定义
const nearbyHospitals = ref<Hospital[]>([]);
const store = useStore();

// 计算属性：是否已认证
const isAuthenticated = computed(() => store.state.auth.isAuthenticated);

// 页面跳转函数
const goToHospitalList = () => {
  Taro.navigateTo({ url: '/pages/hospital/list' });
};

const goToFavorites = () => {
  if (!isAuthenticated.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });

    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/auth/login' });
    }, 1500);

    return;
  }

  Taro.navigateTo({ url: '/pages/hospital/favorites' });
};

// 处理收藏状态变化
const handleFavoriteChange = async (event: { hospital: Hospital, isFavorite: boolean }) => {
  const { hospital, isFavorite } = event;

  // 检查用户是否已登录
  if (!isAuthenticated.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });

    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/auth/login' });
    }, 1500);

    return;
  }

  try {
    // 根据当前状态调用相应的action
    if (isFavorite) {
      await store.dispatch('hospital/addFavorite', hospital.id);
    } else {
      await store.dispatch('hospital/removeFavorite', hospital.id);
    }

    // 显示操作结果
    Taro.showToast({
      title: isFavorite ? '已添加收藏' : '已取消收藏',
      icon: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('操作收藏失败:', error);
    Taro.showToast({
      title: '操作失败，请重试',
      icon: 'error',
      duration: 2000
    });
  }
};

// 获取附近医院数据
const fetchNearbyHospitals = async () => {
  try {
    // 首先尝试获取用户位置
    let lat = 27.3019; // 毕节市中心纬度（默认值）
    let lng = 105.2877; // 毕节市中心经度（默认值）

    // try {
    //   // 尝试获取用户真实位置
    //   const location = await Taro.getLocation({
    //     type: 'gcj02', // 使用国测局坐标系
    //     isHighAccuracy: true, // 开启高精度定位
    //     highAccuracyExpireTime: 3000 // 高精度定位超时时间，单位ms
    //   });
    //
    //   if (location) {
    //     lat = location.latitude;
    //     lng = location.longitude;
    //   }
    // } catch (locationError) {
    //   console.warn('获取位置失败，使用默认位置:', locationError);
    // }

    // 使用获取到的或默认位置调用API
    const hospitals = await getNearbyHospitals({
      lat,
      lng,
      radius: 10 // 默认10公里范围
    });

    // 只显示前3个医院
    nearbyHospitals.value = hospitals.slice(0, 3);
  } catch (error) {
    console.error('获取附近医院失败:', error);
    Taro.showToast({
      title: '获取数据失败',
      icon: 'error',
      duration: 2000
    });
  }
};

// 初始化
onMounted(() => {
  fetchNearbyHospitals();
});

// 页面显示时刷新数据
Taro.useDidShow(() => {
  // 当页面重新显示时，刷新附近医院数据
  fetchNearbyHospitals();
});
</script>

<style lang="scss">
.index-container {
  min-height: 100vh;
  padding: 20px 16px;
  background-color: #f8f8f8;

  .function-area {
    margin: 24px 0;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    :deep(.nut-grid) {
      padding: 16px;

      .nut-grid-item {
        &::after {
          display: none;
        }

        .nut-grid-item__content {
          padding: 24px 16px;
          border-radius: 12px;
          transition: all 0.3s ease;

          &:active {
            transform: scale(0.96);
          }
        }

        .grid-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .nut-grid-item__text {
          font-size: 28px;
          font-weight: 500;
          color: #333;
        }

        &.hospital-list-item {
          .grid-icon {
            color: #2B87FF;
          }
        }

        &.favorites-item {
          .grid-icon {
            color: #ff4d4f;
          }
        }
      }
    }
  }

  .nearby-section {
    margin-top: 32px;

    .section-header {
      margin-bottom: 20px;

      .section-title {
        font-size: 32px;
        font-weight: 600;
        color: #333;
        display: block;
        margin-bottom: 8px;
      }

      .section-subtitle {
        font-size: 24px;
        color: #666;
      }
    }

    .hospital-list {
      .view-more {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: #fff;
        border-radius: 12px;
        margin-top: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        cursor: pointer;

        .view-more-text {
          font-size: 28px;
          color: #2B87FF;
          margin-right: 8px;
        }

        &:active {
          opacity: 0.8;
        }
      }
    }
  }
}

// 暗黑模式支持
@media (prefers-color-scheme: dark) {
  .index-container {
    background: #1a1a1a;

    .function-area {
      background: #2a2a2a;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      :deep(.nut-grid) {
        .nut-grid-item {
          .nut-grid-item__text {
            color: #fff;
          }
        }
      }
    }

    .nearby-section {
      .section-header {
        .section-title {
          color: #fff;
        }
        .section-subtitle {
          color: #999;
        }
      }

      .hospital-list {
        .view-more {
          background: #2a2a2a;
        }
      }
    }
  }
}
</style>