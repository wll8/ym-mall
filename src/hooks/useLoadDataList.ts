import { http } from '@/utils/http'
import { showToast } from '@/utils/interaction'
export interface LoadDateListConfig {
  size?: number // 尺寸大小, 默认为10
  // 请求地址
  url: string
  type?: 'normal' | 'special'
}
interface IQueryInfo {
  current: number
  size: number
  [key: string]: any
}

// 请求
function fetchData(url: string, queryInfo: IQueryInfo, type = 'normal') {
  if (type === 'normal') {
    return http({
      url,
      method: 'GET',
      data: queryInfo,
    })
  } else {
    const { current, size, ...otherInfo } = queryInfo
    return http({
      url,
      method: 'POST',
      query: { current, size },
      data: otherInfo,
    })
  }
}

// 加载数据列表，并且自动实现上拉加载和下拉加载
export function useLoadDataList<T = any, O = any>(searchInfo: T, config: LoadDateListConfig) {
  const { size = 10, url, type = 'normal' } = config
  const queryInfo = ref<IQueryInfo>({
    current: 0,
    size,
  })
  const dataList = ref<O[]>([])
  // 判断是否已经请求过
  const isLoadData = ref(false)
  // 是否处于加载中的状态
  const isLoading = ref(false)
  // 记录总共数量
  const totalPage = ref(0)
  // 判断是否加载完成
  const isLoaded = computed(() => {
    return queryInfo.value.current >= totalPage.value
  })
  // 获取数据
  function getDataList() {
    queryInfo.value.current += 1
    isLoading.value = true
    const info = { ...queryInfo.value, ...searchInfo }
    fetchData(url, info, type)
      .then((res) => {
        isLoading.value = false
        isLoadData.value = true
        if (queryInfo.value.current === 1) {
          // 得到总页数
          totalPage.value = Math.ceil(res.data.total / queryInfo.value.size)
          // 关闭下拉加载
          uni.stopPullDownRefresh()
        }
        dataList.value.push(...res.data.records)
      })
      .catch(() => {
        if (queryInfo.value.current === 1) {
          // 关闭下拉加载
          uni.stopPullDownRefresh()
        }
        isLoading.value = false
      })
  }

  // 初始化获取分页信息
  function initCurrentData() {
    queryInfo.value.current = 0
    totalPage.value = 0
    dataList.value = []
    getDataList()
  }

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(() => {
    if (queryInfo.value.current > totalPage.value - 1) {
      showToast('没有下一页数据！')
      return
    }
    getDataList()
  })
  /**
   * 页面下拉刷新
   */
  onPullDownRefresh(() => {
    uni.startPullDownRefresh({
      success() {
        initCurrentData()
      },
    })
  })
  return {
    dataList,
    isLoaded,
    isLoading,
    totalPage,
    isLoadData,
    initCurrentData,
    getDataList,
  }
}
