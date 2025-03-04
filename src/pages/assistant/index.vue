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
              <text v-if="streamingMessage && message.id === 'streaming'" class="streaming-text">{{ streamingText }}</text>
            </view>

            <!-- 分析结果指示器 -->
            <view v-if="message.type === 'assistant' && message.analyzingSymptoms" class="analyzing-indicator">
              <nut-icon name="loading" size="16" color="#2B87FF"/>
              <text class="analyzing-text">正在分析您的症状，寻找最合适的医院...</text>
            </view>

            <!-- 医院推荐卡片 -->
            <view
                v-if="message.type === 'assistant' && message.recommendations?.length"
                class="recommendations"
            >
              <hospital-card
                  v-for="hospital in message.recommendations"
                  :key="hospital.id"
                  :hospital="hospital"
                  :is-favorite="isHospitalFavorite(hospital.id)"
                  :showDepartmentsPreview="true"
                  @click="handleHospitalSelect"
                  @favorite="handleFavoriteToggle"
              />
            </view>

            <!-- 流式推荐展示 -->
            <view
                v-if="message.id === 'streaming' && streamingRecommendations.length > 0"
                class="recommendations"
            >
              <hospital-card
                  v-for="hospital in streamingRecommendations"
                  :key="hospital.id"
                  :hospital="hospital"
                  :is-favorite="isHospitalFavorite(hospital.id)"
                  :showDepartmentsPreview="true"
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
            :disabled="sending"
            placeholder="请描述您的症状..."
        />
        <nut-button
            type="primary"
            class="send-btn"
            :loading="sending"
            :disabled="!inputContent.trim() || sending"
            @click="handleSend"
        >
          发送
        </nut-button>
      </view>
      <!-- 流式响应开关 -->
      <!--      <view class="streaming-option">-->
      <!--        <nut-switch v-model="useStreaming" size="small" />-->
      <!--        <text class="option-text">流式响应</text>-->
      <!--      </view>-->
    </view>
  </view>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick, computed} from 'vue';
import Taro from '@tarojs/taro';
import {Ask2, People} from '@nutui/icons-vue-taro';
import type {Hospital, Message} from '@/types/models';
import {getChatHistory, sendMessage, sendMessageStreaming} from '@/api/assistant';
import HospitalCard from '@/components/hospital/HospitalCard.vue';
import { useStore } from 'vuex';

// 获取Vuex store
const store = useStore();

// 判断用户是否已登录
const isAuthenticated = computed(() => {
  return store.state.auth?.isAuthenticated || false;
});

// 检查登录状态
const checkAuth = () => {
  if (!isAuthenticated.value) {
    // 用户未登录，跳转到登录页面
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });

    setTimeout(() => {
      Taro.navigateTo({
        url: '/pages/auth/login'
      });
    }, 1500);

    return false;
  }
  return true;
};

const messages = ref<Message[]>([]);
const inputContent = ref('');
const sending = ref(false);
const favoriteIds = ref<string[]>([]);

// 流式响应相关
const useStreaming = ref(false);
const streamingMessage = ref(false);
const streamingText = ref('');
const streamingRecommendations = ref<Hospital[]>([]);
const streamingMessageId = ref('streaming');

const isHospitalFavorite = (id: string) => favoriteIds.value.includes(id);

