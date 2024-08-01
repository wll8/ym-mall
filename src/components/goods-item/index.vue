<template>
  <view class="goods-item" :style="{ paddingBottom: isPaddingBottom ? '24rpx' : '0' }">
    <view class="item-cover">
      <image mode="widthFix" :src="data?.goodsImage" class="img" />
    </view>
    <view class="goods-info">
      <view class="goods-info-wrap">
        <view class="info-title">{{ data?.goodsName }}</view>
        <view class="choose-weight">
          <view class="weight-left">
            {{ data?.goodsSpec }}
          </view>
        </view>
        <view class="pay-info">
          <DisplayPrice :value="data.goodsPrice" v-if="!hidePrice" />
          <view v-else></view>
          <view class="goods-count">x {{ data?.goodsNum }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import DisplayPrice from '../display-price/index.vue'

interface IProps {
  isPaddingBottom?: boolean
  data?: any
  hidePrice?: boolean
}
withDefaults(defineProps<IProps>(), {
  isPaddingBottom: true,
  data: [],
  hidePrice: false,
})
</script>

<style lang="scss" scoped>
.goods-item,
.pay-info {
  display: flex;
}

.goods-item {
  padding: 24rpx 32rpx;
  background-color: #fff;

  .item-cover {
    display: flex;
    align-items: center;
    width: 144rpx;
    height: 144rpx;
    margin-right: 24rpx;
    overflow: hidden;
    border-radius: 10rpx;

    .img {
      width: 100%;
    }
  }
}

.goods-info {
  flex: 1;

  .goods-info-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: 100%;
  }
}

.choose-weight {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 300rpx;
  padding: 6rpx 20rpx;
  margin-top: 8rpx;
  overflow: hidden;
  color: #999;
  cursor: pointer;
  background-color: #fafafa;
  border-radius: 6rpx;
}

.pay-info {
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #999;
}
</style>
