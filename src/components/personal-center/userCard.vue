<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '',
  },
}
</route>

<template>
  <view class="usercard" @click="toUserCard">
    <wd-img :width="72" :height="72" round :src="httpurl(userData.avatar)" />
    <view style="margin-left: 12px">
      <view style="font-weight: bold" class="flex">
        {{ userData.name }}
        <!-- <span v-show="userData.state === 1" class="label-red">审核中</span>
        <span v-show="userData.state === 0" class="laber-green">正常</span> -->
      </view>
      <view>{{ userData.phone }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  userData: {
    type: Object,
    default: () => ({
      src: httpurl('/static/images/personalCenter/beauty.png'),
      userName: 'Username',
      state: 1,
      phoneNumber: '18798092267',
    }),
  },
})

//
function toUserCard() {
  uni.navigateTo({ url: '/pages/me/pages/PersonalData' })
}
</script>

<style lang="scss" scoped>
//
.usercard {
  display: flex;
  align-items: center;
  height: 116px;
  padding: 0 28px;
  background-image: httpurl('/static/images/personalCenter/personalCenterBgi.png');
}

.label-red {
  display: block;
  width: 40px;
  height: 20px;
  font-size: 10px;
  font-weight: 400;
  line-height: 20px;
  color: #b22338;
  text-align: center;
  background: #f7e9eb;
  border: 1px solid #fff;
  border-radius: 6px 6px 6px 1px;
}

.laber-green {
  display: block;
  width: 40px;
  height: 20px;
  font-size: 10px;
  font-weight: 400;
  line-height: 20px;
  color: #75be00;
  text-align: center;
  background: #f1f8e5;
  border: 1px solid #fff;
  border-radius: 6px 6px 6px 1px;
}
</style>
