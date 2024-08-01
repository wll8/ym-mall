import { defineStore } from 'pinia'
import { ref } from 'vue'

export const loginRoute = '/pages/login/index' // 默认的登录页面
export const noLoginStartPage = '/pages/preload/preload' // 未登录时，进入哪个页面

const baseUserInfo = () =>
  ({
    nickname: '',
    avatar: '',
    indexPage: ``,
  }) as IUserInfo
const baseAuth = () => ({
  authorization: '',
  tenantId: '',
  accessToken: '',
})
const userInfo = ref<IUserInfo>(baseUserInfo())
const auth = ref(baseAuth())

export const useUserStore = defineStore(
  'user',
  () => {
    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = {
        ...userInfo.value,
        ...val,
      }
    }
    const setAuth = (val) => {
      auth.value = {
        ...auth.value,
        ...val,
      }
    }

    const clearUserInfo = () => {
      userInfo.value = baseUserInfo()
      auth.value = baseAuth()
    }
    const isLogined = computed(() => !!auth.value.accessToken)

    return {
      userInfo,
      auth,
      setAuth,
      setUserInfo,
      clearUserInfo,
      isLogined,
    }
  },
  {
    persist: true,
  },
)

export type useUserStoreType = ReturnType<typeof useUserStore>
