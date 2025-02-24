<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-section">
        <image class="avatar" :src="currentUser?.avatar_url || defaultAvatar" mode="aspectFill"/>
        <text class="nickname">{{ currentUser?.nickname || '未登录' }}</text>
      </view>

<!--      <nut-cell-group class="info-group">-->
<!--        <nut-cell title="手机号码" :desc="currentUser?.phone || '未绑定'" @click="handleBindPhone">-->
<!--          <template #icon>-->
<!--            <Message class="cell-icon" />-->
<!--          </template>-->
<!--        </nut-cell>-->
<!--      </nut-cell-group>-->
    </view>

    <!-- 功能列表 -->
    <nut-cell-group class="feature-group" title="我的服务">
      <nut-cell title="我的收藏" is-link @click="navigateTo('/pages/hospital/favorites')">
        <template #icon>
          <Star class="cell-icon favorite" />
        </template>
      </nut-cell>

      <nut-cell title="就医记录" is-link @click="navigateTo('/pages/hospital/history')">
        <template #icon>
          <Date class="cell-icon history" />
        </template>
      </nut-cell>

      <nut-cell title="我的评价" is-link @click="navigateTo('/pages/hospital/ratings')">
        <template #icon>
          <Comment class="cell-icon rating" />
        </template>
      </nut-cell>
    </nut-cell-group>

    <!-- 系统设置 -->
<!--    <nut-cell-group class="feature-group" title="设置">-->
<!--      <nut-cell title="关于我们" is-link @click="navigateTo('/pages/about/index')">-->
<!--        <template #icon>-->
<!--          <Service class="cell-icon" />-->
<!--        </template>-->
<!--      </nut-cell>-->
<!--    </nut-cell-group>-->

    <!-- 登录/退出按钮 -->
    <view class="action-area">
      <nut-button
          type="primary"
          class="action-button"
          @click="handleLoginAction"
      >
        {{ isAuthenticated ? '退出登录' : '立即登录' }}
      </nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import { useStore } from 'vuex';
import { Star, Message, Date, Comment, Service } from '@nutui/icons-vue-taro';
import defaultAvatar from '@/assets/img/avatar.png';

// 使用 Vuex store
const store = useStore();

// 计算属性：获取当前用户
const currentUser = computed(() => store.state.auth.user);
// 计算属性：是否已认证
const isAuthenticated = computed(() => store.state.auth.isAuthenticated);

// 页面加载时尝试获取最新用户信息
onMounted(async () => {
  // 如果有token但没有用户信息，尝试加载
  if (store.state.auth.token && !currentUser.value) {
    await store.dispatch('auth/loadUser');
  }
});

// 页面导航
const navigateTo = (url: string) => {
  // 判断是否登录，需要登录的功能页面跳转前检查
  if (!isAuthenticated.value &&
      (url.includes('/favorites') || url.includes('/history') || url.includes('/ratings'))) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none'
    });

    // 可以选择直接跳转到登录页
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/auth/login' });
    }, 1500);
    return;
  }

  Taro.navigateTo({ url });
};

// 处理手机绑定
const handleBindPhone = () => {
  if (!isAuthenticated.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  // 实现手机绑定逻辑
};

// 处理登录/退出
const handleLoginAction = () => {
  if (isAuthenticated.value) {
    // 退出登录
    store.dispatch('auth/logout');

    Taro.showToast({
      title: '已退出登录',
      icon: 'success'
    });
  } else {
    // 跳转到登录页面
    Taro.navigateTo({
      url: '/pages/auth/login'
    });
  }
};
</script>

<style lang="scss">
.profile-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 48px;

  .user-card {
    margin-bottom: 24px;
    background: #fff;

    .avatar-section {
      padding: 48px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-bottom: 1px solid #f5f5f5;

      .avatar {
        width: 160px;
        height: 160px;
        border-radius: 80px;
        margin-bottom: 24px;
        background: #f5f5f5;
      }

      .nickname {
        font-size: 32px;
        color: #333;
        font-weight: 500;
      }
    }

    .info-group {
      .cell-icon {
        font-size: 40px;
        color: #2B87FF;
      }
    }
  }

  .feature-group {
    margin-bottom: 24px;

    :deep(.nut-cell-group__title) {
      padding: 24px 32px 16px;
      font-size: 28px;
      color: #666;
    }

    .cell-icon {
      font-size: 40px;
      margin-right: 16px;

      &.favorite {
        color: #ff4d4f;
      }

      &.history {
        color: #2B87FF;
      }

      &.rating {
        color: #faad14;
      }
    }
  }

  .action-area {
    padding: 32px;

    .action-button {
      width: 100%;
      height: 88px;
      border-radius: 44px;
      font-size: 32px;
    }
  }
}

:deep(.nut-cell) {
  padding: 24px 32px;

  .nut-cell__title {
    font-size: 28px;
  }

  .nut-cell__desc {
    font-size: 26px;
  }
}
</style>