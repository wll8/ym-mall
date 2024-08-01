import { ICellBasicProps } from '../common-cell/type'

export interface ICellsCardColumn extends ICellBasicProps {
  prop: string
  hide?: boolean
  isColumn?: boolean
}
export type ICellsCardColumns = ICellsCardColumn[]
