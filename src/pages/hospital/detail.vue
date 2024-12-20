// src/pages/hospital/detail.vue
<template>
  <view class="hospital-detail">
    <!-- 顶部医院基本信息 -->
    <view class="basic-info">
      <view class="header">
        <view class="name-level">
          <text class="name">{{ hospital.name }}</text>
          <text class="level">{{ hospital?.level }}</text>
        </view>
        <view class="rating-info">
          <nut-rate
              v-if="hospital?.rating"
              v-model="hospital.rating"
              readonly
              :size="16"
              active-color="#FFB800"
          />
          <text class="rating-text">{{ hospital?.rating }}分</text>
        </view>
      </view>

      <view class="tags" v-if="hospital?.tags">
        <text
            v-for="tag in hospital.tags"
            :key="tag"
            class="tag"
        >{{ tag }}</text>
      </view>

      <view class="address-info">
        <view class="address">
          <Location size="20" class="icon"/>
          <text>{{ hospital?.address }}</text>
        </view>
        <view class="distance" v-if="hospital?.distance">
          <text>距离：{{ hospital.distance }}km</text>
        </view>
      </view>
    </view>

    <!-- 功能按钮组 -->
    <view class="action-buttons">
      <nut-button
          class="action-btn favorite"
          :type="isFavorite ? 'default' : 'primary'"
          @click="handleFavorite"
      >
        <template #icon>
          <Heart :fill="isFavorite"/>
        </template>
        {{ isFavorite ? '已收藏' : '收藏' }}
      </nut-button>

      <nut-button
          type="primary"
          class="action-btn navigate"
          @click="handleNavigate"
      >
        <template #icon>
          <Location />
        </template>
        导航
      </nut-button>
    </view>

    <!-- 内容区域 -->
    <nut-tabs v-model="activeTab" title-scroll>
      <!-- 科室信息 -->
      <nut-tab-pane title="科室信息" pane-key="departments">
        <scroll-view
            scroll-y
            class="departments-list"
            :style="{ height: scrollHeight + 'px' }"
        >
          <view
              v-for="dept in departments"
              :key="dept.id"
              class="department-item"
          >
            <text class="dept-name">{{ dept.name }}</text>
            <text class="dept-desc">{{ dept.description }}</text>
          </view>
        </scroll-view>
      </nut-tab-pane>

      <!-- 医院介绍 -->
      <nut-tab-pane title="医院介绍" pane-key="introduction">
        <scroll-view
            scroll-y
            class="introduction"
            :style="{ height: scrollHeight + 'px' }"
        >
          <view class="section">
            <text class="section-title">营业时间</text>
            <text class="section-content">{{ hospital?.workingHours || '暂无信息' }}</text>
          </view>
          <view class="section">
            <text class="section-title">医院简介</text>
            <text class="section-content">{{ hospital?.description || '暂无信息' }}</text>
          </view>
        </scroll-view>
      </nut-tab-pane>
    </nut-tabs>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Taro, { useRouter } from '@tarojs/taro';
import { Location, Heart } from '@nutui/icons-vue-taro';
import type {Hospital} from '@/api/types';
import {getHospitalDepartments, getHospitalDetail} from "@/api/hospital";
import {Department} from "@/types/models";
// 状态定义
const router = useRouter();
const hospital = ref<Hospital>({} as Hospital);
const departments = ref<Department[]>([]);
const activeTab = ref('departments');
const scrollHeight = ref(0);
const isFavorite = ref(false);

// 处理收藏
const handleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  Taro.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'success',
    duration: 2000
  });
};

// 处理导航
const handleNavigate = () => {
  if (!hospital.value?.latitude || !hospital.value?.longitude) {
    Taro.showToast({
      title: '无法获取医院位置信息',
      icon: 'none'
    });
    return;
  }

  Taro.openLocation({
    latitude: hospital.value.latitude,
    longitude: hospital.value.longitude,
    name: hospital.value.name,
    address: hospital.value.address
  });
};

// 获取医院详情
const fetchHospitalDetail = async (id: string): Promise<Hospital> => {
  const hospitalDetail  = await getHospitalDetail(id);
  if (!hospitalDetail ) {
    throw new Error(`Hospital with ID ${id} not found`);
  }
  departments.value = await getHospitalDepartments(id);

  hospital.value = hospitalDetail;
};

onMounted(async () => {
  // 获取页面参数
  const { id } = router.params;
  if (id) {
    await fetchHospitalDetail(id);
  }

  // 计算滚动区域高度
  const systemInfo = Taro.getSystemInfoSync();
  // 减去顶部区域和tabs高度
  scrollHeight.value = systemInfo.windowHeight - 300;
});
</script>

<style lang="scss">
.hospital-detail {
  min-height: 100vh;
  background: #f8f8f8;

  .basic-info {
    background: #fff;
    padding: 24px 16px;
    margin-bottom: 16px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .name-level {
        flex: 1;
        margin-right: 16px;

        .name {
          font-size: 32px;
          font-weight: 600;
          color: #333;
          display: block;
          margin-bottom: 8px;
        }

        .level {
          font-size: 24px;
          color: #2B87FF;
          padding: 4px 12px;
          background: rgba(43, 135, 255, 0.1);
          border-radius: 6px;
        }
      }

      .rating-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .rating-text {
          font-size: 24px;
          color: #666;
        }
      }
    }

    .tags {
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

    .address-info {
      .address {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 24px;
        color: #666;

        .icon {
          color: #999;
        }
      }

      .distance {
        font-size: 24px;
        color: #666;
        margin-left: 28px;
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    margin-bottom: 16px;
    gap: 16px;

    .action-btn {
      flex: 1;
      height: 80px;
      font-size: 28px;
      border-radius: 40px;

      :deep(.nut-button__warp) {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    }
  }

  .departments-list {
    padding: 16px;

    .department-item {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 12px;

      .dept-name {
        font-size: 28px;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
        display: block;
      }

      .dept-desc {
        font-size: 24px;
        color: #666;
      }
    }
  }

  .introduction {
    padding: 16px;

    .section {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 16px;

      .section-title {
        font-size: 28px;
        font-weight: 500;
        color: #333;
        margin-bottom: 12px;
        display: block;
      }

      .section-content {
        font-size: 24px;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}

// 暗黑模式支持
@media (prefers-color-scheme: dark) {
  .hospital-detail {
    background: #1a1a1a;

    .basic-info {
      background: #2a2a2a;

      .header {
        .name-level {
          .name {
            color: #fff;
          }
        }
      }

      .tags {
        .tag {
          background: #333;
          color: #999;
        }
      }

      .address-info {
        .address, .distance {
          color: #999;
        }
      }
    }

    .departments-list {
      .department-item {
        background: #2a2a2a;

        .dept-name {
          color: #fff;
        }

        .dept-desc {
          color: #999;
        }
      }
    }

    .introduction {
      .section {
        background: #2a2a2a;

        .section-title {
          color: #fff;
        }

        .section-content {
          color: #999;
        }
      }
    }
  }
}
</style>