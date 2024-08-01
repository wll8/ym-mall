<route lang="json5" type="page">
{
  loginTag: true,
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="uv-content">
    <!-- // todo 使用了此组件后，运行 `pnpm build:h5` 会出现 `[unocss] failed to load icon "-"` -->
    <uv-parse :content="data.content"></uv-parse>
  </view>
</template>

<script lang="js" setup>
import { useHtmlStore } from '@/store'
import { storeToRefs } from 'pinia'

const data = ref(storeToRefs(useHtmlStore()).html)

watch(
  () => data.value.title,
  (title) => {
    uni.setNavigationBarTitle({ title })
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.uv-content {
  padding: 24rpx;
}
</style>
