<template>
  <view class="cell-select">
    <template v-for="(item, index) in options" :key="index">
      <CommonCellV2 :is-border="showBorder(index)" @click="onChange(item.value)">
        <template #left>
          <view class="label">
            <view class="label-icon">
              <WSvgIcon :name="item.icon" height="64rpx" width="64rpx" />
            </view>
            <view class="label-text">{{ item.label }}</view>
          </view>
        </template>
        <template #right>
          <view class="check-icon">
            <view class="svg-icon si-radio-active" h32rpx w32rpx v-if="modelValue === item.value" />
            <view class="svg-icon si-radio" h32rpx w32rpx v-else />
          </view>
        </template>
      </CommonCellV2>
    </template>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CommonCellV2 from '../common-cell-v2/index.vue'
import type { ICellRadiosOptions } from './type'

interface IProps {
  options: ICellRadiosOptions
  modelValue?: string | number
}
const props = defineProps<IProps>()
const showBorder = (index) => {
  return index !== props.options.length - 1
}
const emit = defineEmits(['update:modelValue'])

function onChange(value: number | string) {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.label {
  display: flex;
  align-items: center;

  .label-text {
    line-height: 1.4;
  }

  .label-icon {
    margin-right: 10rpx;
  }
}
</style>
