<template>
  <view class="select-paytype">
    <WBottomDrawer :modelValue="show" @update:modelValue="changeShow">
      <view class="content">
        <CellRadios
          :options="paytypeOptions"
          :model-value="modelValue"
          @update:modelValue="changeModelValue"
        />
      </view>
      <CommonButton @click="onConfirm">确定</CommonButton>
    </WBottomDrawer>
  </view>
</template>

<script lang="ts" setup>
import type { ICellRadiosOptions } from '@/components/cell-radios/type'
interface IProps {
  modelValue?: number // 选中索引
  show?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  selectOptions: () => [],
  modelValue: 1,
  show: false,
})
const paytypeOptions: ICellRadiosOptions = [
  {
    icon: 'alipay',
    label: '支付宝支付',
    value: 1,
  },
  {
    icon: 'wechat',
    label: '微信支付',
    value: 2,
  },
]

const emit = defineEmits(['update:modelValue', 'update:show', 'confirm'])
// 改变显示
function changeShow(value: boolean) {
  emit('update:show', value)
}
// 改变显示模块
function changeModelValue(value: any) {
  emit('update:modelValue', value)
}
// 点击确定
function onConfirm() {
  changeShow(false)
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.content {
  padding: 40rpx 0;
}
</style>
