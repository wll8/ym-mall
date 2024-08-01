<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view>
    <AgreePopup v-if="false"></AgreePopup>
  </view>
</template>

<script lang="js" setup>
import { useUserStore, useTabbarStore, loginRoute } from '@/store'
import AgreePopup from '@/components/agree-popup/index.vue'
import { getDetail } from '@/service/user'
import { getLastItem, toHome } from '@/utils'
const userStore = useUserStore()
const message = ref(null)

function goLogin() {
  userStore.isLogined ? toHome() : uni.reLaunch({ url: loginRoute })
}

onMounted(() => {
  goLogin()
  // const isAgree = userStore.userInfo.isAgree
  // if (isAgree) {
  //   setTimeout(() => {
  //     goLogin()
  //   }, 1000)
  // } else {
  //   message.value = true
  // }
})
</script>

<style lang="scss" scoped>
.background {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(45deg, rgb(49 203 239 / 100%) 50%, rgb(45 86 197 / 100%) 100%);
}
</style>
