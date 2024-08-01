<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '商品浏览器记录',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="goods-records page-background">
    <view class="main">
      <view class="records" :data-data="showList.length">
        <view class="records-item" v-for="item in showList" :key="item.id">
          <RecordCard
            :coverSrc="item.goodsInfo.goodsCover"
            :goodsName="item.goodsInfo.goodsName"
            :browseNumber="item.times"
            @click="toGoodsDetail(item.goodsInfo.id)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// functions

import { showToast } from '@/utils/interaction'
import { getGoodsBrowseInfos } from '@/service/salesman'

// components
import RecordCard from './components/record-card.vue'

/**
 * 获取订单列表
 */
interface IQueryInfo {
  current: number
  size: number
  userId?: string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  userId: '',
})

const totalPage = ref(0)
const total = ref(0)
const showList = ref<any[]>([])

// functions

function getShowList() {
  queryInfo.current += 1
  getGoodsBrowseInfos(queryInfo)
    .then((res: any) => {
      if (queryInfo.current === 1) {
        // 得到总页数
        totalPage.value = Math.ceil(res.data.total / queryInfo.size)
        total.value = res.data.total
        // 关闭下拉加载
        uni.stopPullDownRefresh()
      }
      showList.value.push(...res.data.records)
    })
    .catch(() => {
      if (queryInfo.current === 1) {
        // 关闭下拉加载
        uni.stopPullDownRefresh()
      }
    })
}
// 初始化获取分页信息
function initCurrentData() {
  queryInfo.current = 0
  totalPage.value = 0
  showList.value = []
  getShowList()
}

onLoad((options) => {
  if (options.userId) {
    queryInfo.userId = options.userId
    initCurrentData()
  }
})
/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  if (queryInfo.current > totalPage.value - 1) {
    showToast('没有下一页数据！')
    return
  }
  getShowList()
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

// 去商品详情
function toGoodsDetail(id) {
  uni.navigateTo({
    url: '/pages/salesman/goods-detail/index?id=' + id,
  })
}
</script>

<style lang="scss" scoped>
.goods-records {
  padding: 0 24rpx;
}

.records-item {
  margin-top: 20rpx;
}
</style>
