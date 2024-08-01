import { defineStore } from 'pinia'
import { CACHE_BUSINESS_INFO } from './constants'

interface IBusinessState {
  businessInfo: any
}

const useBusinessStore = defineStore('Business', {
  state: (): IBusinessState => ({
    businessInfo: {},
  }),
  actions: {
    // 改变商家信息
    changeBusinessInfoAction(info: any) {
      this.businessInfo = info
      uni.setStorageSync(CACHE_BUSINESS_INFO, info)
    },
    // 加载storage的businessInfo
    loadLocalBusinessInfoAction() {
      const businessInfo = uni.getStorageSync(CACHE_BUSINESS_INFO)
      if (businessInfo) {
        this.businessInfo = businessInfo
      }
    },
  },
})

export default useBusinessStore
