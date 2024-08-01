<template>
  <view class="gray-card-button">
    <CardButton bg-color="#F5F5F5" color="#999" border-color="#F5F5F5">
      <slot></slot>
    </CardButton>
  </view>
</template>

<script lang="ts" setup>
import CardButton from './card-button.vue'
</script>

<style lang="scss" scoped></style>
