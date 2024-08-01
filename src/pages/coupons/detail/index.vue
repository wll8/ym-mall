<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '优惠卷详情',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="coupon-detail" :class="{ 'gray-content': couponInfo.useStatus !== '0' }">
    <view class="detail-top" flex justify-center>
      <view class="price-info">
        <view class="price" flex items-end>
          <view class="small">¥</view>
          <view class="num">{{ couponInfo.val }}</view>
        </view>
        <view class="subtitle">满{{ couponInfo.minSpend }}可用</view>
      </view>
      <view class="svg-icon si-used top-icon" v-show="couponInfo.useStatus === '1'"></view>
      <view class="svg-icon si-expired top-icon" v-show="couponInfo.useStatus === '2'"></view>
    </view>
    <view class="detail-center">
      <div class="center-title">{{ couponInfo.name }}</div>
      <view class="time center-small">有效期 {{ couponInfo.expirationDate }}</view>
      <view class="desc center-small">{{ couponInfo.detai }}</view>
    </view>
    <!-- <view class="detail-footer" flex justify-center>
      <view class="button">去使用</view>
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import useCouponStore from '@/store/coupon'

const { couponInfo } = storeToRefs(useCouponStore())
</script>
<style lang="scss" scoped>
.coupon-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 26rpx;
  margin-top: 80rpx;
  text-align: center;
}

.detail-top {
  position: relative;

  .top-icon {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.svg-icon {
  width: 128rpx;
  height: 128rpx;
}

.price {
  font-weight: bolder;
  color: #b42a3e;

  .small {
    font-size: 36rpx;
    line-height: 1.7;
  }

  .num {
    font-size: 48rpx;
  }
}

.detail-center {
  .center-title {
    margin-top: 80rpx;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    color: #333;
  }

  .center-small {
    margin-top: 8rpx;
    font-size: 20rpx;
    line-height: 36rpx;
    color: #999;
  }
}

.subtitle {
  margin-top: 14rpx;
  font-size: 20rpx;
  line-height: 36rpx;
  color: #b42a3e;
}

// button
.button {
  width: 100%;
  padding: 14rpx 0rpx;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #b42a3e;
  text-align: center;
  background-color: #f7e9eb;
  border-radius: 32rpx;
}

.detail-footer {
  margin-top: 80rpx;
}
</style>
