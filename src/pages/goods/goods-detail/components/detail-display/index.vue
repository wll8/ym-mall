<template>
  <view class="detail-display">
    <view class="header">
      <view class="title">详情</view>
    </view>
    <view class="content-card">
      <template v-if="isString">
        <!-- // todo 使用了此组件后，运行 `pnpm build:h5` 会出现 `[unocss] failed to load icon "-"` -->
        <uv-parse :content="data"></uv-parse>
      </template>
      <template v-else>
        <image :src="item.path" class="img" mode="widthFix" v-for="item in imgs" :key="item.id" />
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  data?: string
  imgs?: FileInfo[]
  isString?: boolean
}
withDefaults(defineProps<IProps>(), {
  data: '',
  imgs: () => [],
  isString: false,
})
</script>

<style lang="scss" scoped>
.detail-display {
  margin-top: 24rpx;
}

.header {
  padding-top: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 40rpx;
  color: #333;
  background-color: #fff;

  .title {
    position: relative;
    padding-left: 32rpx;

    &::after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 12rpx;
      height: 28rpx;
      margin: auto 0;
      content: '';
      background-color: #dd5468;
      border-radius: 0 4rpx 4rpx 0rpx;
    }
  }
}

.content-card {
  width: 100%;

  .img {
    width: 100%;
  }
}
</style>
