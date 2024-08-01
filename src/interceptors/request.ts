/* eslint-disable no-param-reassign */
import * as qs from 'qs'
import { useUserStore, loginRoute } from '@/store'
import { removeEmpty } from '@/utils'

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基地址
const baseURL = import.meta.env.VITE_SERVER_BASEURL
console.log(`baseURL`, baseURL)

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 接口请求支持通过 query 参数配置 queryString
    options.data = options.data ? removeEmpty(options.data) : options.data
    if (options.query) {
      const queryStr = qs.stringify(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }
    // api 目前为 mock 接口，所以无需处理
    if (!options.url.startsWith('http')) {
      // 1. 非 http 开头需拼接地址
      options.url = baseURL + options.url
    }
    // 2. 请求超时
    options.timeout = 10000 // 10s
    // 3. 添加小程序端请求头标识
    options.header = {
      platform: 'mp-weixin', // 可选值与 uniapp 定义的平台一致，告诉后台来源
      ...options.header,
    }
    // 4. 添加 token 请求头标识
    const userStore = useUserStore()
    const { authorization, tenantId, accessToken } = userStore.auth
    accessToken && (options.header[`Blade-Auth`] = `Bearer ${accessToken}`)
    authorization && (options.header.Authorization = authorization)
    tenantId && (options.header[`Tenant-Id`] = tenantId)
  },
  success(res) {
    const code = res.data.code || res.statusCode
    // 状态码 2xx，
    if (code >= 200 && code < 300) {
      // todo 转换数据
    } else if (code === 401) {
      // 401错误  -> 清理用户信息，跳转到登录页
      const userStore = useUserStore()
      userStore.clearUserInfo()
      uni.navigateTo({ url: loginRoute })
    } else {
      // 其他错误 -> 根据后端错误信息轻提示
      uni.showToast({
        icon: 'none',
        title: res.data.msg || '请求错误',
      })
    }
  },
  // 响应失败
  fail(err) {
    console.log(`err`, err)
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
