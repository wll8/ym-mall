<template>
  <view class="detail-infos">
    <view class="title">{{ title }}</view>
    <view class="price">
      <DisplayPrice margin-left="0px" :value="price" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import DisplayPrice from '@/components/display-price/index.vue'

interface IProps {
  title?: string
  price?: number | string
}
defineProps<IProps>()
</script>

<style lang="scss" scoped>
.detail-infos {
  padding: 24rpx 32rpx;
  background-color: #fff;
}

.title {
  margin-bottom: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 48rpx;
}
</style>
