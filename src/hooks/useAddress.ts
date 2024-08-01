import { useAddressStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
function useAddress(addressChange?: (addressInfo: any) => void) {
  const addressStore = useAddressStore()
  const { current } = storeToRefs(addressStore)

  // 去选择地址
  function toChooseAddress() {
    uni.navigateTo({
      url: '/pages/me/pages/Address?type=choseAddress',
    })
  }
  const detailAddress = computed(() => {
    const address = current.value.addressAllName
      ? `${current.value.addressAllName ?? ''} ${current.value.detail ?? ''}`
      : ''
    return address
  })
  // 选择地址方法
  function changeAddress(data: any) {
    addressChange && addressChange(data.current)
    addressStore.changeCurrentAction(data.current)
  }

  onMounted(() => {
    // 选择地址
    uni.$on('getAddress', changeAddress)
  })
  // // 移除事件防止内存泄漏
  // onUnmounted(() => {
  //   uni.$off('getAddress', changeAddress)
  // })
  return {
    toChooseAddress,
    current,
    detailAddress,
    changeAddress,
    changeCurrentAction(info: any) {
      addressStore.changeCurrentAction(info)
    },
    loadDefaultAddress() {
      addressStore.loadDefaultAddressInfo()
    },
  }
}
export default useAddress
