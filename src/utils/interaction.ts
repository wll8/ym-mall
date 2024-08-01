/**
 * 对uni交互方法进行二次封装
 */

export function showToast(title: string, options: UniApp.ShowToastOptions = {}) {
  return new Promise((resolve, reject) => {
    uni.showToast({
      title,
      duration: 2000,
      icon: 'none',
      ...options,
      success(res) {
        resolve(res)
      },
      fail(error) {
        reject(error)
      },
    })
  })
}
