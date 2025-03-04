// src/pages/hospital/favorites.vue
<template>
  <view class="favorites-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="title">我的收藏</text>
      <text class="subtitle">共 {{ favoriteHospitals.length }} 家医院</text>
    </view>

    <!-- 收藏列表 -->
    <scroll-view
        scroll-y
        class="favorites-list"
        :style="{ height: scrollHeight + 'px' }"
        @scrolltolower="loadMore"
        :refresher-enabled="true"
        :refresher-triggered="refreshing"
        @refresherrefresh="onRefresh"
    >
      <template v-if="favoriteHospitals.length > 0">
        <hospital-card
            v-for="hospital in favoriteHospitals"
            :key="hospital.id"
            :hospital="hospital"
            :is-favorite="true"
            @click="handleHospitalSelect"
            @favorite="handleFavoriteToggle"
            @navigate="handleNavigate"
        />
      </template>
      <template v-else>
        <view class="empty-state">
          <nut-empty description="暂无收藏医院" />
          <nut-button
              type="primary"
              class="action-button"
              @click="goToHospitalList"
          >
            去发现医院
          </nut-button>
        </view>
      </template>

      <!-- 加载状态 -->
      <view class="loading-state" v-if="loading && favoriteHospitals.length > 0">
        <nut-icon name="loading" size="24" color="#2B87FF" />
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Taro from '@tarojs/taro';
import { getFavoriteHospitals, removeFavorite } from '@/api/favorite';
import type { Hospital } from '@/api/types';
import HospitalCard from '@/components/hospital/HospitalCard.vue';
import { useStore } from 'vuex';

const favoriteHospitals = ref<Hospital[]>([]);
const scrollHeight = ref(0);
const loading = ref(false);
const refreshing = ref(false);
const store = useStore();

const handleHospitalSelect = (hospital: Hospital) => {
  Taro.navigateTo({
    url: `/pages/hospital/detail?id=${hospital.id}`
  });
};

const handleFavoriteToggle = async (event: { hospital: Hospital, isFavorite: boolean }) => {
  const { hospital, isFavorite } = event;

  // 如果是取消收藏
  if (!isFavorite) {
    try {
      await removeFavorite(hospital.id);
      // 从列表中移除
      favoriteHospitals.value = favoriteHospitals.value.filter(h => h.id !== hospital.id);

      Taro.showToast({
        title: '已取消收藏',
        icon: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('取消收藏失败:', error);
      Taro.showToast({
        title: '操作失败，请重试',
        icon: 'error',
        duration: 2000
      });
    }
  }
};

const handleNavigate = (hospital: Hospital) => {
  if (!hospital.latitude || !hospital.longitude) {
    Taro.showToast({
      title: '无法获取医院位置信息',
      icon: 'none'
    });
    return;
  }

  Taro.openLocation({
    latitude: hospital.latitude,
    longitude: hospital.longitude,
    name: hospital.name,
    address: hospital.address
  });
};

const goToHospitalList = () => {
  Taro.navigateTo({ url: '/pages/hospital/list' });
};

const fetchFavorites = async (showLoading = true) => {
  // 检查登录状态
  if (!store.state.auth.isAuthenticated) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });

    // 设置一个空数组以避免未登录时的错误
    favoriteHospitals.value = [];

    // 延迟跳转到登录页
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/auth/login' });
    }, 1000);
    return;
  }

  if (showLoading) {
    loading.value = true;
  }

  try {
    favoriteHospitals.value = await getFavoriteHospitals();
  } catch (error) {
    console.error('获取收藏医院失败:', error);
    Taro.showToast({
      title: '获取数据失败',
      icon: 'error',
      duration: 2000
    });
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true;
  fetchFavorites(false);
};

// 上拉加载更多
const loadMore = () => {
  // 这里可以实现分页加载，目前简单实现
  console.log('加载更多收藏医院');
};

onMounted(() => {
  // 获取页面可用高度
  const systemInfo = Taro.getSystemInfoSync();
  // 减去顶部标题区域的高度
  scrollHeight.value = systemInfo.windowHeight - 100;

  fetchFavorites();
});

// 页面显示时刷新数据
Taro.useDidShow(() => {
  fetchFavorites();
});
</script>

<style lang="scss">
.favorites-page {
  min-height: 100vh;
  background: #f8f8f8;

  .page-header {
    padding: 24px 16px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 16px;

    .title {
      font-size: 32px;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 24px;
      color: #666;
    }
  }

  .favorites-list {
    padding: 16px;

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 16px;

      .action-button {
        margin-top: 24px;
        width: 240px;
        height: 80px;
        border-radius: 40px;
        font-size: 28px;
      }
    }

    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      gap: 8px;
      color: #666;
      font-size: 24px;
    }
  }
}

// 暗黑模式支持
@media (prefers-color-scheme: dark) {
  .favorites-page {
    background: #1a1a1a;

    .page-header {
      background: #2a2a2a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      .title {
        color: #fff;
      }

      .subtitle {
        color: #999;
      }
    }

    .favorites-list {
      .loading-state {
        color: #999;
      }
    }
  }
}
</style>