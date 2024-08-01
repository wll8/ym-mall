import { isH5 } from '@/utils/system-info'

export function useComInfo() {
  /**
   * 由于在app或者小程序使用默认navbar是不占定位高度的
   * 如何使用css的position:fixed，需要计算navbar的高度
   */
  const positionTop = computed(() => {
    return isH5() ? 44 : 0
  })

  return {
    positionTop,
  }
}
