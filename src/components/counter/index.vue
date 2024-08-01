<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '' },
}
</route>

<template>
  <view class="counter flex">
    <view class="sub operate" @click="addNum(-1)">-</view>
    <view class="count">{{ count }}</view>
    <view class="add operate" @click="addNum(1)">+</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { showToast } from '@/utils/interaction'
interface IProps {
  modelValue?: number
  maxValue?: number
}
const emit = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<IProps>(), {
  modelValue: 0,
  maxValue: 20,
})

const count = ref(1)
// 自动收集依赖
watchEffect(() => {
  count.value = props.modelValue > 0 ? props.modelValue : 1
})
// 绑定发生改变
function changeModelValue() {
  emit('update:modelValue', count.value)
}
// 添加数字
function addNum(num: number) {
  const value = count.value + num
  if (value <= 0) return
  if (props.maxValue && value > props.maxValue) {
    showToast('购买数量不能超过库存数量！')
    return
  }
  count.value = value
  changeModelValue()
}
</script>

<style lang="scss" scoped>
.counter {
  overflow: hidden;
  border: 2rpx solid #b42a3e;
  border-radius: 8rpx;

  > view {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.operate {
  width: 64rpx;
  height: 56rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #b42a3e;
}

.count {
  width: 72rpx;
  height: 56rpx;
  color: #666;
  border-right: 2rpx solid #b42a3e;
  border-left: 2rpx solid #b42a3e;
}
</style>
