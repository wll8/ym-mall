import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化
import useAddressStore from './address'
import useGoodsStore from './goods'
import useOrderStore from './order'

import type { App } from 'vue'
import { useLocalLocalData } from '@/hooks/useLoadLcalData'

function registerPinia(app: App<Element>) {
  const store = createPinia()
  app.use(store)
  // 注入Storage
  store.use(
    createPersistedState({
      storage: {
        getItem: uni.getStorageSync,
        setItem: uni.setStorageSync,
      },
    }),
  )
  // 加载本地数据
  useLocalLocalData()
}

export default registerPinia

// 模块统一导出
export * from './user'
export * from './tabbar'
export * from './count'
export * from './html'
export { useAddressStore, useGoodsStore, useOrderStore }
