<template>
  <view class="common-button" :style="{ backgroundColor: bgColor, color, width }">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  bgColor?: string
  color?: string
  width?: string
}
withDefaults(defineProps<IProps>(), {
  bgColor: '#B42A3E',
  color: '#fff',
  width: 'inherit',
})
</script>

<style lang="scss" scoped>
.common-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 84rpx;
  padding: 0 64rpx;
  font-size: 28rpx;
  color: #fff;
  border: 2rpx solid transparent;
  border-radius: 42rpx;
}
</style>
