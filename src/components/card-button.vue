<template>
  <button
    class="card-button reset-button"
    :style="{ borderColor, color, backgroundColor: bgColor, height, borderRadius, width }"
    :disabled="disabled"
    :class="{ 'disabled-button': disabled }"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
interface IProps {
  borderColor?: string
  color?: string
  bgColor?: string
  height?: string | number
  borderRadius?: string
  width?: string
  disabled?: boolean
}
withDefaults(defineProps<IProps>(), {
  borderColor: '#B22338',
  color: '#B22338',
  bgColor: '#FFF7F8',
  height: '64rpx',
  borderRadius: '32rpx',
  width: 'auto',
  disabled: false,
})
</script>

<style lang="scss" scoped>
/* 清除按钮的默认样式 */
.reset-button {
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  cursor: pointer;
  background-color: transparent;
  border: none;
  box-shadow: none;
}
/* 清除按钮的hover和active状态 */
.reset-button:hover,
.reset-button:active,
.reset-button:focus {
  outline: none;
  box-shadow: none;
}
/* 清除按钮的伪元素 */
.reset-button::before,
.reset-button::after {
  display: none;
}

.disabled-button {
  opacity: 0.5;
}

.card-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  padding: 0 52rpx;
  font-size: 24rpx;
  border: 2rpx solid transparent;
  border-radius: 32rpx;
}
</style>
