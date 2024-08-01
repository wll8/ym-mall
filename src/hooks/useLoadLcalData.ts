import { useAddressStore, useOrderStore } from '@/store'
import useBusinessStore from '@/store/business'
import useCouponStore from '@/store/coupon'
// 加载本地数据
export function useLocalLocalData() {
  useOrderStore().loadLocalDataAction()
  useAddressStore().loadLocalDataAction()
  useBusinessStore().loadLocalBusinessInfoAction()
  useCouponStore().loadLocalCouponInfoAction()
}
