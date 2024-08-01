<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'http 图片',
  },
}
</route>

<template>
  <view class="">
    <strong>以简便的方式使用网络图片，处理微信无法使用本地文件作为背景图的情况</strong>
    <div>img 标签</div>
    <img class="img" :src="httpurl('/static/logo.svg')" alt="" />
    <div>背景图</div>
    <div class="img bg"></div>
  </view>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
.img {
  width: 100px;
  height: 100px;

  &.bg {
    background: httpurl('/static/logo.svg');
  }
}
</style>
