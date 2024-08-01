import { defineStore } from 'pinia'
import { CACHE_ADDRESSINFO } from './constants'
import { getDefaultAddress } from '@/service/order'
import { useUserStore } from '../user'

export interface IAddressInfo {
  id: string | number
  address: string
  description: string
  phone: string
  isDefault: boolean
  latitude: number
  longitude: number
}
interface IAddressState {
  current: any // 当前地址
}

const useAddressStore = defineStore('Address', {
  state: (): IAddressState => ({
    current: {},
  }),
  actions: {
    // 改变当前地址
    changeCurrentAction(addressInfo: any) {
      this.saveCurrentAddressAction()
      this.current = addressInfo
    },
    // 加载默认地址
    loadDefaultAddressInfo() {
      const userStore = useUserStore()
      if (!userStore.userInfo) return
      const userInfo: any = userStore.userInfo
      getDefaultAddress(userInfo.user_id as IdType).then((res) => {
        const defaultAddressInfo = res.data
        if (defaultAddressInfo) {
          this.changeCurrentAction(defaultAddressInfo)
        } else {
          this.changeCurrentAction({})
        }
      })
    },
    // 存储地址信息
    saveCurrentAddressAction() {
      uni.setStorageSync(CACHE_ADDRESSINFO, this.current)
    },
    // 加载本地地址信息
    loadLocalDataAction() {
      const addressInfo = uni.getStorageSync(CACHE_ADDRESSINFO)
      if (addressInfo) {
        this.current = addressInfo
      }
    },
  },
})

export default useAddressStore
