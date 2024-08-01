<template>
  <view class="count-card">
    <view class="card-header flex items-center justify-between mx15px mb3">
      <view class="header-title" flex items-center>
        {{ title }}
        <view class="reset" flex items-center @click="resetStartTime" ml2 text-sm>
          重置时间
          <uni-icons type="refresh" size="24"></uni-icons>
        </view>
      </view>
      <view class="header-right" @click="startDateRef.open()" flex items-center>
        {{ showTime || '请选择时间' }}
        <uni-icons type="right" size="16" ml20rpx></uni-icons>
      </view>
    </view>
    <wd-card class="card" v-if="cellList.length">
      <view class="card-content flex">
        <view class="card-item flex" v-for="(item, index) in cellList" :key="index">
          <view :class="`card-icon svg-icon si-${item.icon}`"></view>
          <view class="item-right">
            <view class="item-title">{{ item.title }}</view>
            <view class="item-count" :style="{ color: item.countColor ?? '#239443' }">
              {{ item.count }}
            </view>
          </view>
        </view>
      </view>
    </wd-card>
    <uv-datetime-picker
      ref="startDateRef"
      mode="date"
      :value="startTime"
      @update:modelValue="changeTime"
    />
  </view>
</template>
<script lang="ts" setup>
import { fmtTime } from '@/utils/format-time'

interface CellListItem {
  title: string // 标签名
  icon: string //  图标
  count?: number // 数量
  countColor?: string
}
const emit = defineEmits(['search'])
withDefaults(
  defineProps<{
    title?: string
    link?: string
    cellList?: CellListItem[]
  }>(),
  {
    cellList: () => [],
    myOrdersItem: () => [],
    orderLink: '',
    title: '',
    subTitle: '',
  },
)
const showTime = ref('')
const startTime = ref(Number(new Date()))
const startDateRef = ref<any>()

function resetStartTime() {
  showTime.value = ''
  startTime.value = Number(new Date())
  emit('search', {
    startTime: showTime.value,
  })
}

function changeTime(value) {
  startTime.value = value
  showTime.value = fmtTime(value)
  emit('search', {
    startTime: showTime.value,
  })
}
</script>
<style lang="scss" scoped>
.header-title {
  font-size: 32rpx;
  font-weight: bold;
}

.header-right {
  font-size: 24rpx;
  color: #999;
}

.reset {
  color: #999;
}

.card-item {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.card-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 10rpx;
}

.item-right {
  .item-title {
    font-size: 24rpx;
    font-weight: bold;
    color: #333;
  }

  .item-count {
    margin-top: 10rpx;
    font-size: 40rpx;
    font-weight: bold;
    color: #239443;
  }
}
</style>
