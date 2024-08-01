export interface ICellRadiosOption {
  icon: string
  label: string
  value?: string | number
}
export type ICellRadiosOptions = ICellRadiosOption[]
export interface IChangeValue<T = any> {
  index: number
  value: T
}
