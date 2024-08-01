/**
 * by 菲鸽 on 2024-03-06
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */
import { useUserStore, loginRoute } from '@/store'
import { getLoginTagPages, loginTagPages as _loginTagPages } from '@/utils'

const isLogined = () => {
  const userStore = useUserStore()
  return userStore.isLogined
}

const isDev = import.meta.env.DEV

// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
const interceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke(arg) {
    const { url = `` } = arg
    const redirectRoute = url.startsWith(loginRoute)
      ? loginRoute
      : `${loginRoute}?redirect=${encodeURIComponent(url)}`
    const path = url.split('?')[0]
    console.log(`invoke`, arg, redirectRoute)
    let loginTagPages: string[] = []
    // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
    if (isDev) {
      loginTagPages = getLoginTagPages()
    } else {
      loginTagPages = _loginTagPages
    }
    const isTag = loginTagPages.includes(path)

    if (import.meta.env.VITE_LOGIN_TAG === `white`) {
      if (isTag) {
        return true
      } else {
        const isLogin = isLogined()
        if (!isLogin) {
          arg.url = redirectRoute
        }
        return true
      }
    } else {
      if (isTag) {
        const isLogin = isLogined()
        if (isLogin) {
          return true
        }
        uni.navigateTo({ url: redirectRoute })
        return false
      }
    }
    return true
  },
}

export const routeInterceptor = {
  install() {
    ;['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack'].forEach((item) =>
      uni.addInterceptor(item, interceptor),
    )
  },
}
