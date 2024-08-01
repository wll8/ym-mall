<template>
  <view class="w-search">
    <uni-easyinput
      :inputBorder="false"
      :style="{ color: '#333' }"
      suffixIcon="search"
      :value="modelValue"
      :placeholder="placeholder"
      @update:modelValue="changeValue"
      @iconClick="iconClick"
    ></uni-easyinput>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  placeholder?: string
  modelValue?: string
  bgcolor?: string
}
const props = withDefaults(defineProps<IProps>(), {
  bgcolor: '#f5f5f5',
})
const emit = defineEmits(['search', 'update:modelValue'])
function iconClick() {
  emit('search', props.modelValue)
}
function changeValue(value: string) {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.w-search {
  width: 100%;
  padding: 0 30rpx;
  overflow: hidden;
  background: v-bind(bgcolor);
  border-radius: 34rpx;
  /* stylelint-disable-next-line selector-class-pattern */
  :deep(.uni-easyinput__content) {
    background: v-bind(bgcolor) !important;
  }
}
</style>
