<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '支付详情',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="payment-detail">
    <view class="show-tips">
      <view class="show-icon">
        <WSvgIcon name="success" height="140rpx" width="140rpx" />
      </view>
      <view class="show-text">支付成功</view>
    </view>
    <view class="buttons">
      <CardButton height="84rpx" borderRadius="42rpx" @click="toMyOrder">查看订单</CardButton>
      <CommonButton class="return-home" @click="toHome(true)">返回首页</CommonButton>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { toHome } from '@/utils'

function toMyOrder() {
  uni.redirectTo({
    url: '/pages/order/my-order/index',
  })
}
</script>

<style lang="scss">
.payment-detail {
  padding: 0 56rpx;
}

.return-home {
  margin-top: 32rpx;
}

.show-tips {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 160rpx 0;
}

.show-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140rpx;
  height: 140rpx;
  margin-bottom: 32rpx;
}

.show-text {
  font-size: 28rpx;
  color: #75be00;
}
</style>
