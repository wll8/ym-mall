<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '我的订单',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="order page-background">
    <view class="header">
      <view class="fix-top" :style="{ top: headTop }">
        <view class="search-area">
          <W-Search
            placeholder="请输入订单编号、商品名称查询"
            v-model="queryInfo.goodsName"
            @search="onSearch"
          />
          <view class="svg-icon si-filter" @click="openFilterOrder" ml1></view>
        </view>
        <view class="tabs-area">
          <TabsV2 :tabs="tabs" is-count @tab-change="changeSearchType" :index="currentIndex" />
        </view>
      </view>
    </view>
    <view class="main">
      <view class="order-list" v-if="showList.length">
        <view class="order-item" v-for="item in showList" :key="item.id">
          <template v-if="String(item.supState) === '1'">
            <CommodityCard
              :title="`订单编号：${item.orderNo}`"
              :data="item"
              @card-click="toOrderDetail"
              :header-option="{ rightColor: '#FEA800', rightText: '待接单' }"
              :buttons="buttons"
            />
          </template>

          <template v-else-if="String(item.supState) === '2'">
            <CommodityCard
              :title="`订单编号：${item.orderNo}`"
              :data="item"
              @card-click="toOrderDetail"
              :header-option="{ rightColor: '#FEA800', rightText: '配送中' }"
            />
          </template>
          <template v-else-if="String(item.supState) === '3'">
            <CommodityCard
              :title="`订单编号：${item.orderNo}`"
              :data="item"
              @card-click="toOrderDetail"
              :header-option="{ rightColor: '#6EB22F', rightText: '已送达' }"
            />
          </template>
          <template v-else-if="String(item.supState) === '4'">
            <CommodityCard
              :title="`订单编号：${item.orderNo}`"
              :data="item"
              @card-click="toOrderDetail"
              :header-option="{ rightColor: '#99999', rightText: '已取消' }"
            />
          </template>
          <template v-else-if="String(item.supState) === '5'">
            <CommodityCard
              :title="`订单编号：${item.orderNo}`"
              :data="item"
              @card-click="toOrderDetail"
              :header-option="{ rightColor: '#FEA800', rightText: '退货退款' }"
            />
          </template>
        </view>
      </view>
      <NoneData v-else />
      <OrderFilter ref="orderFilterFef" @confirm="handleFilter" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import WSearch from '@/components/w-search/index.vue'
import CommodityCard from '@/components/commodity-card/index.vue'
import NoneData from '@/components/none-data/index.vue'
import { ITab } from '@/components/tabs/type'
import { isH5 } from '@/utils/system-info'
import { getOrderCount, getSupplierOrderList, modifyOrderState } from '@/service/order'
import { showToast } from '@/utils/interaction'
import { IButton } from '@/components/goods-card/type'
import { stringToNumber } from '@/utils/string-to-number'

const orderFilterFef = ref<any>()
const tabs = ref<ITab[]>([
  {
    text: '全部',
    value: 0,
  },
  {
    text: '待接单',
    value: 1,
  },
  {
    text: '配送中',
    value: 2,
  },
  {
    text: '已送达',
    value: 3,
  },
  {
    text: '已取消',
    value: 4,
  },
  {
    text: '退货退款',
    value: 5,
  },
])
// 待接单按钮
const buttons: IButton[] = [
  {
    type: 'normal',
    label: '发货',
    click(data) {
      modifyOrderState(data.orderId, 2).then((res) => {
        showToast(res.msg).then(() => {
          initCurrentData()
        })
      })
    },
  },
]

// 得到固定位置
// 得到headerTop定位位置
const headTop = computed(() => {
  if (isH5()) {
    return '44px'
  }
  return 0
})

/**
 * 获取订单统计
 */
function fetchOrderCount() {
  getOrderCount().then((res) => {
    const newTabs = [...tabs.value]
    for (const tab of newTabs) {
      const newItem = res.data.find((item) => stringToNumber(item.supState) === tab.value)
      if (newItem) {
        tab.count = newItem.num
      } else {
        tab.count = ''
      }
    }
    tabs.value = newTabs
  })
}

/**
 * 获取订单列表
 */
interface IQueryInfo {
  current: number
  size: number
  supState?: number
  goodsName?: string
  userId?: string | number
  startTime?: string
  endTime?: string
}
const currentIndex = ref(0)
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  goodsName: '',
  supState: null,
  userId: '',
})

onLoad((options) => {
  if (options.type) {
    currentIndex.value = stringToNumber(options.type)
    queryInfo.supState = stringToNumber(currentIndex.value)
  }
  if (options.userId) {
    queryInfo.userId = options.userId
  }
})

onShow(() => {
  initCurrentData()
})
const totalPage = ref(0)
const showList = ref<any[]>([])
function mapDataList(list: any[]) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const newItem = { ...item }
    item.orderGrouponGoods = [newItem]
    item.paymentAmount = item.costPrice
  }
  return list
}

function getShowList() {
  queryInfo.current += 1
  getSupplierOrderList(queryInfo)
    .then((res: any) => {
      if (queryInfo.current === 1) {
        // 得到总页数
        totalPage.value = Math.ceil(res.data.total / queryInfo.size)
        // 关闭下拉加载
        uni.stopPullDownRefresh()
      }
      showList.value.push(...mapDataList(res.data.records))
    })
    .catch(() => {
      if (queryInfo.current === 1) {
        // 关闭下拉加载
        uni.stopPullDownRefresh()
      }
    })
}

// 改变订单状态
function changeSearchType(info: { index: number; value; any }) {
  queryInfo.supState = info.value === 0 ? '' : info.value
  currentIndex.value = info.index
  initCurrentData()
}

// 初始化获取分页信息
function initCurrentData() {
  fetchOrderCount()
  queryInfo.current = 0
  totalPage.value = 0
  showList.value = []

  getShowList()
}

// 打开筛选
function openFilterOrder() {
  orderFilterFef.value.openShow()
}
/**
 * 搜索订单
 */
function onSearch() {
  initCurrentData()
}
// 过滤订单信息
function handleFilter(info) {
  queryInfo.startTime = info.startTime
  queryInfo.endTime = info.endTime
  initCurrentData()
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
function toOrderDetail(item: any) {
  console.log(item, 'test')
  uni.navigateTo({
    url: `/pages/supplier/order/order-detail/index?id=${item.orderId}`,
  })
}
</script>

<style lang="scss" scoped>
.page-background {
  position: relative;
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

  .search-area {
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

.main {
  padding: 0 24rpx;
}

.order-list {
  margin-top: 24rpx;
}

.order-item {
  margin-bottom: 24rpx;
}
</style>
