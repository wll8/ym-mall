import { dayjs } from 'wot-design-uni'
export function fmtShowTime(time: number) {
  time = time ?? 0
  if (time <= 0) {
    return '0分钟0秒'
  }
  return dayjs(time).format('mm分钟ss秒')
}

export function fmtTime(time: number | string | Date, format: string = 'YYYY-MM-DD') {
  time = time ?? 0
  return dayjs(time).format(format)
}

//
export function getDateByDay(day: number = -1) {
  const today = new Date()
  const date = new Date(today)
  date.setDate(date.getDate() + day)
  return date
}
