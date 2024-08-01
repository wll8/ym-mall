<template>
  <view class="common-cell">
    <view class="cell-left">{{ label }}</view>
    <view class="cell-right">
      <template v-if="type === 'custom'">
        <slot :name="slotName" :value="value"></slot>
      </template>
      <template v-else-if="type === 'showprice'">
        <view class="showprice">
          {{ value || 0 }}
        </view>
      </template>
      <template v-else>
        <view class="cell-right-content">
          {{ value }}
        </view>
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  type?: 'normal' | 'custom' | 'showprice'
  label: string
  slotName?: string
  value?: string | number
}
defineProps<IProps>()
</script>

<style lang="scss" scoped>
.common-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #666;
}

.showprice {
  font-size: 28rpx;
  font-weight: bold;
  color: #b22338;
}
</style>
