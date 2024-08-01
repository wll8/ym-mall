<template>
  <view class="custom-checked" @click="changeValue">
    <view class="svg-icon si-radio-active" h32rpx w32rpx v-if="modelValue" />
    <view class="svg-icon si-radio" h32rpx w32rpx v-else />
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  modelValue?: string | number
}
const props = defineProps<IProps>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function changeValue() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style lang="scss" scoped></style>
