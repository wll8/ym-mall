<template>
  <view class="w-bottom-drawer" v-if="modelValue">
    <view class="drawer">
      <view class="close" @click="onClose">
        <view class="svg-icon si-close"></view>
      </view>
      <view class="title" v-if="title">{{ title }}</view>
      <view class="content">
        <slot></slot>
      </view>
    </view>
    <div class="mask" @click="onClose"></div>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  modelValue: boolean
  title?: string
}
const emit = defineEmits(['update:modelValue'])
function onClose() {
  emit('update:modelValue', false)
}
withDefaults(defineProps<IProps>(), {
  modelValue: false,
})
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  /* stylelint-disable-next-line order/properties-order */
  right: 0;
  /* stylelint-disable-next-line order/properties-order */
  top: 0;
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  bottom: 0;
  z-index: 999;
  background-color: rgb(0 0 0 / 20%);
}

.drawer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  padding: 32rpx 30rpx;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;

  .title {
    font-size: 28rpx;
    font-weight: bold;
    text-align: center;
  }
}

.content {
  max-height: 80vh;
  overflow-y: auto;
}

.close {
  position: absolute;
  top: 32rpx;
  right: 24rpx;
  bottom: 0;
  width: 28rpx;
  height: 28rpx;
  cursor: pointer;
}
</style>
