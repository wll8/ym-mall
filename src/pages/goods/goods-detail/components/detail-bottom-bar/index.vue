<template>
  <view class="bottom-bar-wrap" v-if="userStore.userInfo.role_name === 'user'">
    <view style="height: 124rpx"></view>
    <view class="bottom-bar">
      <view class="bar-item-left">
        <view class="bar-item">
          <view class="icon">
            <WSvgIcon name="home" height="32rpx" width="32rpx" />
          </view>
          <view class="item-text" @click="toRelaunchPage('/pages/index/index')">首页</view>
        </view>
        <view class="bar-item" @click="showPhoneList">
          <view class="icon">
            <WSvgIcon name="custom-service" height="32rpx" width="32rpx" />
          </view>
          <view class="item-text">客服</view>
        </view>
        <view class="bar-item" @click="toPage('/pages/car/index?hideBar=true')">
          <view class="icon">
            <WSvgIcon name="shopping-cart" height="32rpx" width="32rpx" />
          </view>
          <view class="item-text">购物车</view>
        </view>
      </view>
      <view class="bar-item-right">
        <view class="bar-item add-to-cart" @click="addToCart">加入购物车</view>
        <view class="bar-item emption" @click="pay()">立即购买</view>
      </view>
    </view>
    <ShowCustomService v-model="customServerShow" />
  </view>
</template>

<script lang="ts" setup>
import useGoodsStore from '@/store/goods'
import { useCarStore } from '@/store/car'
import toBindInvitaionCode from '@/utils/to-bind-invitaion-code'
const emit = defineEmits(['payClick'])
const goodsStore = useGoodsStore()
const carStore = useCarStore()
const customServerShow = ref(false)

// functions
function addToCart() {
  if (toBindInvitaionCode()) {
    const { goodsId, num } = goodsStore.purchaseInformation
    carStore.add(goodsId, num)
  }
}
function toPage(url: string) {
  uni.navigateTo({
    url,
  })
}
function toRelaunchPage(page) {
  uni.reLaunch({
    url: page,
  })
}
function pay() {
  if (toBindInvitaionCode()) {
    emit('payClick')
  }
}

// 去展示客服列表
function showPhoneList() {
  customServerShow.value = true
}
</script>

<style lang="scss" scoped>
.bottom-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  height: 124rpx;
  font-size: 16px;
  line-height: 49px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 0 2rpx 0rpx #ccc;
}

.bar-item-left {
  width: 40%;
}

.bar-item-left,
.bar-item-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar-item {
  flex: 1;
  font-size: 16px;
  line-height: 1;
}

.item-text {
  margin-top: 6rpx;
}

.bar-item-right {
  flex: 1;

  view {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 84rpx;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 40rpx;
    color: #fff;
  }
}

.add-to-cart {
  background-color: #fea800;
  border-radius: 54rpx 0rpx 0rpx 54rpx;
}

.emption {
  margin-right: 32rpx;
  background: #b42a3e;
  border-radius: 0rpx 54rpx 54rpx 0rpx;
}

.bar-item view {
  font-size: 20rpx;
  color: #666;
}

.bar-item .icon {
  position: relative;
  display: block;
  width: 32rpx;
  height: 32rpx;
  margin: 0 auto 4rpx;
}
</style>
