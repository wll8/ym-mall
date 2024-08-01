export interface ICardOption {
  rightColor: string
  rightText: string
}
export interface ICardOptions {
  [index: number]: ICardOption
  [index: string]: ICardOption
}
