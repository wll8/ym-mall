<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '供应商订单',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="order page-background">
    <view class="order-list" v-if="showList.length">
      <view class="order-item" v-for="item in showList" :key="item.id">
        <CommodityCard
          :title="`订单编号：${item.orderNo}`"
          :data="item"
          @card-click="toOrderDetail(item)"
          is-hide-price
        />
      </view>
    </view>
    <NoneData v-if="!showList.length" />
  </view>
</template>

<script lang="ts" setup>
import CommodityCard from '@/components/venderOrder-vard/index.vue'

import type { ITab } from '@/components/tabs/type'
import NoneData from '@/components/none-data/index.vue'
import { showToast } from '@/utils/interaction'
import { getOrderByuserId } from '@/service/order'
import { isH5 } from '@/utils/system-info'

const orderFilterFef = ref<any>()

// 得到headerTop定位位置
const headTop = computed(() => {
  if (isH5()) {
    return '44px'
  }
  return 0
})

interface IQueryInfo {
  current: number
  size: number
  orderState?: number
  userId?: IdType
  orderNo?: string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  orderState: null,
  userId: '',
  orderNo: '',
})
let loadData = false

onLoad((options) => {
  if (options.userId) {
    queryInfo.userId = options.userId
  }
  initCurrentData()
})
onShow(() => {
  if (loadData) {
    initCurrentData()
  }
})

const totalPage = ref(0)
const showList = ref<any[]>([])

function getShowList() {
  queryInfo.current += 1
  getOrderByuserId(queryInfo)
    .then((res: any) => {
      loadData = true
      if (queryInfo.current === 1) {
        // 得到总页数
        totalPage.value = Math.ceil(res.data.total / queryInfo.size)

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
// 去订单详情
function toOrderDetail(item) {
  uni.navigateTo({
    url: `/pages/purchase/order/order-detail/index?id=${item.orderId}`,
  })
}
function openFilterOrder() {
  orderFilterFef.value.openShow()
}
</script>

<style lang="scss" scoped>
.page-background {
  padding: 0 24rpx;
}

.header {
  height: 200rpx;

  .fix-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 22;
    height: 200rpx;
  }

  .filter-area {
    display: flex;
    align-items: center;
    height: 108rpx;
    padding: 0rpx 30rpx;
    background-color: #fff;
  }

  .tabs-area {
    position: relative;
    z-index: 10;
    background-color: #f9f9f9;
  }
}

.order-item {
  margin-bottom: 24rpx;
}
</style>
