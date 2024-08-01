<template>
  <view class="detail-infos">
    <view class="title">{{ title }}</view>
    <view class="price" v-if="$handleHidePrice()">
      <DisplayPrice margin-left="0px" :value="price" />
      <view class="origin-price" v-if="stringToNumber(marketPrice)">
        原价：
        <view class="line-price">¥{{ marketPrice }}</view>
      </view>
    </view>
    <!-- 优惠券 -->
    <view
      class="coupon-area flex items-center"
      @click.stop="tooGetCoupons"
      v-if="userStore.userInfo.role_name === 'user'"
    >
      <view class="area-left">
        {{ currentCoupon.val ? `优惠金额 ¥${currentCoupon.val}` : '选择优惠卷' }}
      </view>
      <view class="svg-icon si-arrow-right"></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import DisplayPrice from '@/components/display-price/index.vue'
import { stringToNumber } from '@/utils/string-to-number'
import { useOrderStore } from '@/store'
interface IProps {
  title?: string
  price?: number | string | null
  marketPrice?: number | string | null
  id?: string | number
}
const props = defineProps<IProps>()
const orderStore = useOrderStore()
const { currentCoupon } = storeToRefs(orderStore)
//  去领取优惠券
function tooGetCoupons() {
  uni.navigateTo({
    url: `/pages/coupons/get-coupons/index?price=${props.price}&goodsId=${props.id}`,
  })
}
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

.origin-price {
  display: flex;
  align-items: center;
  color: #333;

  .line-price {
    color: #444;
    text-decoration: line-through;
  }
}

.coupon-area {
  justify-content: space-between;
  height: 60rpx;
  line-height: 60rpx;
  color: #b42a3e;

  .svg-icon {
    width: 30rpx;
  }
}
</style>
