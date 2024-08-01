<template>
  <view class="dict-select">
    <wd-select-picker
      label-key="dictValue"
      value-key="dictKey"
      type="radio"
      :modelValue="modelValue"
      @update:modelValue="handleConfirm"
      :columns="columns"
      :readonly="readonly"
      :disabled="disabled"
    ></wd-select-picker>
  </view>
</template>
<script lang="ts" setup>
import { queryDictListByCode } from '@/service/dict'

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
  code: string
  modelValue?: string | number
  disabled?: boolean
  readonly?: boolean
}>()
const columns = ref<any>([])
if (props.code) {
  queryDictListByCode(props.code).then((res) => {
    columns.value = res.data
  })
}

function handleConfirm(value) {
  emit('update:modelValue', value)
}
</script>
<style lang="scss" scoped></style>
