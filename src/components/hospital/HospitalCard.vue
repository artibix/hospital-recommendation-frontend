// src/components/hospital/HospitalCard.vue
<template>
  <view class="hospital-card">
    <view class="hospital-info">
      <view class="hospital-header">
        <text class="hospital-name">{{ hospital.name }}</text>
        <text class="hospital-level">{{ hospital.level }}</text>
      </view>
      <view class="hospital-details">
        <view class="rating-distance">
          <nut-rate v-if="hospital.rating" v-model="hospital.rating" readonly />
          <text class="distance" v-if="hospital.distance">{{ hospital.distance }}km</text>
        </view>
        <nut-button
            class="navigate-btn"
            type="primary"
            size="small"
            @click="handleNavigate"
        >
          导航
        </nut-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Hospital } from '@/api/types';
import Taro from '@tarojs/taro';

const props = defineProps<{
  hospital: Hospital;
}>();

const handleNavigate = () => {
  Taro.showToast({
    title: '导航功能开发中',
    icon: 'none'
  });
};
</script>

<style lang="scss">
.hospital-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .hospital-info {
    .hospital-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .hospital-name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .hospital-level {
        font-size: 14px;
        color: #2B87FF;
        padding: 4px 8px;
        background: rgba(43, 135, 255, 0.1);
        border-radius: 4px;
      }
    }

    .hospital-details {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rating-distance {
        display: flex;
        align-items: center;
        gap: 8px;

        .distance {
          font-size: 14px;
          color: #666;
        }
      }

      .navigate-btn {
        padding: 4px 12px;
      }
    }
  }
}
</style>