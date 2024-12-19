// src/pages/index/index.vue
<template>
  <view class="index-container">
    <!-- Search Component -->
    <SearchBar @select="handleHospitalSelection" />

    <!-- Feature Grid -->

    <nut-grid class="feature-grid" :column-num="2">
      <nut-grid-item
          text="医院列表"
          @click="showHospitalList"
          class="hospital-list-item"
      >
        <Category class="grid-icon" />
      </nut-grid-item>

      <nut-grid-item
          text="我的收藏"
          @click="showFavorites"
          class="favorites-item"
      >
        <Heart class="grid-icon" />
      </nut-grid-item>
    </nut-grid>

    <!-- Hospital List Popup -->
    <nut-popup
        v-model:visible="showHospitalPopup"
        position="bottom"
        :style="{ height: '70%' }"
        class="custom-popup"
    >
      <view class="popup-header">
        <text class="popup-title">医院列表</text>
        <nut-icon name="close" size="20" @click="showHospitalPopup = false" />
      </view>
      <nut-elevator
          :index-list="hospitalList"
          :height="500"
          @click-item="handleHospitalSelect"
          accept-key="testTitle"
          class="custom-elevator"
      />
    </nut-popup>

    <!-- Favorites Popup -->
    <nut-popup
        v-model:visible="showFavoritePopup"
        position="bottom"
        :style="{ height: '70%' }"
        class="custom-popup"
    >
      <view class="popup-header">
        <text class="popup-title">我的收藏</text>
        <nut-icon name="close" size="20" @click="showFavoritePopup = false" />
      </view>
      <nut-elevator
          :index-list="favoriteList"
          :height="500"
          @click-item="handleHospitalSelect"
          accept-key="testTitle"
          class="custom-elevator"
      />
    </nut-popup>

    <!-- Nearby Hospitals -->
    <view class="nearby-hospitals">
      <view class="section-header">
        <text class="section-title">附近医院</text>
        <nut-icon name="location" size="20" color="#2B87FF" />
      </view>
      <view class="hospital-list">
        <hospital-card
            v-for="hospital in nearbyHospitals"
            :key="hospital.id"
            :hospital="hospital"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {getFavoriteHospitals, getNearbyHospitals} from '@/api/hospital';
import type {Hospital} from '@/api/types';
import HospitalCard from '@/components/hospital/HospitalCard.vue';
import SearchBar from '@/components/base/SearchBar.vue';
import { Category, Heart } from '@nutui/icons-vue-taro';
import Taro from "@tarojs/taro";

// 状态管理
const showHospitalPopup = ref(false);
const showFavoritePopup = ref(false);
const nearbyHospitals = ref<Hospital[]>([]);
const hospitalList = ref([
  {
    testTitle: '全部医院',
    list: []  // Initialize with empty list
  }
]);

const favoriteList = ref([
  {
    testTitle: '收藏的医院',
    list: []  // Initialize with empty list
  }
]);
const handleHospitalSelection = (hospital: Hospital) => {
  // Handle the selected hospital, e.g., navigate to detail page
  console.log('Selected hospital:', hospital);
};
// 获取附近医院
const fetchNearbyHospitals = async () => {
  nearbyHospitals.value = await getNearbyHospitals({});
};

const prepareHospitalList = async () => {
  const hospitals = await getNearbyHospitals({});
  hospitalList.value[0].list = hospitals.map(h => ({
    name: h.name,
    id: h.id,
    level: h.level
  }));
};

const prepareFavoriteList = async () => {
  const favorites = await getFavoriteHospitals();
  favoriteList.value[0].list = favorites.map(h => ({
    name: h.name,
    id: h.id,
    level: h.level
  }));
};

const showHospitalList = () => {
  showHospitalPopup.value = true;
};

const showFavorites = () => {
  showFavoritePopup.value = true;
};

const handleHospitalSelect = (key: string, item: any) => {
  console.log('Selected hospital:', item);
  showHospitalPopup.value = false;
  showFavoritePopup.value = false;
};

// 初始化
onMounted(() => {
  fetchNearbyHospitals();
  prepareHospitalList();
  prepareFavoriteList();
});

</script>

<style lang="scss">
.index-container {
  padding: 20px 16px;
  background-color: #F8F8F8;
  min-height: 100vh;

  .feature-grid {
    margin: 28px 0;
    padding: 4px;

    :deep(.nut-grid) {
      padding: 12px;
      background: transparent;
    }

    :deep(.nut-grid-item) {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      margin: 8px;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(43, 135, 255, 0.08);
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #2B87FF;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:active {
        transform: scale(0.98);
        background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);

        &::before {
          opacity: 1;
        }
      }

      .nut-grid-item__content {
        padding: 28px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      .grid-icon {
        font-size: 36px;
        color: #2B87FF;
        background: rgba(43, 135, 255, 0.1);
        padding: 12px;
        border-radius: 12px;
        transition: all 0.3s ease;
      }

      .nut-grid-item__text {
        font-size: 28px;
        color: #333;
        font-weight: 500;
        margin-top: 8px;
      }

      &.hospital-list-item {
        background: linear-gradient(135deg, #ffffff 0%, #e8f4ff 100%);

        .grid-icon {
          background: rgba(43, 135, 255, 0.15);
        }
      }

      &.favorites-item {
        background: linear-gradient(135deg, #ffffff 0%, #fff1f0 100%);

        .grid-icon {
          color: #ff4d4f;
          background: rgba(255, 77, 79, 0.15);
        }
      }
    }
  }

  .nearby-hospitals {
    margin-top: 24px;

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;

      .section-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }
    }

    .hospital-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}

.custom-popup {
  :deep(.nut-popup) {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      .popup-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }

    .custom-elevator {
      padding: 16px;

      :deep(.nut-elevator__list) {
        .nut-elevator__list__item {
          font-size: 16px;
          padding: 12px 16px;
        }
      }

      :deep(.nut-elevator__index) {
        .nut-elevator__index__item {
          font-size: 14px;
          color: #2B87FF;
        }
      }
    }
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .index-container {
    background-color: #1a1a1a;

    .feature-grid .grid-item {
      background: #2a2a2a;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      .grid-text {
        color: #fff;
      }
    }

    .nearby-hospitals {
      .section-header .section-title {
        color: #fff;
      }
    }
  }

  .custom-popup {
    :deep(.nut-popup) {
      background: #2a2a2a;

      .popup-header {
        border-bottom-color: #333;

        .popup-title {
          color: #fff;
        }
      }
    }
  }
}
</style>