<template>
  <view class="footer-button-card-wrap">
    <view
      class="footer-button-card"
      :style="{ justifyContent: displayPosition, backgroundColor: bgColor }"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface IProps {
  postion?: 'left' | 'right' | 'center'
  bgColor?: string
}
const props = withDefaults(defineProps<IProps>(), {
  postion: 'right',
  bgColor: '#fff',
})

const displayPosition = computed(() => {
  switch (props.postion) {
    case 'left':
      return 'flex-start'
    case 'right':
      return 'flex-end'
    case 'center':
      return 'center'
    default:
      return ''
  }
})
</script>

<style lang="scss" scoped>
.footer-button-card-wrap {
  height: 116rpx;
}

.footer-button-card {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 116rpx;
  padding: 0 32rpx;
}
</style>
