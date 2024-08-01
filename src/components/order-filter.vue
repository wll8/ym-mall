<template>
  <view class="order-filter">
    <filter-modal v-model="show" title="订单筛选" @reset="handleReset" @confirm="handleConfirm">
      <view class="filter-item">
        <view class="filter-item-title">下单时间</view>
        <view class="filter-item-content">
          <button-radio-group
            :list="[
              { label: '昨天', value: yesterday },
              { label: '今天', value: todayDate },
            ]"
            v-model="form.startTime"
            @change="handleStartTimeChange"
          />
          <date-range v-model="form.startDate" @change="handleDateChange" />
        </view>
      </view>
    </filter-modal>
  </view>
</template>

<script lang="ts" setup>
import { fmtTime, getDateByDay } from '@/utils/format-time'

const emit = defineEmits<{
  (e: 'confirm', value: any): void
}>()
const todayDate = fmtTime(new Date())

// 获取昨天的日期
const yesterday = ref(fmtTime(getDateByDay()))

const show = ref(false)
const form = reactive<any>({
  startTime: '',
  startDate: [],
})
// 处理时间变化
const handleStartTimeChange = () => {
  form.startDate = []
}
// 处理时间变化
const handleDateChange = () => {
  form.startTime = ''
}
const handleConfirm = () => {
  const startTime = form.startTime || form.startDate[0]
  const info = {
    startTime,
    endTime: form.startDate[1] || startTime,
  }
  show.value = false
  emit('confirm', info)
}
// 重置表单
function handleReset() {
  form.startDate = []
  form.startTime = ''
}
defineExpose({
  openShow() {
    show.value = true
  },
})
</script>

<style lang="scss" scoped>
.filter-item {
  margin-bottom: 200rpx;
}

.filter-item-title {
  margin-bottom: 15rpx;
  font-weight: bold;
}
</style>
