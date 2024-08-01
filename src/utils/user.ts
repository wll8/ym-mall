import { useUserStore } from '@/store'
export function getUserInfo() {
  const userStore = useUserStore()
  return userStore.userInfo
}
export function getUserId() {
  const userInfo = getUserInfo()
  return userInfo.user_id
}
