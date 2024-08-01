<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '邀请码',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="bgc">
    <image class="bgimage" mode="aspectFit" :src="httpurl('/static/images/banner1.png')"></image>
    <view class="text-center">
      <view class="my-10px text-3xl">
        邀请码：
        <span>{{ inviteCode }}</span>
      </view>
      <view class="my-20px flex">
        <button class="mini-btn" type="primary" @click="handleInviteCode">刷新验证码</button>
        <button class="mini-btn" type="default" @click="getDetail">复制验证码</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getInviteCode } from '@/service/user'

const inviteCode = ref('')
onLoad(() => {
  handleInviteCode()
})
function handleInviteCode() {
  uni.showLoading({
    title: '加载中',
  })
  getInviteCode().then((res) => {
    inviteCode.value = res.data
    uni.hideLoading()
  })
}
//
function getDetail() {
  uni.setClipboardData({
    data: inviteCode.value,
    success: function () {
      console.log('success')
    },
  })
}
</script>

<style lang="scss" scoped>
//
.bgc {
  width: 100vw;
  overflow: hidden;
  background: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

.bgimage {
  width: 100vw;
  height: 55vh;
  background-color: #eee;
}
</style>
