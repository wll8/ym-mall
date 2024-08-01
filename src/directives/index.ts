import type { App } from 'vue'
import { useUserStore } from '@/store'
export default function registerDirectives(app: App<Element>) {
  // 需要判断用户是否有能够查看价格的权限，没有绑定业务的的用户不能查看价格
  app.directive('hidePrice', {
    mounted(el) {
      // 获取store隐藏价格
      const { userInfo } = useUserStore()
      if (userInfo.registerState == null) {
        return
      }
      if (String(userInfo.registerState) === '10') {
        el.innerHtml = ''
      }
    },
  })
}
