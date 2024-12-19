// src/components/base/SearchBar.vue
<template>
  <view class="search-wrapper">
    <nut-searchbar
        v-model="localKeyword"
        class="custom-searchbar"
        placeholder="搜索医院名称"
        :clearable="true"
        @change="handleSearch"
        @clear="handleClear"
    >
      <template #rightin>
        <Search2 class="search-icon"/>
      </template>
    </nut-searchbar>

    <!-- Enhanced Search Results Popup -->
    <view class="search-results-popup" v-if="localKeyword && (loading || hospitals.length > 0 || showNoResults)">
      <view class="search-results-content">
        <view v-if="loading" class="loading-state">
          <nut-icon name="loading" size="24" color="#2B87FF"/>
          <text>正在搜索...</text>
        </view>

        <view v-else-if="hospitals.length > 0" class="results-list">
          <view
              v-for="hospital in hospitals"
              :key="hospital.id"
              class="hospital-result-item"
              @click="handleSelectHospital(hospital)"
          >
            <view class="hospital-main-info">
              <text class="hospital-name">{{ hospital.name }}</text>
              <text class="hospital-level">{{ hospital.level }}</text>
            </view>
            <view class="hospital-sub-info">
              <view class="rating-container" v-if="hospital.rating">
                <nut-rate
                    v-model="hospital.rating"
                    :size="12"
                    readonly
                />
                <text class="rating-text">{{ hospital.rating }}分</text>
              </view>
              <text class="distance-text" v-if="hospital.distance">
                {{ hospital.distance }}km
              </text>
            </view>
          </view>
        </view>

        <view v-else-if="showNoResults" class="no-results">
          <nut-empty description="未找到相关医院"/>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {Search2} from '@nutui/icons-vue-taro';
import {searchHospitals} from '@/api/hospital';
import type {Hospital} from '@/api/types';
import Taro from '@tarojs/taro';

const emit = defineEmits(['select']);

const localKeyword = ref('');
const hospitals = ref<Hospital[]>([]);
const loading = ref(false);
const showNoResults = ref(false);

const handleSearch = async () => {
  if (!localKeyword.value.trim()) {
    hospitals.value = [];
    showNoResults.value = false;
    return;
  }

  loading.value = true;
  showNoResults.value = false;

  try {
    const results = await searchHospitals({
      keyword: localKeyword.value,
      page: 1,
      size: 10
    });

    hospitals.value = results;
    showNoResults.value = results.length === 0;

  } catch (error) {
    console.error('搜索失败:', error);
    Taro.showToast({
      title: '搜索失败，请重试',
      icon: 'error',
      duration: 2000
    });
    hospitals.value = [];
  } finally {
    loading.value = false;
  }
};

const handleClear = () => {
  localKeyword.value = '';
  hospitals.value = [];
  showNoResults.value = false;
};

const handleSelectHospital = (hospital: Hospital) => {
  emit('select', hospital);
  localKeyword.value = '';
  hospitals.value = [];
  showNoResults.value = false;
};
</script>

<style lang="scss">
.search-wrapper {
  position: relative;
  z-index: 100;

  .custom-searchbar {
    :deep(.nut-searchbar) {
      background-color: #fff;
      border-radius: 12px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      .nut-searchbar__input {
        font-size: 16px;
        height: 40px;
      }

      .search-icon {
        color: #2B87FF;
        font-size: 20px;
      }
    }
  }

  .search-results-popup {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    max-height: 400px;
    overflow-y: auto;

    .search-results-content {
      padding: 12px;

      .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 24px 0;
        color: #666;
      }

      .results-list {
        .hospital-result-item {
          padding: 16px;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background-color: #f8f8f8;
          }

          .hospital-main-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .hospital-name {
              font-size: 16px;
              color: #333;
              font-weight: 500;
            }

            .hospital-level {
              font-size: 12px;
              color: #2B87FF;
              padding: 4px 8px;
              background: rgba(43, 135, 255, 0.1);
              border-radius: 4px;
            }
          }

          .hospital-sub-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #666;

            .rating-container {
              display: flex;
              align-items: center;
              gap: 4px;

              .rating-text {
                margin-left: 4px;
              }
            }
          }
        }
      }

      .no-results {
        padding: 32px 0;
      }
    }
  }
}
</style>