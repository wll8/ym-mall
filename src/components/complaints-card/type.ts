export interface IButton<TData = any> {
  type: 'normal' | 'gray' // 默认按钮与灰色按钮
  label: string // 按钮标题
  click: (data: TData) => void
}

export interface ISelectChangeValue<T = any> {
  check: boolean
  value: T
}
