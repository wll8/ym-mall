import { useUserStore } from '@/store'

export default function toBindInvitaionCode() {
  // 获取store隐藏价格
  const { userInfo } = useUserStore()
  if (userInfo.registerState == null) {
    return true
  }
  if (String(userInfo.registerState) === '10') {
    uni.showModal({
      title: '提示',
      content: '请先绑定邀请码，才能进行其余操作',
      success: function (res) {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/me/pages/PersonalData?isInviteCode=trues',
          })
        }
      },
    })

    return false
  }
  return true
}
