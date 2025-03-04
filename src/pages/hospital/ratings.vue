// src/pages/hospital/ratings.vue
<template>
  <view class="ratings-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="title">我的评价</text>
      <text class="subtitle">共 {{ userRatings.length }} 条评价</text>
    </view>

    <!-- 评价列表 -->
    <scroll-view
        scroll-y
        class="ratings-list"
        :style="{ height: scrollHeight + 'px' }"
        @scrolltolower="loadMore"
        :refresher-enabled="true"
        :refresher-triggered="refreshing"
        @refresherrefresh="onRefresh"
    >
      <template v-if="userRatings.length > 0">
        <view
            v-for="item in userRatings"
            :key="item.id"
            class="rating-item"
        >
          <view class="hospital-info" @click="viewHospital(item.hospital_id)">
            <text class="hospital-name">{{ getHospitalName(item.hospital_id) }}</text>
            <nut-icon name="right" size="16" color="#999" />
          </view>

          <view class="rating-scores">
            <view class="score-item">
              <text class="score-label">医疗质量</text>
              <nut-rate
                  :model-value="item.dimensions.medical_quality"
                  readonly
                  :size="16"
                  active-color="#FFB800"
              />
              <text class="score-value">{{ item.dimensions.medical_quality }}分</text>
            </view>

            <view class="score-item">
              <text class="score-label">服务态度</text>
              <nut-rate
                  :model-value="item.dimensions.service"
                  readonly
                  :size="16"
                  active-color="#FFB800"
              />
              <text class="score-value">{{ item.dimensions.service }}分</text>
            </view>

            <view class="score-item">
              <text class="score-label">环境设施</text>
              <nut-rate
                  :model-value="item.dimensions.environment"
                  readonly
                  :size="16"
                  active-color="#FFB800"
              />
              <text class="score-value">{{ item.dimensions.environment }}分</text>
            </view>

            <view class="score-item">
              <text class="score-label">就诊效率</text>
              <nut-rate
                  :model-value="item.dimensions.efficiency"
                  readonly
                  :size="16"
                  active-color="#FFB800"
              />
              <text class="score-value">{{ item.dimensions.efficiency }}分</text>
            </view>

            <view class="score-item">
              <text class="score-label">设备先进度</text>
              <nut-rate
                  :model-value="item.dimensions.equipment"
                  readonly
                  :size="16"
                  active-color="#FFB800"
              />
              <text class="score-value">{{ item.dimensions.equipment }}分</text>
            </view>
          </view>

          <view class="comment" v-if="item.comment">
            <text>{{ item.comment }}</text>
          </view>

          <view class="rating-footer">
            <text class="date">{{ formatDate(item.created_at) }}</text>
          </view>
        </view>
      </template>

      <template v-else>
        <view class="empty-state">
          <nut-empty description="暂无评价记录" />
          <nut-button
              type="primary"
              class="action-button"
              @click="goToHospitalList"
          >
            去评价
          </nut-button>
        </view>
      </template>

      <!-- 加载状态 -->
      <view class="loading-state" v-if="loading && userRatings.length > 0">
        <nut-icon name="loading" size="24" color="#2B87FF" />
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import Taro from '@tarojs/taro';
import { getUserRatings } from '@/api/rating';
import type { Rating } from '@/types/models';
import { useStore } from 'vuex';

const store = useStore();
const userRatings = ref<Rating[]>([]);
const scrollHeight = ref(0);
const loading = ref(false);
const refreshing = ref(false);

// 检查用户是否已登录
const isAuthenticated = computed(() => {
  return store.state.auth?.isAuthenticated || false;
});

// 获取用户评分历史
const fetchUserRatings = async (showLoading = true) => {
  // 检查登录状态
  if (!isAuthenticated.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });

    // 设置一个空数组以避免未登录时的错误
    userRatings.value = [];

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
    userRatings.value = await getUserRatings();
  } catch (error) {
    console.error('获取评价记录失败:', error);
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

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 获取医院名称
const getHospitalName = (hospitalId: string) => {
  // 获取已知的医院列表
  const hospitals = [...store.state.hospital.hospitals, ...store.state.hospital.favoriteHospitals];
  const hospital = hospitals.find(h => h.id === hospitalId);

  if (hospital) {
    return hospital.name;
  }

  // 如果找不到医院信息，返回ID
  return `医院 #${hospitalId}`;
};

// 查看医院详情
const viewHospital = (hospitalId: string) => {
  Taro.navigateTo({
    url: `/pages/hospital/detail?id=${hospitalId}`
  });
};

// 前往医院列表
const goToHospitalList = () => {
  Taro.navigateTo({ url: '/pages/hospital/list' });
};

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true;
  fetchUserRatings(false);
};

// 上拉加载更多
const loadMore = () => {
  // 这里可以实现分页加载，目前简单实现
  console.log('加载更多评价');
};

onMounted(() => {
  // 获取页面可用高度
  const systemInfo = Taro.getSystemInfoSync();
  // 减去顶部标题区域的高度
  scrollHeight.value = systemInfo.windowHeight - 100;

  fetchUserRatings();
});

// 页面显示时刷新数据
Taro.useDidShow(() => {
  fetchUserRatings();
});
</script>

<style lang="scss">
.ratings-page {
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

  .ratings-list {
    padding: 16px;

    .rating-item {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      .hospital-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 16px;

        .hospital-name {
          font-size: 28px;
          font-weight: 500;
          color: #333;
        }
      }

      .rating-scores {
        margin-bottom: 16px;

        .score-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          .score-label {
            width: 120px;
            font-size: 24px;
            color: #666;
          }

          .score-value {
            margin-left: 8px;
            font-size: 24px;
            color: #666;
          }
        }
      }

      .comment {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        font-size: 24px;
        color: #333;
        line-height: 1.5;
      }

      .rating-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .date {
          font-size: 22px;
          color: #999;
        }
      }
    }

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
  .ratings-page {
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

    .ratings-list {
      .rating-item {
        background: #2a2a2a;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

        .hospital-info {
          border-bottom: 1px solid #333;

          .hospital-name {
            color: #fff;
          }
        }

        .rating-scores {
          .score-item {
            .score-label,
            .score-value {
              color: #999;
            }
          }
        }

        .comment {
          background: #333;
          color: #eee;
        }

        .rating-footer {
          .date {
            color: #777;
          }
        }
      }

      .loading-state {
        color: #999;
      }
    }
  }
}
</style>