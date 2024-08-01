import { subtract, toFloorFixed } from '@/utils/math'

export default function useRefuseInfo(form) {
  const orderInfo = ref<any>({})
  function changeOrderInfo(value) {
    orderInfo.value = value
  }
  const refuseAmount = computed(() => {
    console.log(form.type)
    return toFloorFixed(
      subtract(
        Number(orderInfo.value.paymentAmount),
        Number(String(form.type) === '10' ? orderInfo.value.returnPostage : 0),
      ),
    )
  })
  // 退款运费
  const returnPostage = computed(() => {
    return String(form.type) === '10' ? orderInfo.value.returnPostage : 0
  })
  return {
    changeOrderInfo,
    refuseAmount,
    returnPostage,
  }
}
