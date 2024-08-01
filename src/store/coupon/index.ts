import { defineStore } from 'pinia'
import { CACHE_COUPON_INFO } from './constants'

interface ICouponState {
  couponInfo: any
}

const useCouponStore = defineStore('Coupon', {
  state: (): ICouponState => ({
    couponInfo: {},
  }),
  actions: {
    // 改变商家信息
    changeCouponInfoAction(info: any) {
      this.couponInfo = info
      uni.setStorageSync(CACHE_COUPON_INFO, info)
    },
    // 加载storage的businessInfo
    loadLocalCouponInfoAction() {
      const couponInfo = uni.getStorageSync(CACHE_COUPON_INFO)
      if (couponInfo) {
        this.couponInfo = couponInfo
      }
    },
  },
})

export default useCouponStore
