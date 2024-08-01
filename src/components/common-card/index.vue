<template>
  <view
    class="common-card"
    :style="{
      backgroundColor: bgColor,
      fontSize: size,
      color,
    }"
  >
    <view class="card-header" :style="{ borderColor: headerBorderColor }">
      <view class="header-left" flex>
        <view class="check-wrap" v-if="type === 'check'" @click.stop="changeModelValue" mr-2>
          <view class="svg-icon si-check" v-if="!modelValue"></view>
          <view class="svg-icon si-checked" v-else></view>
        </view>
        <view class="title-text">
          {{ headerInfo.title }}
        </view>
      </view>
      <div class="header-right" :style="{ color: headerInfo.rightColor }">
        {{ headerInfo.rightText }}
      </div>
    </view>
    <div class="card-content">
      <slot></slot>
    </div>
  </view>
</template>

<script lang="ts" setup>
import type { IHeaderInfo } from './type'

interface IProps {
  bgColor?: string
  color?: string
  // 字体大小
  size?: string
  // header边框颜色
  headerBorderColor?: string
  headerInfo: IHeaderInfo
  type?: 'normal' | 'check'
  modelValue?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  bgColor: '#fff',
  color: '#666666',
  size: '24rpx',
  headerBorderColor: '#f5f5f5',
  type: 'normal',
  modelValue: false,
})
const emit = defineEmits(['update:modelValue'])
function changeModelValue() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style lang="scss" scoped>
.common-card {
  padding: 24rpx;
  border-radius: 16rpx;
}

.check-wrap {
  width: 34rpx;
  height: 34rpx;

  .svg-icon {
    width: 34rpx;
    height: 34rpx;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.header-right {
  min-width: 80rpx;
}
</style>
