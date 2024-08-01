<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '关于我们',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="page flex-col">
    <scroll-view scroll-y="true" class="scroll-y">
      <view class="content-box flex-col">
        <rich-text :nodes="htmlSnip"></rich-text>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="js" setup>
import { getAgreement } from '@/service/user'
const htmlSnip = ref(null)

onLoad((options) => {
  getAgreementById('关于我们')
})
function getAgreementById(data) {
  getAgreement(data).then((res) => {
    htmlSnip.value = res.data
  })
}
</script>

<style lang="scss" scoped>
.from {
  position: relative;
  height: 50px;
  margin: 0 auto;
}

.link {
  position: absolute;
  right: 10px;
  bottom: 25px;
  font-size: 14px;
  color: #999;
}

.link-left {
  position: absolute;
  bottom: 25px;
  left: 10px;
  font-size: 14px;
  color: #999;
}

.btnstyle {
  position: absolute;
  bottom: 16px;
  left: 50%;
  width: 319px;
  height: 48px;
  line-height: 48px;
  color: #fff;
  background: #b42a3e;
  border-radius: 24px;
  transform: translateX(-50%);
}

img {
  max-width: 200px;
  max-height: 200px;
}
</style>
