<template>
  <view class="record-card" flex>
    <view class="cover" flex items-center border-rd-2 overflow-hidden>
      <image class="img" w-full :src="coverSrc" mode="=widthFix" />
    </view>
    <view class="card-info" ml-2 items-center>
      <view class="card-title" mt-4>{{ goodsName }}</view>
      <view class="browse-number" mt-2>已浏览：{{ browseNumber }}次</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
defineProps<{
  coverSrc?: string
  goodsName?: string
  browseNumber?: string | number
}>()
</script>
<style lang="scss" scoped>
.record-card {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 0rpx;
}

.cover {
  display: flex;
  align-items: center;
  width: 160rpx;
  height: 160rpx;
  overflow: hidden;
}

.card-title {
  padding-bottom: 10rpx;
  font-size: 34rpx;
  font-weight: bold;
  line-height: 1.4;
  color: #333;
}

.browse-number {
  font-size: 28rpx;
  color: #666;
}
</style>
