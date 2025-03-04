// src/components/hospital/RatingForm.vue
<template>
  <view class="rating-form">
    <nut-form :model-value="formData" ref="formRef">
      <!-- 医疗质量评分 -->
      <nut-form-item label="医疗质量" required>
        <view class="rating-item">
          <nut-rate v-model="formData.medical_quality" :size="28" />
          <text class="rating-value">{{ formData.medical_quality }}分</text>
        </view>
        <view class="rating-desc">医护人员的专业水平和治疗效果</view>
      </nut-form-item>

      <!-- 服务态度评分 -->
      <nut-form-item label="服务态度" required>
        <view class="rating-item">
          <nut-rate v-model="formData.service" :size="28" />
          <text class="rating-value">{{ formData.service }}分</text>
        </view>
        <view class="rating-desc">医护人员的服务态度和沟通质量</view>
      </nut-form-item>

      <!-- 就医环境评分 -->
      <nut-form-item label="环境设施" required>
        <view class="rating-item">
          <nut-rate v-model="formData.environment" :size="28" />
          <text class="rating-value">{{ formData.environment }}分</text>
        </view>
        <view class="rating-desc">医院环境、设施和卫生状况</view>
      </nut-form-item>

      <!-- 就诊效率评分 -->
      <nut-form-item label="就诊效率" required>
        <view class="rating-item">
          <nut-rate v-model="formData.efficiency" :size="28" />
          <text class="rating-value">{{ formData.efficiency }}分</text>
        </view>
        <view class="rating-desc">挂号、等待和就诊的时间效率</view>
      </nut-form-item>

      <!-- 设备先进度评分 -->
      <nut-form-item label="设备先进度" required>
        <view class="rating-item">
          <nut-rate v-model="formData.equipment" :size="28" />
          <text class="rating-value">{{ formData.equipment }}分</text>
        </view>
        <view class="rating-desc">医疗设备的先进程度和完善程度</view>
      </nut-form-item>

      <!-- 评价内容 -->
      <nut-form-item label="评价内容">
        <nut-textarea
            v-model="formData.comment"
            placeholder="请输入您的就医体验和评价（选填）"
            :max-length="200"
            rows="3"
            show-count
        />
      </nut-form-item>
    </nut-form>

    <!-- 提交按钮 -->
    <view class="submit-area">
      <nut-button
          type="primary"
          block
          :loading="submitting"
          @click="handleSubmit"
      >
        提交评价
      </nut-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import { submitHospitalRating, getRatingDimensions, RatingDimension } from '@/api/rating';
import type { RatingSubmitParams } from '@/api/rating';

const props = defineProps({
  hospitalId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['success', 'cancel']);

// 表单引用
const formRef = ref(null);

// 提交状态
const submitting = ref(false);

// 评分维度
const dimensions = ref<RatingDimension[]>([]);

// 表单数据
const formData = reactive<RatingSubmitParams>({
  medical_quality: 5,
  service: 5,
  environment: 5,
  efficiency: 5,
  equipment: 5,
  comment: ''
});

// 获取评分维度
const fetchRatingDimensions = async () => {
  try {
    dimensions.value = await getRatingDimensions();
  } catch (error) {
    console.error('获取评分维度失败:', error);
  }
};

// 提交评价
const handleSubmit = async () => {
  // 验证表单
  if (
      formData.medical_quality < 1 ||
      formData.service < 1 ||
      formData.environment < 1 ||
      formData.efficiency < 1 ||
      formData.equipment < 1
  ) {
    Taro.showToast({
      title: '请为所有维度评分',
      icon: 'none'
    });
    return;
  }

  submitting.value = true;

  try {
    // 提交评价
    await submitHospitalRating(props.hospitalId, {
      medical_quality: formData.medical_quality,
      service: formData.service,
      environment: formData.environment,
      efficiency: formData.efficiency,
      equipment: formData.equipment,
      comment: formData.comment.trim()
    });

    // 提交成功
    Taro.showToast({
      title: '评价提交成功',
      icon: 'success'
    });

    // 通知父组件
    emit('success');

    // 重置表单
    formData.medical_quality = 5;
    formData.service = 5;
    formData.environment = 5;
    formData.efficiency = 5;
    formData.equipment = 5;
    formData.comment = '';
  } catch (error) {
    console.error('提交评价失败:', error);
    Taro.showToast({
      title: '提交失败，请重试',
      icon: 'error'
    });
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchRatingDimensions();
});
</script>

<style lang="scss">
.rating-form {
  padding: 16px;
  background: #fff;
  border-radius: 12px;

  .rating-item {
    display: flex;
    align-items: center;
    gap: 12px;

    .rating-value {
      font-size: 24px;
      color: #666;
    }
  }

  .rating-desc {
    margin-top: 4px;
    font-size: 22px;
    color: #999;
  }

  .submit-area {
    margin-top: 32px;
    padding: 0 16px;
  }
}

// 暗黑模式支持
@media (prefers-color-scheme: dark) {
  .rating-form {
    background: #2a2a2a;

    .rating-item {
      .rating-value {
        color: #999;
      }
    }

    .rating-desc {
      color: #777;
    }
  }
}
</style>