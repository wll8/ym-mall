<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '商家详情',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="supplier-detail">
    <BusinessCard :is-right="false" :data="businessInfo" />
    <view class="basic-info">
      <view class="basic-info-item" @click="payPhone" flex items-center>
        <view class="left-icon svg-icon si-phone1"></view>
        <view class="text" flex>
          电话：
          <view class="text-value">{{ businessInfo.tel }}</view>
        </view>
        <view class="right-icon"></view>
      </view>
      <view class="basic-info-item" flex items-center>
        <view class="left-icon svg-icon si-position1"></view>
        <view class="text" flex>
          地址：
          <view class="text-value" @click="toMapApp">
            {{ businessInfo.storeAddressName }} {{ businessInfo.detailAddress ?? '' }}
          </view>
        </view>
        <view class="right-icon"></view>
      </view>
    </view>
    <view class="show-list">
      <view class="item" @click="showImages()" flex>
        <view class="item-left">查看营业执照以及相关凭证</view>
        <view class="svg-icon si-arrow-right"></view>
      </view>
      <view class="item" @click="toSupplierGoods" flex>
        <view class="item-left">供应商商品</view>
        <view class="svg-icon si-arrow-right"></view>
      </view>
      <view class="item" @click="toOrderList" flex>
        <view class="item-left">供应商订单</view>
        <view class="svg-icon si-arrow-right"></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { showToast } from '@/utils/interaction'
import BusinessCard from '../components/business-card.vue'
import useBusinessStore from '@/store/business'

const { businessInfo } = storeToRefs(useBusinessStore())
// 加载数据
// onLoad((options) => {
//   if (options.id) {

//   }
// })
// 拨打电话
const payPhone = () => {
  uni.makePhoneCall({
    phoneNumber: businessInfo.value.tel,
    fail() {
      //
      uni.setClipboardData({
        data: businessInfo.value.phone,
        success: () => {
          showToast('复制电话号码成功！')
        },
      })
    },
  })
}
const toMapApp = () => {
  if (businessInfo.value) {
    const info = businessInfo.value
    const detailAddress = `${info.storeAddressName} ${info.detailAddress ?? ''}`
    uni.setClipboardData({
      data: detailAddress,
      success: () => {
        showToast('复制地址成功！')
      },
    })
  } else {
    showToast('暂无地址')
  }
}

function showImages() {
  if (businessInfo.value.businessLicense) {
    const imgs = businessInfo.value.businessLicense.split(',')
    uni.previewImage({
      current: imgs[0],
      urls: imgs,
    })
  } else {
    showToast('暂无凭证照片！')
  }
}
// 查看供应商商品
function toSupplierGoods() {
  uni.navigateTo({
    url: `/pages/purchase/supplier-goods/index?userId=${businessInfo.value.id}`,
  })
}

// 去查看供应商订单列表
function toOrderList() {
  uni.navigateTo({
    // todo修改
    url: `/pages/purchase/order/user-order/index?userId=${businessInfo.value.userId}`,
  })
}
</script>

<style lang="scss" scoped>
.supplier-detail {
  padding: 0 24rpx;

  .basic-info-item {
    margin-top: 24rpx;
    font-size: 24rpx;
    color: #999;

    .text-value {
      color: #666;
    }

    .left-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 4rpx;
    }

    .right-icon {
      width: 28rpx;
      height: 28rpx;
    }
  }

  .item {
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 24rpx 30rpx 32rpx;
    margin-top: 24rpx;
    font-size: 28rpx;
    color: #333;
    background-color: #fafafa;
    border-radius: 16rpx;
  }

  .svg-icon {
    width: 32rpx;
    height: 32rpx;
  }
}
</style>
