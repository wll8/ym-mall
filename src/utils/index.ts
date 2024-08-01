import pagesJson from '@/pages.json'
import { loginRoute, useUserStore, useTabbarStore, useHtmlStore } from '@/store'
import { translate as t } from '@/locale/index'
import * as qs from 'qs'
import { log } from 'console'

const isLogined = () => {
  const userStore = useUserStore()
  return userStore.isLogined
}

console.log(pagesJson)

/**
 * 判断是否为空值
 * @param {*} value 要判断的值
 */
export function isEmpty(value) {
  return [NaN, null, undefined, '', [], {}].some((emptyItem) =>
    typeof value === `string` && value
      ? false
      : JSON.stringify(value) === JSON.stringify(emptyItem),
  )
}

/**
 * 删除空值
 * @param {object} obj 要处理的数据
 */
export function removeEmpty(obj) {
  return JSON.parse(JSON.stringify(obj), (key, value) => {
    if (isEmpty(value) === false && Array.isArray(value)) {
      value = value.filter((v) => !isEmpty(v))
    }
    return isEmpty(value) ? undefined : value
  })
}

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = () => {
  if (!Object.keys(pagesJson).includes('tabBar')) {
    return false
  }
  const pages = getCurrentPages()
  const lastPage = getLastItem(pages)
  const currPath = lastPage.route
  return !!pagesJson.tabBar.list.find((e) => e.pagePath === currPath)
}

export const sleep = (time = 1000) => {
  // eslint-disable-next-line promise/param-names
  return new Promise((res, rej) => setTimeout(res, time))
}

/**
 * test i18n in not .vue file
 */
export const testI18n = () => {
  console.log(t('app.name'))
  // 下面同样生效
  uni.showModal({
    title: 'i18n 测试',
    content: t('app.name'),
  })
}
/**
 * 获取当前页面路由的 path 路劲和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
  const pages = getCurrentPages()
  console.log('pages:', pages)

  const lastPage = getLastItem(pages)
  const currRoute = (lastPage as any).$page
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute as { fullPath: string }
  console.log(fullPath)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return getUrlObj(fullPath)
}

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  const [path, queryStr] = url.split('?')
  console.log(path, queryStr)

  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    console.log(key, value)
    query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  })
  return { path, query }
}
/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 loginTag, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'loginTag') => {
  // 这里处理主包
  const pages = [
    ...pagesJson.pages
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  // 这里处理分包
  const subPages: any[] = []
  pagesJson.subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...pages, ...subPages]
  console.log(`getAllPages by ${key} result: `, result)
  return result
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getLoginTagPages = (): string[] => getAllPages('loginTag').map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const loginTagPages: string[] = getAllPages('loginTag').map((page) => page.path)

/** 主要是处理 arr.at(-1) 在安卓机上运行报错的 兼容性问题 */
export const getArrElementByIdx = (arr: any[], index: number) => {
  if (index < 0) return arr[arr.length + index]
  if (index >= arr.length) return undefined
  return arr[index]
}

export const getLastItem = (arr: any[]) => getArrElementByIdx(arr, -1)

export const httpurl = (path: string) => {
  const baseURL = import.meta.env.VITE_SERVER_STATIC_BASEURL
  const isFullUrl = /^(http:\/\/|https:\/\/)/i.test(path)
  const isBase64 = /^data:image\/[a-zA-Z]+;base64,/i.test(path)

  if (isFullUrl || isBase64) {
    return path
  }
  return baseURL + path
}

export const checkLogin = () => {
  return (fn = () => {}) => {
    const isLogin = isLogined()
    if (isLogin) {
      return fn
    } else {
      const pages = getCurrentPages()
      const lastPage = getLastItem(pages) || {}
      const currRoute = lastPage.$page
      if (!currRoute || currRoute.path !== loginRoute) {
        // redirect时都需要 encodeURIComponent 一下，否则获取到的参数不对
        const query = qs.stringify({
          redirect: currRoute ? encodeURIComponent(currRoute.fullPath) : ``,
        })
        const redirectRoute = `${loginRoute}?${query}`
        uni.redirectTo({ url: redirectRoute })
      }
      return () => false
    }
  }
}

export const toHome = (isCloseAll = false) => {
  const userStore = useUserStore()
  // 执行回调函数/跳转
  const pages = getCurrentPages()
  const lastPage = getLastItem(pages)
  const currRoute = lastPage.$page
  if (currRoute.options) {
    if (currRoute.options.redirect === 'index') {
      console.log(currRoute.options.redirect)
      uni.redirectTo({ url: userStore.userInfo.indexPage })
    } else {
      uni.redirectTo({
        url: currRoute.options.redirect || userStore.userInfo.indexPage,
      })
    }
  } else {
    if (isCloseAll) {
      uni.reLaunch({ url: userStore.userInfo.indexPage })
    } else {
      uni.redirectTo({ url: userStore.userInfo.indexPage })
    }
  }
}

export const viewHtml = (cb) => {
  const htmlStore = useHtmlStore()
  htmlStore.reset()
  uni.navigateTo({
    url: `/pages/notice/index`,
    async success(res) {
      const data = await cb()
      htmlStore.setHtml(data)
    },
  })
}
