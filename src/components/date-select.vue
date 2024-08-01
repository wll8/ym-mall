<template>
  <view class="date-select">
    <view class="date-range-content" flex items-center>
      <uv-input
        type="text"
        :placeholder="title"
        :modelValue="modelValue"
        readonly
        w-full
        @click="startDateRef.open()"
      />
    </view>
    <uv-datetime-picker
      ref="startDateRef"
      mode="date"
      :value="modelValue"
      @update:modelValue="changeStartDate"
    ></uv-datetime-picker>
  </view>
</template>
<script lang="ts" setup>
import { fmtTime } from '@/utils/format-time'
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
defineProps<{
  modelValue: string
  title: string
}>()
const startDateRef = ref<any>()

// 改变开始时间
function changeStartDate(value) {
  emit('update:modelValue', fmtTime(value))
}

defineExpose({
  reset() {
    emit('update:modelValue', '')
  },
})
</script>
<style lang="scss" scoped>
.date-range-content {
  width: 200rpx;
}
</style>
