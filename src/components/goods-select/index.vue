<template>
  <view class="goods-select">
    <view
      class="goods-item"
      v-for="(item, index) in options"
      :class="{ active: currentIndex === index }"
      :key="index"
      @click="change(index)"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IOptions } from './type'

interface IProps {
  options?: IOptions
  activeIndex?: number
}
const emit = defineEmits(['change'])
const props = withDefaults(defineProps<IProps>(), {
  options: () => [],
  activeIndex: 0,
})

const currentIndex = ref(0)

// 设置激活
watchEffect(() => {
  currentIndex.value = props.activeIndex
})

function change(index: number) {
  currentIndex.value = index

  const value = props.options[index]
  const info = { index, value }
  emit('change', info)
}
</script>

<style lang="scss" scoped>
.goods-item {
  display: inline-block;
  padding: 18rpx 40rpx;
  margin-top: 24rpx;
  margin-right: 10rpx;
  overflow: hidden;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #333;
  background-color: #f5f5f5;
  border-radius: 40px;

  &.active {
    color: #b42a3e;
    background: #fff7f8;
    background-color: #fff;
    border: 2rpx solid #b22338;
  }
}
</style>
