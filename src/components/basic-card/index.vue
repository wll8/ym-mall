<template>
  <view class="basic-card">
    <view class="card-header">{{ title }}</view>
    <view class="card-content">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  title: string
}
defineProps<IProps>()
</script>

<style lang="scss" scoped>
.basic-card {
  padding: 24rpx;
  background-color: #fff;
}

.card-header {
  font-size: 32rpx;
  font-weight: bold;
}
</style>
