<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '',
  },
}
</route>

<template>
  <view class="popup">
    <h3 class="text-center my-3">用户协议和隐私政策</h3>
    <view class="indent-8">
      请你务必审慎阅读、充分理解“用户协议”和“隐私政策”各条款，包括但不限于：为了更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。你可阅读
      <span class="text-cyan-500" @click="toPrivacy(2)">《用户协议》</span>
      和
      <span class="text-cyan-500" @click="toPrivacy(1)">《隐私政策》</span>
      了解详细信息。如果你同意，请点击下面按钮开始接受我们的服务。
    </view>
    <view class="text-center mt-5">
      <view class="m-3 button" @click="agree">同意</view>
      <view class="m-1 button" @click="refuse">不同意并退出APP</view>
    </view>
  </view>
</template>

<script lang="js" setup>
import { useUserStore, useTabbarStore, loginRoute } from '@/store'
import { toHome } from '@/utils'
import { getDetail } from '@/service/user'
const userStore = useUserStore()

// 同意
function agree() {
  userStore.userInfo.isAgree = true
  goLogin()
}
// 拒绝
function refuse() {
  console.log('关闭')
  plus.runtime.quit()
}
// 跳转协议页面
function toPrivacy(type) {
  viewHtml(() => getDetail({ type }).then((res) => res.data))
}
function goLogin() {
  userStore.isLogined ? toHome() : uni.reLaunch({ url: loginRoute })
}
</script>

<style lang="scss" scoped>
.popup {
  position: absolute;
  top: 50%;
  right: 50%;
  width: 90%;

  //   border: 0.5rem outset rgb(108, 241, 230);
  padding: 20px;
  background: rgb(255 255 255);
  border-radius: 10px;
  transform: translateX(50%) translateY(-50%);
}

.button {
  width: 400rpx;
  height: 60rpx;
  margin: 15px auto;
  line-height: 60rpx;
  color: white;
  background: #4cbdf7;
  border-radius: 60rpx;
}
</style>
