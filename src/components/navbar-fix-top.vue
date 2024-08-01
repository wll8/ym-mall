<template>
  <view class="navbar-fix-top" :style="{ height: height }">
    <!-- h5的navbar会占用一定高度，需要减去top进行固定 -->
    <view class="fix-top" :style="{ height: height, top: `${positionTop}px` }">
      <slot></slot>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { useComInfo } from '@/hooks/useComInfo'
const { positionTop } = useComInfo()
withDefaults(
  defineProps<{
    height?: string
  }>(),
  {
    height: '108rpx',
  },
)
</script>
<style lang="scss" scoped>
.fix-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 22;
}
</style>
