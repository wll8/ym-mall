import { Decimal } from 'decimal.js'

export function createDecimal(num: number) {
  return new Decimal(num)
}
// 加法
export function add(val1: number, val2: number) {
  const dec = createDecimal(val1).add(createDecimal(val2))
  return dec.toNumber()
}

// 减法
export function subtract(val1: number, val2: number) {
  return add(val1, -val2)
}

// 乘法
export function multiply(val1: number, val2: number) {
  const dec = createDecimal(val1).mul(createDecimal(val2))
  return dec.toNumber()
}

// 除法
export function divide(val1: number, val2: number) {
  const dec = createDecimal(val1).div(createDecimal(val2))
  return dec.toNumber()
}

// 平方值计算
export function square(val: number) {
  const dec = createDecimal(val).pow(2)
  return dec.toNumber()
}
// 保留小数位
export function toFloorFixed(val: number, fixed: number = 2) {
  const tmp = Math.pow(10, fixed)
  return Math.floor(val * tmp) / tmp
}
