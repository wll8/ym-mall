<template>
  <view class="date-range">
    <view class="date-range-content" flex items-center>
      <uv-input
        type="text"
        placeholder="开始时间"
        flex-1
        v-model="form.startDate"
        readonly
        @click="startDateRef.open()"
      />
      <view class="to" mx1>-</view>
      <uv-input
        flex-1
        type="text"
        placeholder="结束时间"
        @click="endDateRef.open()"
        v-model="form.endDate"
        readonly
      />
    </view>
    <uv-datetime-picker
      ref="startDateRef"
      mode="date"
      :value="startDate"
      :maxDate="showMaxDate"
      @update:modelValue="changeStartDate"
    ></uv-datetime-picker>
    <uv-datetime-picker
      ref="endDateRef"
      mode="date"
      :value="endDate"
      :maxDate="showMaxDate"
      @update:modelValue="changeEndDate"
    ></uv-datetime-picker>
  </view>
</template>
<script lang="ts" setup>
import { fmtTime } from '@/utils/format-time'
const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: { startDate: string; endDate: string }): void
}>()
const props = withDefaults(
  defineProps<{
    modelValue: string[]
    maxDate?: string
  }>(),
  {
    maxDate: '',
  },
)

const startDateRef = ref<any>()
const endDateRef = ref<any>()

const startDate = ref<any>(Number(new Date()))
const endDate = ref<any>(Number(new Date()))

const form = ref({
  startDate: '',
  endDate: '',
})
const showMaxDate = computed(() => {
  return props.maxDate ? new Date(props.maxDate).getTime() : Number(new Date())
})
// 重置值
watchEffect(() => {
  const dateArray = props.modelValue
  if (dateArray && dateArray.length) {
    startDate.value = new Date(dateArray[0]).getTime()
    form.value.startDate = dateArray[0]
    if (dateArray[1]) {
      endDate.value = new Date(dateArray[1]).getTime()
      form.value.endDate = dateArray[1]
    } else {
      endDate.value = Number(new Date())
    }
  } else {
    form.value.startDate = ''
    form.value.endDate = ''
    startDate.value = Number(new Date())
    endDate.value = Number(new Date())
  }
})
watch(
  () => form.value,
  (val) => {
    emit('update:modelValue', [val.startDate, val.endDate])
  },
  {
    deep: true,
  },
)
function handleChange() {
  emit('change', form.value)
}
// 改变开始时间
function changeStartDate(value) {
  form.value.startDate = fmtTime(value)
  handleChange()
}
// 改变结束时间
function changeEndDate(value) {
  form.value.endDate = fmtTime(value)
  handleChange()
}

defineExpose({
  reset() {
    form.value = {
      startDate: '',
      endDate: '',
    }
  },
})
</script>
<style lang="scss" scoped></style>
