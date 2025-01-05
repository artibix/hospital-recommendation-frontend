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
            :is-favorite="isHospitalFavorite(hospital.id)"
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
import { ref, onMounted } from 'vue';
import { Category, Heart } from '@nutui/icons-vue-taro';
import { getNearbyHospitals } from '@/api/hospital';
import Taro from '@tarojs/taro';
import SearchBar from '@/components/base/SearchBar.vue';
import HospitalCard from '@/components/hospital/HospitalCard.vue';
import {Hospital} from "@/types/models";

// 状态定义
const nearbyHospitals = ref<Hospital[]>([]);
const favoriteIds = ref<string[]>(['1', '3']); // 示例收藏ID

// 页面跳转函数
const goToHospitalList = () => {
  Taro.navigateTo({ url: '/pages/hospital/list' });
};

const goToFavorites = () => {
  Taro.navigateTo({ url: '/pages/hospital/favorites' });
};

const isHospitalFavorite = (hospitalId: string) => {
  return favoriteIds.value.includes(hospitalId);
};

// 获取附近医院数据
const fetchNearbyHospitals = async () => {
  try {
    const hospitals = await getNearbyHospitals({});
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