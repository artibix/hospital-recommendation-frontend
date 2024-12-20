// src/pages/hospital/list.vue
<template>
  <view class="hospital-list-page">
    <!-- 顶部搜索栏 -->
    <SearchBar class="search-bar" @select="handleHospitalSelect" />

    <!-- 分类标签页 -->
    <nut-tabs v-model="activeTab" title-scroll sticky>
      <nut-tab-pane
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
      >
        <scroll-view
            scroll-y
            class="hospital-list"
            :style="{ height: scrollHeight + 'px' }"
        >
          <hospital-card
              v-for="hospital in category.hospitals"
              :key="hospital.id"
              :hospital="hospital"
              :is-favorite="isHospitalFavorite(hospital.id)"
              @click="handleHospitalSelect(hospital)"
              @favorite="handleFavoriteToggle"
              @navigate="handleNavigate"
          />
        </scroll-view>
      </nut-tab-pane>
    </nut-tabs>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import { getHospitalCategories } from '@/api/hospital';
import type { Hospital, HospitalCategory } from '@/api/types';
import SearchBar from '@/components/base/SearchBar.vue';
import HospitalCard from '@/components/hospital/HospitalCard.vue';

const activeTab = ref(0);
const categories = ref<HospitalCategory[]>([]);
const scrollHeight = ref(0);

// 模拟收藏状态
const favoriteIds = ref<string[]>(['1', '3']); // 示例：ID为1和3的医院被收藏

const isHospitalFavorite = (hospitalId: string) => {
  return favoriteIds.value.includes(hospitalId);
};

const handleHospitalSelect = (hospital: Hospital) => {
  console.log('选中医院:', hospital);
  // 这里处理医院选择事件，比如跳转到医院详情页
};

const handleFavoriteToggle = (hospital: Hospital) => {
  const index = favoriteIds.value.indexOf(hospital.id);
  if (index > -1) {
    favoriteIds.value.splice(index, 1);
  } else {
    favoriteIds.value.push(hospital.id);
  }
};

const handleNavigate = (hospital: Hospital) => {
  console.log('导航至医院:', hospital);
  // 这里处理导航事件
};

const initData = async () => {
  try {
    categories.value = await getHospitalCategories();
  } catch (error) {
    console.error('获取医院分类失败:', error);
    Taro.showToast({
      title: '获取数据失败',
      icon: 'error',
      duration: 2000
    });
  }
};

onMounted(() => {
  // 获取可用高度
  const systemInfo = Taro.getSystemInfoSync();
  // 减去顶部搜索栏高度和tabs高度
  scrollHeight.value = systemInfo.windowHeight - 120;

  initData();
});
</script>

<style lang="scss">
.hospital-list-page {
  min-height: 100vh;
  background: #f8f8f8;

  .search-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 16px;
    background: #f8f8f8;
  }

  :deep(.nut-tabs) {
    .nut-tabs__titles {
      background: #fff;
      padding: 4px 0;

      .nut-tabs__title {
        font-size: 28px;
        padding: 20px 32px;
        color: #666;

        &.active {
          color: #2B87FF;
          font-weight: 500;
        }
      }
    }

    .nut-tabs__content {
      background: #f8f8f8;

      .hospital-list {
        padding: 16px;
      }
    }
  }
}

// 暗黑模式支持
@media (prefers-color-scheme: dark) {
  .hospital-list-page {
    background: #1a1a1a;

    .search-bar {
      background: #1a1a1a;
    }

    :deep(.nut-tabs) {
      .nut-tabs__titles {
        background: #2a2a2a;

        .nut-tabs__title {
          color: #999;

          &.active {
            color: #2B87FF;
          }
        }
      }

      .nut-tabs__content {
        background: #1a1a1a;
      }
    }
  }
}
</style>