import { Store } from 'pinia'
import { type useUserStoreType } from './store'

type TestReturnType = ReturnType<typeof useUserStore>

export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    userStore: useUserStoreType
    $handleHidePrice: () => boolean
  }
  type Hooks = App.AppInstance & Page.PageInstance
  interface ComponentCustomOptions extends Hooks {
    $uv?: any
  }
}

declare global {
  interface Uni {
    $uv?: any
  }
}
