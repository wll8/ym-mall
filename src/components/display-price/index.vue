<template>
  <view class="display-price" :style="{ marginLeft }">
    ¥
    <view class="num">{{ value || 0 }}</view>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  value?: number | string
  marginLeft?: string
}
withDefaults(defineProps<IProps>(), {
  marginLeft: '12rpx',
})
</script>

<style lang="scss" scoped>
.display-price {
  display: flex;
  align-items: flex-end;
  margin-left: 12rpx;
  font-weight: bold;
  color: #b22338;

  .num {
    margin-left: 4rpx;
    font-size: 36rpx;
  }
}
</style>
