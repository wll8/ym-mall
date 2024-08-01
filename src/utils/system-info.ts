/**
 * 获取编译平台信息
 */
export function getPlatform() {
  let platForm = ''
  // #ifdef APP-PLUS
  platForm = 'App'
  // #endif
  // #ifdef APP
  platForm = 'App'
  // #endif
  // #ifdef H5
  platForm = 'H5'
  // #endif
  // #ifdef MP
  platForm = 'MP'
  // #endif
  return platForm
}

// 判断是否小程序端
export function isMP() {
  if (getPlatform() === 'MP') {
    return true
  }
  return false
}
// 判断是否h5
export function isH5() {
  if (getPlatform() === 'H5') {
    return true
  }
  return false
}
