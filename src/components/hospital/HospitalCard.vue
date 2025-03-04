// src/components/hospital/HospitalCard.vue
<template>
  <view class="hospital-card" @click="onCardClick">
    <view class="hospital-info">
      <!-- 医院基本信息 -->
      <view class="hospital-header">
        <text class="hospital-name">{{ hospital.name }}</text>
        <text class="hospital-level">{{ hospital.level }}</text>
      </view>

      <!-- 医院标签 -->
      <view class="hospital-tags" v-if="hospital.tags && hospital.tags.length > 0">
        <text
            v-for="tag in hospital.tags"
            :key="tag"
            class="tag"
        >{{ tag }}</text>
      </view>

      <!-- 推荐理由 (仅在推荐场景中显示) -->
      <view class="match-reason" v-if="hospital.match_reason">
        <view class="match-label">
          <text class="match-score" v-if="hospital.match_score">匹配度 {{ (hospital.match_score * 100).toFixed(0) }}%</text>
          <text class="recommendation-label">推荐理由:</text>
        </view>
        <text class="reason-text">{{ hospital.match_reason }}</text>
      </view>

      <!-- 科室信息 (在推荐场景中显示) -->
      <view class="departments-preview" v-if="hospital.departments && hospital.departments.length > 0 && showDepartmentsPreview">
        <text class="dept-label">相关科室: </text>
        <view class="dept-tags">
          <text
              v-for="(dept, index) in hospital.departments.slice(0, 3)"
              :key="index"
              class="dept-tag"
          >{{ dept }}</text>
          <text v-if="hospital.departments.length > 3" class="more-dept">等{{ hospital.departments.length }}个科室</text>
        </view>
      </view>

      <!-- 评分和距离信息 -->
      <view class="hospital-details">
        <view class="rating-info">
          <nut-rate
              v-if="hospital.rating"
              v-model="hospital.rating"
              readonly
              :size="16"
              active-color="#FFB800"
          />
          <text class="rating-text" v-if="hospital.rating">
            {{ hospital.rating }}分
          </text>
          <view class="distance-wrapper" v-if="hospital.distance">
            <Location size="16" class="distance-icon" />
            <text class="distance">{{ hospital.distance }}km</text>
          </view>
        </view>

        <!-- 操作按钮区 -->
        <view class="actions">
          <view class="action-button favorite" @click.stop="handleFavorite">
            <Star :fill="isFavorite" class="action-icon" />
            <text class="action-text">{{ isFavorite ? '已收藏' : '收藏' }}</text>
          </view>
          <view class="action-button navigate" @click.stop="handleNavigate">
            <Location class="action-icon" />
            <text class="action-text">导航</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits } from 'vue';
import { Hospital } from '@/api/types';
import Taro from '@tarojs/taro';
import { Location, Star } from '@nutui/icons-vue-taro';

const props = defineProps({
  hospital: {
    type: Object as () => Hospital,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  showDepartmentsPreview: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click', 'favorite', 'navigate']);

const onCardClick = () => {
  emit('click', props.hospital);
  Taro.navigateTo({
    url: `/pages/hospital/detail?id=${props.hospital.id}`
  });
};

const handleFavorite = () => {
  emit('favorite', props.hospital);
  Taro.showToast({
    title: props.isFavorite ? '已取消收藏' : '已添加收藏',
    icon: 'success',
    duration: 2000
  });
};

const handleNavigate = () => {
  emit('navigate', props.hospital);
  const hospital = props.hospital;
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

    .hospital-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;

      .tag {
        font-size: 24px;
        color: #666;
        padding: 4px 12px;
        background: #f5f5f5;
        border-radius: 6px;
      }
    }

    .match-reason {
      background: rgba(43, 135, 255, 0.05);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;

      .match-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .match-score {
          font-size: 24px;
          color: #2B87FF;
          font-weight: 500;
        }

        .recommendation-label {
          font-size: 24px;
          color: #666;
          font-weight: 500;
        }
      }

      .reason-text {
        font-size: 24px;
        color: #333;
        line-height: 1.5;
      }
    }

    .departments-preview {
      margin-bottom: 16px;

      .dept-label {
        font-size: 24px;
        color: #666;
        margin-bottom: 8px;
        display: block;
      }

      .dept-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .dept-tag {
          font-size: 22px;
          color: #2B87FF;
          padding: 4px 12px;
          background: rgba(43, 135, 255, 0.1);
          border-radius: 6px;
        }

        .more-dept {
          font-size: 22px;
          color: #999;
        }
      }
    }

    .hospital-details {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .rating-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .rating-text {
          font-size: 24px;
          color: #666;
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

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;

        .action-button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          border-radius: 24px;
          transition: all 0.2s ease;

          .action-icon {
            font-size: 24px;
          }

          .action-text {
            font-size: 24px;
            font-weight: 500;
          }

          &.favorite {
            background: rgba(255, 77, 79, 0.1);

            .action-icon, .action-text {
              color: #ff4d4f;
            }

            &:active {
              background: rgba(255, 77, 79, 0.2);
            }
          }

          &.navigate {
            background: rgba(43, 135, 255, 0.1);

            .action-icon, .action-text {
              color: #2B87FF;
            }

            &:active {
              background: rgba(43, 135, 255, 0.2);
            }
          }
        }
      }
    }
  }
}

// 暗黑模式支持
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

      .hospital-tags {
        .tag {
          background: #333;
          color: #999;
        }
      }

      .match-reason {
        background: rgba(43, 135, 255, 0.1);

        .reason-text {
          color: #ccc;
        }
      }

      .departments-preview {
        .dept-label {
          color: #999;
        }
      }

      .hospital-details {
        .rating-info {
          .rating-text,
          .distance-wrapper {
            .distance-icon,
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