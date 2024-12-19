// src/pages/index/index.vue
<template>
  <view class="index-container">

    <SearchBar @select="handleHospitalSelection"/>

    <!-- 功能区块网格 -->
    <view class="feature-grid">
      <view class="grid-item" @click="showHospitalList">
        <nut-icon name="location" size="24"/>
        <text>医院列表</text>
      </view>
      <view class="grid-item" @click="showFavorites">
        <nut-icon name="heart" size="24"/>
        <text>收藏夹</text>
      </view>
    </view>

    <!-- 医院列表弹出层 -->
    <nut-popup
        v-model:visible="showHospitalPopup"
        position="bottom"
        :style="{ height: '70%' }"
    >
      <nut-elevator
          :index-list="hospitalList"
          :height="500"
          @click-item="handleHospitalSelect"
          accept-key="testTitle"
      />
    </nut-popup>

    <!-- 收藏夹弹出层 -->
    <nut-popup
        v-model:visible="showFavoritePopup"
        position="bottom"
        :style="{ height: '70%' }"
    >
      <nut-elevator
          :index-list="favoriteList"
          :height="500"
          @click-item="handleHospitalSelect"
          accept-key="testTitle"
      />
    </nut-popup>

    <!-- 附近医院列表 -->
    <view class="nearby-hospitals">
      <view class="section-title">附近医院</view>
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
import {getFavoriteHospitals, getNearbyHospitals, searchHospitals} from '@/api/hospital';
import type {Hospital} from '@/api/types';
import HospitalCard from '@/components/hospital/HospitalCard.vue';
import SearchBar from '@/components/base/SearchBar.vue';

// 状态管理
const searchKeyword = ref('');
const loading = ref(false);
const hospitals = ref<Hospital[]>([]);
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
  padding: 16px;
  background-color: #F8F8F8;

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 20px 0;

    .grid-item {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      text {
        font-size: 14px;
        color: #333;
      }
    }
  }

  .nearby-hospitals {
    margin-top: 20px;

    .section-title {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      margin-bottom: 16px;
    }

    .hospital-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
}

// Popup样式调整
:deep(.nut-popup) {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  .nut-elevator {
    padding: 16px;
  }
}
</style>