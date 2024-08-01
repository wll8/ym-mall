import { createSSRApp, ref } from 'vue'
import uvUI from '@climblee/uv-ui'

import App from './App.vue'
import store, { useUserStore } from './store'

import { routeInterceptor, requestInterceptor } from './interceptors'
import registerDirectives from './directives'
import i18n from './locale/index'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import '@/style/index.scss'
import { handleHidePrice } from './utils/handle-hide-price'

// production mock server
// 线上报错，TODO: fix me
// if (import.meta.env.PROD) {
//   import('../mock/_mockProdServer').then(({ setupProdMockServer }) => {
//     console.log('mockProdServer...')
//     setupProdMockServer()
//   })
// }

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.config.globalProperties.userStore = useUserStore()
  app.config.globalProperties.$handleHidePrice = handleHidePrice
  app.use(i18n)
  app.use(uvUI)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(registerDirectives)
  return {
    app,
  }
}
