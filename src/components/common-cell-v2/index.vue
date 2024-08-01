<template>
  <view
    class="common-cell-v2"
    :style="{ color }"
    :class="{ 'common-cell-border': isBorder, 'is-padding': isPadding }"
  >
    <view class="cell-left">
      <slot name="left"></slot>
    </view>
    <view class="cell-right">
      <slot name="right">
        <slot name="right"></slot>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  isBorder?: boolean
  color?: string
  isPadding?: boolean
}
withDefaults(defineProps<IProps>(), {
  isBorder: false,
  color: '#333',
  isPadding: true,
})
</script>

<style lang="scss" scoped>
.common-cell-v2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0rpx;
  font-size: 28rpx;
  background-color: #fff;
}

.is-padding {
  padding-right: 32rpx;
  padding-left: 32rpx;
}

.common-cell-border {
  border-bottom: 2rpx solid #eee;
}

.cell-left {
  flex: 1;
}
</style>
