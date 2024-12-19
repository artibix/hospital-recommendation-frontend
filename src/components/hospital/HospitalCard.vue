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
          <nut-rate
              v-if="hospital.rating"
              v-model="hospital.rating"
              readonly
              :size="16"
              active-color="#FFB800"
          />
          <view class="distance-wrapper" v-if="hospital.distance">
            <Location size="16" class="distance-icon" />
            <text class="distance">{{ hospital.distance }}km</text>
          </view>
        </view>
        <view class="navigate-button" @click="handleNavigate">
          <Location size="24" class="navigate-icon"/>
          <text class="navigate-text">导航</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Hospital } from '@/api/types';
import Taro from '@tarojs/taro';
import { Location } from '@nutui/icons-vue-taro';

const props = defineProps<{
  hospital: Hospital;
}>();

const handleNavigate = () => {
  Taro.showToast({
    title: '导航功能开发中',
    icon: 'none',
    duration: 2000
  });
};
</script>

<style lang="scss">
.hospital-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  .hospital-info {
    .hospital-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .hospital-name {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        flex: 1;
        margin-right: 12px;
      }

      .hospital-level {
        font-size: 24px;
        color: #2B87FF;
        padding: 6px 12px;
        background: rgba(43, 135, 255, 0.1);
        border-radius: 8px;
        white-space: nowrap;
      }
    }

    .hospital-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;

      .rating-distance {
        display: flex;
        align-items: center;
        gap: 16px;

        :deep(.nut-rate) {
          .nut-rate-item {
            margin-right: 4px;
          }
        }

        .distance-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;

          .distance-icon {
            color: #666;
          }

          .distance {
            font-size: 24px;
            color: #666;
          }
        }
      }

      .navigate-button {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;
        background: rgba(43, 135, 255, 0.1);
        border-radius: 24px;
        transition: background-color 0.2s ease;

        &:active {
          background: rgba(43, 135, 255, 0.2);
        }

        .navigate-icon {
          color: #2B87FF;
        }

        .navigate-text {
          font-size: 24px;
          color: #2B87FF;
          font-weight: 500;
        }
      }
    }
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .hospital-card {
    background: #2a2a2a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .hospital-info {
      .hospital-header {
        .hospital-name {
          color: #fff;
        }
      }

      .hospital-details {
        .rating-distance {
          .distance-wrapper {
            .distance-icon {
              color: #999;
            }

            .distance {
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>