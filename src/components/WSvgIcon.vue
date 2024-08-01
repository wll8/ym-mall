<template>
  <template v-if="name">
    <view :class="`svg-icon si-${name}`" :style="{ height, width }"></view>
  </template>
</template>

<script lang="ts" setup name="SvgIcon">
withDefaults(
  defineProps<{
    name: string
    height?: string
    width?: string
  }>(),
  {
    name: '',
    height: '24rpx',
    width: '24rpx',
  },
)
</script>