const handleFavoriteToggle = (hospital: Hospital) => {
  // 检查登录状态
  if (!checkAuth()) return;

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
  // 检查登录状态
  if (!checkAuth()) return;

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

// 提取症状关键词的简单实现
const extractSymptomKeywords = (content: string): string[] => {
  const commonSymptoms = [
    "头痛", "发热", "咳嗽", "胸痛", "腹痛", "恶心", "呕吐", "腹泻",
    "便秘", "胃痛", "头晕", "乏力", "关节痛", "肌肉痛", "皮疹",
    "瘙痒", "失眠", "焦虑", "抑郁", "心悸", "呼吸困难", "视力模糊"
  ];

  const found = [];
  for (const symptom of commonSymptoms) {
    if (content.includes(symptom)) {
      found.push(symptom);
    }
  }
  return found;
};

// 发送消息
const handleSend = async () => {
  // 检查登录状态
  if (!checkAuth()) return;

  if (!inputContent.value.trim() || sending.value) return;

  const content = inputContent.value;
  inputContent.value = '';
  sending.value = true;

  try {
    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: Date.now()
    };
    messages.value.push(userMessage);
    scrollToLatest();

    // 创建一个正在分析的临时助手消息
    const analysisMessage: Message = {
      id: 'analyzing',
      type: 'assistant',
      content: '我正在分析您的症状，寻找最合适的医院...',
      timestamp: Date.now(),
      analyzingSymptoms: true
    };

    messages.value.push(analysisMessage);
    scrollToLatest();

    if (useStreaming.value) {
      // 使用流式响应
      await handleStreamingResponse(content);
    } else {
      // 使用普通响应
      const response = await sendMessage(content);

      // 替换分析中的消息
      const analyzeIndex = messages.value.findIndex(m => m.id === 'analyzing');
      if (analyzeIndex !== -1) {
        messages.value.splice(analyzeIndex, 1);
      }

      // 为症状添加强调
      const symptomsKeywords = extractSymptomKeywords(content);
      if (symptomsKeywords.length > 0 && !response.content.includes('症状（')) {
        const keywordsStr = symptomsKeywords.join('、');
        response.content = response.content.replace('症状', `症状（${keywordsStr}）`);
      }

      messages.value.push(response);
      scrollToLatest();
    }
  } catch (error) {
    console.error('发送失败:', error);
    Taro.showToast({
      title: '发送失败',
      icon: 'error'
    });

    // 移除分析中的消息
    messages.value = messages.value.filter(m => m.id !== 'analyzing');
  } finally {
    sending.value = false;
  }
};

// 处理流式响应
const handleStreamingResponse = async (content: string) => {
  // 移除分析中的消息
  messages.value = messages.value.filter(m => m.id !== 'analyzing');

  // 重置流式响应状态
  streamingMessage.value = true;
  streamingText.value = '';
  streamingRecommendations.value = [];

  // 创建一个临时的流式消息
  const tempMessage: Message = {
    id: 'streaming',
    type: 'assistant',
    content: '',
    timestamp: Date.now()
  };
  messages.value.push(tempMessage);
  scrollToLatest();

  try {
    await sendMessageStreaming(content, {
      onStart: (messageId) => {
        streamingMessageId.value = messageId;
      },
      onText: (chunk) => {
        streamingText.value += chunk;
        scrollToLatest();
      },
      onRecommendation: (hospital) => {
        streamingRecommendations.value.push(hospital);
        scrollToLatest();
      },
      onEnd: (messageId, timestamp) => {
        // 为症状添加强调
        const symptomsKeywords = extractSymptomKeywords(content);
        let finalContent = streamingText.value;

        if (symptomsKeywords.length > 0 && !finalContent.includes('症状（')) {
          const keywordsStr = symptomsKeywords.join('、');
          finalContent = finalContent.replace('症状', `症状（${keywordsStr}）`);
        }

        // 创建完整的消息并替换临时消息
        const finalMessage: Message = {
          id: messageId,
          type: 'assistant',
          content: finalContent,
          recommendations: [...streamingRecommendations.value],
          timestamp: timestamp
        };

        // 找到临时消息并替换
        const index = messages.value.findIndex(m => m.id === 'streaming');
        if (index !== -1) {
          messages.value.splice(index, 1, finalMessage);
        }

        // 重置流式状态
        streamingMessage.value = false;
        streamingText.value = '';
        streamingRecommendations.value = [];
      },
      onError: (error) => {
        console.error('流式响应失败:', error);
        Taro.showToast({
          title: '响应失败',
          icon: 'error'
        });

        // 移除临时消息
        messages.value = messages.value.filter(m => m.id !== 'streaming');

        // 重置流式状态
        streamingMessage.value = false;
        streamingText.value = '';
        streamingRecommendations.value = [];
      }
    });
  } catch (error) {
    console.error('流式响应处理失败:', error);
    // 移除临时消息
    messages.value = messages.value.filter(m => m.id !== 'streaming');

    // 重置流式状态
    streamingMessage.value = false;
    streamingText.value = '';
    streamingRecommendations.value = [];
  }
};

