<template>
  <view class="order-status-card">
    <view class="card-header">
      <view class="card-icon">
        <WSvgIcon :name="icon" height="40rpx" width="40rpx"></WSvgIcon>
      </view>
      <view class="card-text" :style="{ color }">{{ text }}</view>
    </view>
    <view class="card-content">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
interface IPros {
  icon: string
  text: string
  color?: string
}

withDefaults(defineProps<IPros>(), {
  color: '#FEA800',
})
</script>

<style lang="scss" scoped>
.order-status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24rpx 0;
  color: #333;
  background-color: #fff;

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    font-size: 32rpx;
    font-weight: bold;
    line-height: 44rpx;
    color: #fea800;

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }
  }
}
</style>
