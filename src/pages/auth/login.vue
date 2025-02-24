// pages/auth/login.vue
<template>
  <view class="login-page">
    <view class="welcome">
      <text class="title">欢迎使用</text>
      <text class="subtitle">智能医院导航</text>
    </view>

    <view class="login-area">
      <!-- 微信登录按钮 -->
      <nut-button
          type="primary"
          block
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
      >
        <template #icon>
          <image class="wechat-icon" src="/assets/img/wechat.png" mode="aspectFit" />
        </template>
        微信一键登录
      </nut-button>

      <!-- 用户协议 -->
      <view class="agreement">
        <nut-checkbox v-model="isAgreed" class="agreement-checkbox">
          我已阅读并同意
        </nut-checkbox>
        <text class="link" @click="showAgreement">《用户协议》</text>
        <text>和</text>
        <text class="link" @click="showPrivacy">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import {wxLogin} from "@/api/auth";

const store = useStore()
const loading = ref(false)
const isAgreed = ref(false)

// 处理登录
const handleLogin = async () => {
  if (!isAgreed.value) {
    await Taro.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    })
    return
  }

  loading.value = true
  try {
    // 获取用户信息
    const userInfoRes = await Taro.getUserProfile({
      desc: '用于完善用户资料'
    })
    console.log('获取到的用户信息:', userInfoRes)

    // 获取登录凭证
    const loginRes = await Taro.login()
    console.log('获取到的登录凭证:', loginRes)

    if (!loginRes.code) {
      throw new Error('获取登录凭证失败')
    }

    // 调用登录接口
    const result = await wxLogin(loginRes.code, userInfoRes.userInfo)
    console.log('登录接口返回:', result)

    // 存储token和用户信息
    store.commit('auth/SET_TOKEN', result.token)
    store.commit('auth/SET_USER', result.user)

    // 登录成功提示
    Taro.showToast({
      title: '登录成功',
      icon: 'success'
    })

    // 延迟跳转
    setTimeout(() => {
      const pages = Taro.getCurrentPages()
      if (pages.length > 1) {
        Taro.navigateBack()
      } else {
        Taro.switchTab({
          url: '/pages/index/index'
        })
      }
    }, 1500)

  } catch (error) {
    console.error('登录失败:', error)
    Taro.showToast({
      title: error.message || '登录失败',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
// 查看用户协议
const showAgreement = () => {
  Taro.navigateTo({
    url: '/pages/agreement/index'
  })
}

// 查看隐私政策
const showPrivacy = () => {
  Taro.navigateTo({
    url: '/pages/privacy/index'
  })
}
</script>

<style lang="scss">
.login-page {
  min-height: 100vh;
  padding: 48px 32px;
  background: #fff;

  .welcome {
    margin-top: 120px;
    margin-bottom: 120px;
    text-align: center;

    .title {
      font-size: 48px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
      display: block;
    }

    .subtitle {
      font-size: 32px;
      color: #666;
    }
  }

  .login-area {
    .login-btn {
      height: 88px;
      border-radius: 44px;
      font-size: 32px;
      background: #07c160;  // 微信绿色
      display: flex;
      align-items: center;
      justify-content: center;

      .wechat-icon {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }
    }

    .agreement {
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #666;

      .agreement-checkbox {
        transform: scale(0.8);
      }

      .link {
        color: #2B87FF;
        display: inline;
        margin: 0 4px;
      }
    }
  }
}

// 暗黑模式支持
@media (prefers-color-scheme: dark) {
  .login-page {
    background: #1a1a1a;

    .welcome {
      .title {
        color: #fff;
      }
      .subtitle {
        color: #999;
      }
    }

    .login-area {
      .agreement {
        color: #999;
      }
    }
  }
}
</style>