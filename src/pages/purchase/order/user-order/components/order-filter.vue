<template>
  <view class="order-filter">
    <filter-modal v-model="show" title="订单筛选" @click="handleConfirm">
      <view class="filter-item">
        <view class="filter-item-title">下单时间</view>
        <view class="filter-item-content">
          <date-range v-model="form.startDate" />
        </view>
      </view>
    </filter-modal>
  </view>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'confirm', value: any): void
}>()
const show = ref(false)
const form = reactive<any>({
  startDate: [],
  endDate: '',
})
const handleConfirm = () => {
  emit('confirm', {})
}
defineExpose({
  openShow() {
    show.value = true
  },
})
</script>

<style lang="scss" scoped>
.filter-item-title {
  margin-bottom: 15rpx;
  font-weight: bold;
}
</style>
