<template>
  <GrayCardButton
    @click.stop="cancelRefund(data)"
    style="margin-right: 16rpx"
    v-if="data.orderState == 6 && buttonType === 'normal'"
  >
    取消退款
  </GrayCardButton>
  <CommonButton
    color="#666"
    bg-color="#f5f5f5"
    @click.stop="cancelRefund(data)"
    style="margin-right: 16rpx"
    v-if="data.orderState == 6 && buttonType === 'bottom'"
  >
    取消退款
  </CommonButton>
</template>
<script lang="ts" setup>
import { cancelOrderReturn } from '@/service/order'
const emit = defineEmits<{
  (event: 'finished'): void
}>()
withDefaults(
  defineProps<{
    data: any
    buttonType?: 'normal' | 'bottom'
  }>(),
  {
    buttonType: 'normal',
  },
)

function cancelRefund(item: any) {
  // uniapp showModal
  uni.showModal({
    title: '提示',
    content: '是否确认取消退款申请',
    success(res) {
      if (res.confirm) {
        //
        cancelOrderReturn(item.id).then((res) => {
          if (res.code === 200) {
            emit('finished')
          }
        })
      }
    },
  })
}
</script>
<style lang="scss" scoped></style>