// 初始化数据
const initData = async () => {
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
    console.error('获取记录失败:', error);
    Taro.showToast({
      title: '获取记录失败',
      icon: 'error'
    });

    // 出错时也显示默认的欢迎消息
    messages.value = [{
      id: '1',
      type: 'assistant',
      content: '您好！我是您的智能医疗助手。请详细描述您的症状，我将为您推荐最合适的医院。\n\n例如：\n最近胃部不适，经常感觉胃痛和反酸，想找一家专业的消化科医院。',
      timestamp: Date.now()
    }];
  }
};

const onShow = () => {
  // 当页面显示时（包括从其他页面返回时），检查登录状态并重新加载数据
  if (isAuthenticated.value) {
    initData();
  }
};

Taro.useDidShow(() => {
  onShow();
});
// 页面加载时初始化
onMounted(async () => {
  // 设置页面标题
  Taro.setNavigationBarTitle({
    title: '智能医疗助手'
  });

  // 检查登录状态并根据状态执行初始化
  if (checkAuth()) {
    await initData();
  }
});

// 添加下拉刷新支持
const onPullDownRefresh = async () => {
  // 检查登录状态
  if (!checkAuth()) {
    Taro.stopPullDownRefresh();
    return;
  }

  try {
    const history = await getChatHistory();
    messages.value = history;
    Taro.stopPullDownRefresh();
  } catch (error) {
    console.error('刷新历史记录失败:', error);
    Taro.showToast({
      title: '刷新失败',
      icon: 'error'
    });
    Taro.stopPullDownRefresh();
  }
};

// 定义页面配置
definePageConfig({
  navigationBarTitleText: '智能医疗助手',
  enablePullDownRefresh: true
});
</script>

<style lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f8fa;

  /* 添加iOS安全区域适配 */
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
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

          .streaming-text {
            border-right: 2px solid #2B87FF;
            animation: cursor-blink 0.7s infinite;
          }
        }

        .analyzing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          margin-top: 12px;
          background: rgba(43, 135, 255, 0.05);
          border-radius: 12px;

          .analyzing-text {
            font-size: 24px;
            color: #666;
          }
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
    width: 190px;
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

  .streaming-option {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 12px;

    .option-text {
      margin-left: 8px;
      font-size: 24px;
      color: #666;
    }
  }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .page-container {
    background: #1a1a1a;
  }

  .chat-area {
    .message-list {
      .message-item {
        .avatar {
          &.assistant {
            background: rgba(43, 135, 255, 0.3);
          }

          &.user {
            background: #333;

            .icon {
              color: #ccc;
            }
          }
        }

        .content-wrap {
          .bubble {
            background: #2a2a2a;
            color: #f0f0f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }

          .analyzing-indicator {
            background: rgba(43, 135, 255, 0.1);

            .analyzing-text {
              color: #aaa;
            }
          }
        }

        &.user {
          .bubble {
            background: #2B87FF;
            color: #fff;
          }
        }
      }
    }
  }

  .input-area {
    background: #2a2a2a;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);

    .input-box {
      background: #333;

      :deep(.nut-input) {
        color: #f0f0f0;
      }
    }

    .streaming-option {
      .option-text {
        color: #aaa;
      }
    }
  }
}
</style>