// src/components/hospital/RatingsList.vue
<template>
  <view class="ratings-list">
    <!-- 评分统计 -->
    <view class="ratings-summary" v-if="statistics">
      <view class="average-rating">
        <text class="rating-value">{{ statistics.overall.toFixed(1) }}</text>
        <nut-rate
            :model-value="statistics.overall"
            readonly
            :size="20"
            active-color="#FFB800"
        />
        <text class="rating-count" v-if="statistics.count > 0">({{ statistics.count }}人评价)</text>
      </view>
      <view class="dimensions">
        <view class="dimension">
          <text class="dimension-label">医疗质量</text>
          <view class="dimension-bar-container">
            <view
                class="dimension-bar"
                :style="{ width: `${statistics.medical_quality * 20}%` }"
            ></view>
          </view>
          <text class="dimension-value">{{ statistics.medical_quality.toFixed(1) }}</text>
        </view>

        <view class="dimension">
          <text class="dimension-label">服务态度</text>
          <view class="dimension-bar-container">
            <view
                class="dimension-bar"
                :style="{ width: `${statistics.service * 20}%` }"
            ></view>
          </view>
          <text class="dimension-value">{{ statistics.service.toFixed(1) }}</text>
        </view>

        <view class="dimension">
          <text class="dimension-label">环境设施</text>
          <view class="dimension-bar-container">
            <view
                class="dimension-bar"
                :style="{ width: `${statistics.environment * 20}%` }"
            ></view>
          </view>
          <text class="dimension-value">{{ statistics.environment.toFixed(1) }}</text>
        </view>

        <view class="dimension">
          <text class="dimension-label">就诊效率</text>
          <view class="dimension-bar-container">
            <view
                class="dimension-bar"
                :style="{ width: `${statistics.efficiency * 20}%` }"
            ></view>
          </view>
          <text class="dimension-value">{{ statistics.efficiency.toFixed(1) }}</text>
        </view>

        <view class="dimension">
          <text class="dimension-label">设备先进度</text>
          <view class="dimension-bar-container">
            <view
                class="dimension-bar"
                :style="{ width: `${statistics.equipment * 20}%` }"
            ></view>
          </view>
          <text class="dimension-value">{{ statistics.equipment.toFixed(1) }}</text>
        </view>
      </view>
    </view>

    <!-- 评分列表 -->
    <view class="ratings-header">
      <text class="title">用户评价 ({{ ratings.length }})</text>
      <nut-button class="add-rating" @click="onAddRating">写评价</nut-button>
    </view>

    <view class="empty-state" v-if="ratings.length === 0">
      <nut-empty description="暂无评价" />
      <nut-button
          type="primary"
          size="small"
          class="add-rating-btn"
          @click="onAddRating"
      >
        写第一条评价
      </nut-button>
    </view>

    <view class="rating-items" v-else>
      <view
          v-for="rating in ratings"
          :key="rating.id"
          class="rating-item"
      >
        <view class="rating-header">
          <view class="user-info">
            <text class="user-name">{{ getMaskedUserId(rating.user_id) }}</text>
            <text class="rating-date">{{ formatDate(rating.created_at) }}</text>
          </view>
          <view class="rating-score">
            <nut-rate
                :model-value="getDisplayRating(rating)"
                readonly
                :size="16"
                active-color="#FFB800"
            />
          </view>
        </view>

        <view class="rating-details">
          <text class="detail-item">医疗质量: {{ rating.dimensions.medical_quality }}分</text>
          <text class="detail-item">服务态度: {{ rating.dimensions.service }}分</text>
          <text class="detail-item">环境设施: {{ rating.dimensions.environment }}分</text>
          <text class="detail-item">就诊效率: {{ rating.dimensions.efficiency }}分</text>
          <text class="detail-item">设备先进度: {{ rating.dimensions.equipment }}分</text>
        </view>

        <view class="rating-comment" v-if="rating.comment">
          <text>{{ rating.comment }}</text>
        </view>
      </view>
    </view>

    <!-- 添加评价弹窗 -->
    <nut-popup
        position="bottom"
        v-model:visible="showRatingForm"
        :style="{ height: '80%' }"
    >
      <view class="popup-title">评价医院</view>
      <rating-form
          :hospital-id="hospitalId"
          @success="onRatingSuccess"
          @cancel="showRatingForm = false"
      />
    </nut-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import Taro from '@tarojs/taro';
import { getHospitalRatings, RatingStatistics } from '@/api/rating';
import type { Rating } from '@/types/models';
import RatingForm from './RatingForm.vue';
import { useStore } from 'vuex';

