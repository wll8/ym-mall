<template>
  <view class="business-card" :class="{ cardBorder: isBorder }" @click="toDetail">
    <view class="card-head">
      <view class="cover">
        <image :src="data?.avatar" class="img" mode="scaleToFill" />
      </view>
      <view class="business-info">
        <view class="title">{{ data?.userName }}</view>
        <view class="count-info">
          <view class="count-info-item" flex>
            <view class="info-item-left">商品数量：</view>
            <view class="info-item-right">{{ data?.goodsNum }}件</view>
          </view>
          <view class="count-info-item" flex>
            <view class="info-item-left">订单数量：</view>
            <view class="info-item-right">{{ data?.orderNum }}笔</view>
          </view>
          <view class="count-info-item" flex v-if="data?.notEnoughNumber">
            <view class="info-item-left">库存不足商品：</view>
            <view class="info-item-right text-rose-700">{{ data?.notEnoughNumber }}件</view>
          </view>
        </view>
      </view>
      <view v-if="isRight" class="right-icon svg-icon si-arrow-right"></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import useBusinessStore from '@/store/business'
interface IProps {
  data?: any
  isRight?: boolean
  isBorder?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  isRight: true,
  isBorder: true,
})

// 去商品详情
function toDetail() {
  if (!props.isRight) {
    return
  }
  useBusinessStore().changeBusinessInfoAction(props.data)
  uni.navigateTo({
    url: `/pages/purchase/supplier-detail/index?id=${props.data.id}`,
  })
}
</script>

<style lang="scss" scoped>
.business-card {
  padding: 34rpx 0;
}

.cardBorder {
  border-bottom: 2rpx solid #eee;
}

.business-card {
  .card-head {
    display: flex;
    align-items: center;
  }

  .business-info {
    flex: 1;
  }

  .cover {
    width: 120rpx;
    height: 120rpx;
    margin-right: 24rpx;
    overflow: hidden;
    border-radius: 50%;

    .img {
      width: 100%;
      height: 100%;
    }
  }

  .business-info {
    .title {
      margin-bottom: 16rpx;
      font-size: 32rpx;
      color: #333;
    }
  }
}

.count-info {
  line-height: 40rpx;
  color: #999;

  .right-line {
    position: relative;
    padding-right: 24rpx;

    &::after {
      position: absolute;
      top: 50%;
      right: 0;
      width: 2rpx;
      height: 28rpx;
      content: '';
      background-color: #ddd;
      transform: translateY(-50%);
    }

    padding-left: 24rpx;

    &:first-child {
      padding-left: 0;
    }
  }
}

.right-icon {
  width: 32rpx;
  height: 32rpx;
}
</style>
