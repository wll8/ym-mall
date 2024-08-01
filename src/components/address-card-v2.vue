<template>
  <view class="address-card">
    <view class="address-card-left">
      <view class="left-header">
        <view class="name">收货人：{{ name }}</view>
        <view class="phone" @click.stop="callPhone(phone)">电话：{{ phone }}</view>
      </view>
      <view class="left-content">地址：{{ detailAddress }}</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
defineProps<{
  phone?: string
  name?: string
  detailAddress?: string
}>()

// 打电话
function callPhone(phone) {
  uni.makePhoneCall({
    phoneNumber: phone,
  })
}
</script>

<style lang="scss" scoped>
.address-card {
  display: flex;
  align-items: center;
  padding: 0rpx;
  font-size: 30rpx;
  background: #fff;
}

.address-card-left {
  flex: 1;
}

.left-header {
  display: flex;
  align-items: flex-end;
  color: #333;

  .name {
    margin-right: 12rpx;
  }
}

.left-content {
  margin-top: 16rpx;
  color: #333;
}
</style>