const props = defineProps({
  hospitalId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update']);

const store = useStore();
const ratings = ref<Rating[]>([]);
const statistics = ref<RatingStatistics | null>(null);
const loading = ref(false);
const showRatingForm = ref(false);

// 获取评分列表
const fetchRatings = async () => {
  if (!props.hospitalId) return;

  loading.value = true;
  try {
    const response = await getHospitalRatings(props.hospitalId);
    ratings.value = response.recent_ratings;
    statistics.value = response.statistics;
  } catch (error) {
    console.error('获取评分列表失败:', error);
    Taro.showToast({
      title: '获取评价失败',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 获取评分平均值
const getDisplayRating = (rating: Rating) => {
  return Number(((
      rating.medical_quality +
      rating.service +
      rating.environment +
      rating.efficiency +
      rating.equipment
  ) / 5).toFixed(1));
};

// 隐藏用户ID，只显示前三位
const getMaskedUserId = (userId: string) => {
  if (!userId) return '匿名用户';
  if (userId.length <= 3) return userId;
  return `用户${userId.substring(0, 3)}***`;
};

const onAddRating = () => {
  // 检查用户是否已登录
  if (!store.state.auth.isAuthenticated) {
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

  // 显示评价表单弹窗
  showRatingForm.value = true;
  console.log('弹出评价表单', showRatingForm.value);
};

// 评价提交成功
const onRatingSuccess = () => {
  showRatingForm.value = false;
  fetchRatings();
  emit('update');
};

// 监听医院ID变化
watch(() => props.hospitalId, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    fetchRatings();
  }
});

onMounted(() => {
  fetchRatings();
});
</script>

<style lang="scss">
.ratings-list {
  padding: 16px;
  background: #fff;
  border-radius: 12px;

  .ratings-summary {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;

    .average-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;

      .rating-value {
        font-size: 48px;
        font-weight: bold;
        color: #333;
      }

      .rating-count {
        font-size: 24px;
        color: #999;
      }
    }

    .dimensions {
      .dimension {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .dimension-label {
          width: 120px;
          font-size: 24px;
          color: #666;
        }

        .dimension-bar-container {
          flex: 1;
          height: 16px;
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 16px;

          .dimension-bar {
            height: 100%;
            background: #FFB800;
            border-radius: 8px;
          }
        }

        .dimension-value {
          width: 60px;
          font-size: 24px;
          color: #666;
          text-align: right;
        }
      }
    }
  }

  .ratings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 28px;
      font-weight: 500;
      color: #333;
    }

    .add-rating {
      font-size: 24px;
      color: #2B87FF;
      cursor: pointer;
    }
  }

  .empty-state {
    padding: 32px 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .add-rating-btn {
      margin-top: 16px;
    }
  }

  .rating-items {
    .rating-item {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .rating-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;

        .user-info {
          .user-name {
            font-size: 24px;
            color: #333;
            margin-right: 12px;
          }

          .rating-date {
            font-size: 22px;
            color: #999;
          }
        }
      }

      .rating-details {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 12px;

        .detail-item {
          font-size: 22px;
          color: #666;
          margin-right: 16px;
          margin-bottom: 8px;
        }
      }

      .rating-comment {
        font-size: 24px;
        color: #333;
        line-height: 1.5;
        padding: 8px 12px;
        background: #f9f9f9;
        border-radius: 8px;
      }
    }
  }

  .popup-title {
    font-size: 32px;
    font-weight: 500;
    text-align: center;
    padding: 24px 0 8px;
    color: #333;
  }
}

// 暗黑模式支持
@media (prefers-color-scheme: dark) {
  .ratings-list {
    background: #2a2a2a;

    .ratings-summary {
      border-bottom: 1px solid #333;

      .average-rating {
        .rating-value {
          color: #fff;
        }

        .rating-count {
          color: #777;
        }
      }

      .dimensions {
        .dimension {
          .dimension-label,
          .dimension-value {
            color: #999;
          }

          .dimension-bar-container {
            background: #333;
          }
        }
      }
    }

    .ratings-header {
      .title {
        color: #fff;
      }
    }

    .rating-items {
      .rating-item {
        border-bottom: 1px solid #333;

        .rating-header {
          .user-info {
            .user-name {
              color: #eee;
            }
          }
        }

        .rating-details {
          .detail-item {
            color: #999;
          }
        }

        .rating-comment {
          color: #eee;
          background: #333;
        }
      }
    }

    .popup-title {
      color: #fff;
    }
  }
}
</style>