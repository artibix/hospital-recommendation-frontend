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
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import Taro from '@tarojs/taro';
import {getFavoriteHospitals} from '@/api/hospital';
import type {Hospital} from '@/api/types';
import HospitalCard from '@/components/hospital/HospitalCard.vue';

const favoriteHospitals = ref<Hospital[]>([]);
const scrollHeight = ref(0);

const handleHospitalSelect = (hospital: Hospital) => {
  Taro.navigateTo({
    url: `/pages/hospital/detail?id=${hospital.id}`
  });
};

const handleFavoriteToggle = async (hospital: Hospital) => {
  // 从收藏列表中移除
  const index = favoriteHospitals.value.findIndex(h => h.id === hospital.id);
  if (index > -1) {
    favoriteHospitals.value.splice(index, 1);
    Taro.showToast({
      title: '已取消收藏',
      icon: 'success',
      duration: 2000
    });
  }
};

const handleNavigate = (hospital: Hospital) => {
  console.log('导航至医院:', hospital);
  // 处理导航逻辑
};

const goToHospitalList = () => {
  Taro.navigateTo({ url: '/pages/hospital/list' });
};

const fetchFavorites = async () => {
  try {
    favoriteHospitals.value = await getFavoriteHospitals();
  } catch (error) {
    console.error('获取收藏医院失败:', error);
    Taro.showToast({
      title: '获取数据失败',
      icon: 'error',
      duration: 2000
    });
  }
};

onMounted(() => {
  // 获取页面可用高度
  const systemInfo = Taro.getSystemInfoSync();
  // 减去顶部标题区域的高度
  scrollHeight.value = systemInfo.windowHeight - 100;

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
  }
}
</style>