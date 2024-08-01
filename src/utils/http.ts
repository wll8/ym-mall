import { CustomRequestOptions } from '@/interceptors/request'
// 添加请求队列拦截重复请求
interface Item {
  [key: string]: Promise<any>
}
const requestQueue: Item = {}

export const http = <T = any>(options: CustomRequestOptions) => {
  const requestId = JSON.stringify(options)
  if (requestQueue[requestId]) {
    return requestQueue[requestId]
  }
  // 1. 返回 Promise 对象
  requestQueue[requestId] = new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        // 模拟任务操作完成后在删除
        setTimeout(() => {
          delete requestQueue[requestId]
        }, 300)

        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as IResData<T>)
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as IResData<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        delete requestQueue[requestId]
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
  return requestQueue[requestId]
}

// uni.uploadFile封装
export const uniFileUpload = <T = any>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.uploadFile({
      ...options,
      // 响应成功
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 文件上传接口的rea.data的类型为string，这里转一下
          const resData = JSON.parse(res.data) as IResData<T>
          resolve(resData)
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: '文件上传错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
