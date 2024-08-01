import { useUserStore } from '@/store'
export function handleHidePrice() {
  // 获取store隐藏价格
  const { userInfo } = useUserStore()
  if (userInfo.registerState == null) {
    return true
  }
  if (String(userInfo.registerState) === '10') {
    return false
  }
  return true
}
