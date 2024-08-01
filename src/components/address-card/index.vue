<template>
  <view class="address-card-wrap" @click="cardClick">
    <view class="address-card" v-if="addressInfo && addressInfo.addressAllName">
      <view class="address-card-left">
        <view class="left-header">
          <view class="tip" v-if="isDefault">默认</view>
          <view class="name">{{ addressInfo?.realName }}</view>
          <view class="phone" @click="callPhone(addressInfo?.phone)">
            {{ addressInfo?.phone }}
          </view>
        </view>
        <view class="left-content">{{ detailAddress }}</view>
      </view>
      <view class="address-card-right" v-if="!disabled">
        <WSvgIcon name="arrow-right" height="32rpx" width="32rpx" />
      </view>
    </view>
    <view class="not-address" v-else>
      <view class="not-address">没有地址，请选择地址</view>
      <view class="address-card-right" v-if="!disabled">
        <WSvgIcon name="arrow-right" height="32rpx" width="32rpx" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import useAddress from '@/hooks/useAddress'

interface IProps {
  disabled?: boolean
  isDefault?: boolean
  addressInfo?: any
  isCall?: boolean
}
const emit = defineEmits(['click'])
const { toChooseAddress } = useAddress()
const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  isDefault: false,
  isCall: false,
})
const detailAddress = computed(() => {
  const addressInfo = props.addressInfo
  return addressInfo.addressAllName
    ? `${addressInfo.addressAllName ?? ''} ${addressInfo.detail ?? ''}`
    : ''
})
function cardClick() {
  if (!props.disabled) {
    emit('click')
    toChooseAddress()
  }
}
// 打电话
function callPhone(phone) {
  if (!props.isCall) return
  uni.makePhoneCall({
    phoneNumber: phone,
  })
}
</script>

<style lang="scss" scoped>
.address-card {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  background: #fff;
}

.address-card-left {
  flex: 1;
}

.left-header {
  display: flex;
  align-items: flex-end;

  .tip {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rpx 6rpx;
    margin-right: 16rpx;
    font-size: 20rpx;
    color: #fff;
    background-color: #b92a3f;
    border-radius: 0 4rpx;
  }

  .name {
    margin-right: 12rpx;
    font-size: 32rpx;
    color: #333;
  }

  .phone {
    font-size: 28rpx;
    color: #666;
  }
}

.left-content {
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #666;
}

.address-card-right {
  width: 16px;
  height: 16px;
}

.not-address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  background: #fff;
}
</style>
