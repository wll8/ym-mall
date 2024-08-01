import { defineStore } from 'pinia'
export const useTabbarStore = defineStore(
  'tabbar',
  () => {
    const tabbarHeightValue = 56
    const tabBarList = ref([])
    const tabbarHeight = ref(tabbarHeightValue)
    const tabIndex = ref(0)
    const isHide = ref(false)

    const hideByPage = () => {
      isHide.value = true
      onUnload(() => {
        isHide.value = false
      })
    }

    watch(isHide, () => {
      if (isHide.value) {
        tabbarHeight.value = 0
      } else {
        tabbarHeight.value = tabbarHeightValue
      }
    })

    return {
      hideByPage,
      isHide,
      tabBarList,
      tabbarHeight,
      tabIndex,
    }
  },
  {
    persist: {
      paths: [`tabBarList`, `tabbarHeight`, `tabIndex`],
    },
  },
)

export type useTabbarStoreType = ReturnType<typeof useTabbarStore>
