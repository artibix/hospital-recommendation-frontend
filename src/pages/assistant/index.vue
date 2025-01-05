//src/pages/assistant/index.vue
<template>
  <view class="page-container">
    <scroll-view
        :scroll-y="true"
        class="chat-area"
        :scroll-with-animation="true"
        :scroll-anchoring="true"
        @scrolltoupper="loadMoreHistory"
    >
      <view id="message-list" class="message-list">
        <view
            v-for="message in messages"
            :key="message.id"
            :id="'msg-' + message.id"
            class="message-item"
            :class="message.type"
        >
          <view class="avatar" :class="message.type">
            <Ask2 v-if="message.type === 'assistant'" class="icon"/>
            <People v-else class="icon"/>
          </view>

          <view class="content-wrap">
            <view class="bubble">
              <text>{{ message.content }}</text>
            </view>

            <view
                v-if="message.type === 'assistant' && message.recommendations?.length"
                class="recommendations"
            >
              <hospital-card
                  v-for="hospital in message.recommendations"
                  :key="hospital.id"
                  :hospital="hospital"
                  :is-favorite="isHospitalFavorite(hospital.id)"
                  @click="handleHospitalSelect"
                  @favorite="handleFavoriteToggle"
              />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="input-area">
      <view class="input-container">
        <nut-input
            v-model="inputContent"
            class="input-box"
            :border="false"
            placeholder="请描述您的症状..."
        />
        <nut-button
            type="primary"
            class="send-btn"
            :loading="sending"
            :disabled="!inputContent.trim()"
            @click="handleSend"
        >
          发送
        </nut-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue';
import Taro from '@tarojs/taro';
import {Ask2, People} from '@nutui/icons-vue-taro';
import type {Hospital, Message} from '@/types/models';
import {getChatHistory, sendMessage} from '@/api/assistant';
import HospitalCard from '@/components/hospital/HospitalCard.vue';

const messages = ref<Message[]>([]);
const inputContent = ref('');
const sending = ref(false);
const favoriteIds = ref<string[]>([]);

const isHospitalFavorite = (id: string) => favoriteIds.value.includes(id);

const handleFavoriteToggle = (hospital: Hospital) => {
  const index = favoriteIds.value.indexOf(hospital.id);
  if (index > -1) {
    favoriteIds.value.splice(index, 1);
  } else {
    favoriteIds.value.push(hospital.id);
  }
};

// 医院卡片点击处理
const handleHospitalSelect = (hospital: Hospital) => {
  Taro.navigateTo({
    url: `/pages/hospital/detail?id=${hospital.id}`
  });
};

const loadMoreHistory = async () => {
  console.log('加载更多历史消息');
};

const scrollToLatest = () => {
  nextTick(() => {
    const lastMessageId = messages.value[messages.value.length - 1]?.id;
    if (lastMessageId) {
      Taro.createSelectorQuery()
          .select(`#msg-${lastMessageId}`)
          .boundingClientRect()
          .exec((res) => {
            if (res[0]) {
              Taro.pageScrollTo({
                selector: `#msg-${lastMessageId}`,
                duration: 300
              });
            }
          });
    }
  });
};

// 发送消息
const handleSend = async () => {
  if (!inputContent.value.trim() || sending.value) return;

  const content = inputContent.value;
  inputContent.value = '';
  sending.value = true;

  try {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: Date.now()
    };
    messages.value.push(userMessage);
    scrollToLatest();

    const response = await sendMessage(content);
    messages.value.push(response);
    scrollToLatest();
  } catch (error) {
    console.error('发送失败:', error);
    Taro.showToast({
      title: '发送失败',
      icon: 'error'
    });
  } finally {
    sending.value = false;
  }
};

// 页面加载时初始化
onMounted(async () => {
  try {
    const history = await getChatHistory();
    if (history.length === 0) {
      messages.value = [{
        id: '1',
        type: 'assistant',
        content: '您好！我是您的智能医疗助手。请详细描述您的症状，我将为您推荐最合适的医院。\n\n例如：\n最近胃部不适，经常感觉胃痛和反酸，想找一家专业的消化科医院。',
        timestamp: Date.now()
      }];
    } else {
      messages.value = history;
    }
  } catch (error) {
    console.error('获取历史记录失败:', error);
    Taro.showToast({
      title: '获取历史记录失败',
      icon: 'error'
    });
  }
});
</script>

<style lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f8fa;
}

.chat-area {
  flex: 1;
  padding-bottom: 100px; // 为底部输入框留出空间
  scroll-behavior: smooth;

  .message-list {
    .message-item {
      display: flex;
      gap: 24px;
      margin-bottom: 40px;

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        &.assistant {
          background: #e8f3ff;

          .icon {
            color: #2B87FF;
          }
        }

        &.user {
          background: #f0f2f5;

          .icon {
            color: #666;
          }
        }

        .icon {
          font-size: 40px;
        }
      }

      .content-wrap {
        max-width: 580px;

        .bubble {
          padding: 24px;
          border-radius: 24px;
          font-size: 28px;
          line-height: 1.6;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .recommendations {
          margin-top: 24px;
        }
      }

      &.user {
        flex-direction: row-reverse;

        .bubble {
          background: #2B87FF;
          color: #fff;
        }
      }
    }
  }
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 24px 32px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);

  .input-container {
    display: flex;
    gap: 24px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .input-box {
    flex: 1;
    background: #f5f5f5;
    border-radius: 16px;
    overflow: hidden;

    :deep(.nut-input) {
      padding: 20px 24px;
      font-size: 28px;
      background: transparent;
    }
  }

  .send-btn {
    width: 180px;
    height: 80px;
    border-radius: 16px;
    font-size: 28px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(43, 135, 255, 0.2);
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.98);
    }

    &[disabled] {
      opacity: 0.6;
      box-shadow: none;
    }
  }
}
</style>