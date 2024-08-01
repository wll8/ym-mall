<template>
  <view class="filter-modal" v-if="modelValue">
    <view class="mask" @click="changeModalValue(false)"></view>
    <view class="modal-content">
      <view class="modal-top">
        <view class="content-title">{{ title }}</view>
        <view class="modal-close svg-icon si-close" @click="changeModalValue(false)"></view>
      </view>
      <view class="modal-main">
        <slot></slot>
      </view>
      <view class="modal-bottom">
        <view class="buttons" flex>
          <view class="btn-reset" @click.stop="handleReset()" flex-1>重置</view>
          <view class="btn-confirm" @click.stop="handleConfirm" flex-1>确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const emit = defineEmits(['confirm', 'reset', 'update:modelValue'])
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
  }>(),
  {
    title: '订单筛选',
  },
)
function handleReset() {
  emit('reset')
}
function handleConfirm() {
  emit('confirm')
}
function changeModalValue(value: boolean) {
  console.log('进入了可', value)
  emit('update:modelValue', value)
}
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
  /* stylelint-disable-next-line alpha-value-notation */
  background-color: rgb(0 0 0 / 0.2);
}

.modal-content {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
}

.modal-top {
  position: relative;
  padding: 20rpx;

  .content-title {
    font-size: 36rpx;
    color: #444;
    text-align: center;
  }

  .modal-close {
    position: absolute;
    top: 10rpx;
    right: 20rpx;
  }
}

.modal-main {
  padding: 20rpx;
}

.modal-bottom {
  padding: 20rpx;
  box-shadow: 0 0 10rpx rgb(0 0 0 / 10%);
}

.buttons {
  overflow: hidden;
  border-radius: 40rpx;
}

.btn-reset,
.btn-confirm {
  line-height: 80rpx;
  color: #fff;
  text-align: center;
}

.btn-reset {
  background-color: #fea800;
}

.btn-confirm {
  background-color: #b42b3e;
}
</style>
