// 判断字符串是否数字
export function isNumber(val: string) {
  return !isNaN(Number(val))
}

// 将字符串转换为数字
export function stringToNumber(val?: string | number) {
  if (!val) return 0
  if (typeof val === 'string') {
    if (isNumber(val)) return Number(val)
    return 0
  }
  return val
}
