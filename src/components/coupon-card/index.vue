<template>
  <view
    class="coupon-card"
    @click="onClick"
    :class="{ 'gray-card': showStatus !== 0 }"
    flex
    items-center
  >
    <view class="coupon-card-left" flex items-center>
      <view class="price" flex items-end>
        <template v-if="isShowPrice">
          <view class="small">¥</view>
          <view class="num">{{ price }}</view>
        </template>
        <template v-if="String(type) === '2'">
          <view class="num">{{ discount }}</view>
          <view class="small">折</view>
        </template>
      </view>
      <view class="left-footer" v-if="String(type) === '2'">最大折扣金额 {{ maxDiscount }}</view>
      <view class="left-footer" v-if="String(type) === '1' || String(type) === '2'">
        {{ subtitle }}
      </view>
    </view>
    <view class="coupon-card-center">
      <view class="center-title">{{ title }}</view>
      <view class="time center-small">有效期 {{ time }}</view>
      <view class="desc center-small" text-ellipsis>{{ description }}</view>
    </view>
    <view class="coupon-card-right">
      <slot>
        <template v-if="isUsed">
          <view class="button" @click="onUsedClick">去使用</view>
        </template>
        <template v-if="showStatus === 1">
          <view class="svg-icon si-used"></view>
        </template>
        <template v-if="showStatus === -1">
          <view class="svg-icon si-expired"></view>
        </template>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { stringToNumber } from '@/utils/string-to-number'

interface IProps {
  price?: number | string
  type?: string | number
  subtitle?: string
  title?: string
  time?: string
  description?: string
  state?: string | number // 0 - 待使用， 1 - 已使用 ， -1 - 已过期
  isUsed?: boolean
  maxDiscount?: number | string
}
const props = withDefaults(defineProps<IProps>(), {
  price: 0,
  subtitle: '满300可用',
  title: '【通用券】新人专享券',
  time: '',
  description: '这里显示优惠券的详细说明超出',
  state: '0',
  isUsed: false,
})
const emit = defineEmits(['cardClick', 'useClick'])
const showStatus = computed(() => {
  return stringToNumber(props.state)
})
// 是否展示价格
const isShowPrice = computed(() => {
  const flag = props.type === '1' || props.type === '3' || props.type === '4'
  console.log(flag, '----test flag----')
  return flag
})
// 展示折扣
const discount = computed(() => {
  return stringToNumber(props.price) / 10
})
function onClick() {
  emit('cardClick')
}
function onUsedClick() {
  emit('useClick')
}
</script>

<style lang="scss" scoped>
.coupon-card {
  padding: 24rpx 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
}

.gray-card {
  filter: grayscale(1);
}

.coupon-card-left {
  position: relative;
  flex-direction: column;
  justify-content: center;
  min-width: 276rpx;
  padding-right: 42rpx;
  padding-left: 22rpx;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 2rpx;
    height: 100%;
    content: '';
    background-color: #f7e9eb;
  }

  .left-footer {
    margin-top: 14rpx;
    font-size: 20rpx;
    line-height: 36rpx;
    color: #b42a3e;
  }
}

.price {
  font-weight: bolder;
  color: #b42a3e;

  .small {
    font-size: 36rpx;
    line-height: 1.6;
  }

  .num {
    font-size: 48rpx;
  }
}

.coupon-card-center {
  flex: 1;
  margin-left: 24rpx;

  .center-title {
    font-size: 28rpx;
    color: #333;
  }

  .center-small {
    font-size: 20rpx;
    line-height: 36rpx;
    color: #999;
  }
}

// button
.button {
  padding: 14rpx 32rpx;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #b42a3e;
  text-align: center;
  background-color: #f7e9eb;
  border-radius: 32rpx;
}

// coupon-card-right
.coupon-card-right {
  .svg-icon {
    width: 128rpx;
    height: 128rpx;
  }
}
</style>
