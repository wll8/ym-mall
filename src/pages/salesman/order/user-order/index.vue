<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '用户订单',
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
        <view class="filter-area">
          <W-Search placeholder="请输入订单编号" v-model="queryInfo.orderNo" @search="onSearch" />
          <view class="svg-icon si-filter" @click="openFilterOrder" ml1></view>
        </view>
        <view class="tabs-area">
          <TabsV2 :tabs="tabs" @tab-change="changeSearchType" />
        </view>
      </view>
    </view>
    <view class="order-list" v-if="showList.length">
      <view class="order-item" v-for="item in showList" :key="item.id">
        <template v-if="item.orderState === 1">
          <CommodityCardV3
            :title="`订单编号：${item.orderNo}`"
            :data="item"
            :header-option="{ rightColor: '#FEA800', rightText: '待付款' }"
            @card-click="toOrderDetail"
          />
        </template>
        <template v-else-if="item.orderState === 3">
          <CommodityCardV3
            :title="`订单编号：${item.orderNo}`"
            :data="item"
            :header-option="{ rightColor: '#FEA800', rightText: '待收货' }"
            @card-click="toOrderDetail"
          />
        </template>
        <template v-else-if="item.orderState === 4">
          <CommodityCardV3
            :title="`订单编号：${item.orderNo}`"
            :data="item"
            :header-option="{ rightColor: '#6EB22F', rightText: '已完成' }"
            @card-click="toOrderDetail"
          />
        </template>
        <template v-else-if="item.orderState === 5">
          <CommodityCardV3
            :title="`订单编号：${item.orderNo}`"
            :data="item"
            :header-option="{ rightColor: '#999999', rightText: '已取消' }"
            @card-click="toOrderDetail"
          />
        </template>
        <template v-else-if="item.orderState === 6">
          <CommodityCardV3
            :title="`订单编号：${item.orderNo}`"
            :data="item"
            :header-option="{ rightColor: '#999999', rightText: '退货中' }"
            @card-click="toOrderDetail"
          ></CommodityCardV3>
        </template>
        <template v-else-if="item.orderState === 7">
          <CommodityCardV3
            :title="`订单编号：${item.orderNo}`"
            :data="item"
            :header-option="{ rightColor: '#999999', rightText: '已退款' }"
            @card-click="toOrderDetail"
          ></CommodityCardV3>
        </template>
      </view>
    </view>
    <NoneData v-if="!showList.length" />
    <OrderFilter ref="orderFilterFef" @confirm="handleFilter" />
  </view>
</template>

<script lang="ts" setup>
import type { ITab } from '@/components/tabs/type'
import NoneData from '@/components/none-data/index.vue'
import { showToast } from '@/utils/interaction'
import { getOrderList } from '@/service/order'
import { isH5 } from '@/utils/system-info'

const orderFilterFef = ref<any>()
const tabs: ITab[] = [
  {
    text: '全部',
    value: 0,
  },
  {
    text: '待付款',
    value: 1,
  },
  {
    text: '待收货',
    value: 3,
  },
  {
    text: '售后订单',
    value: 6,
  },
  {
    text: '已退款',
    value: 7,
  },
  {
    text: '已完成',
    value: 4,
  },
]

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
  startTime?: string
  endTime?: string
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
  getOrderList(queryInfo)
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

// 改变订单状态
function changeSearchType(info: { index: number; value; any }) {
  queryInfo.orderState = info.value === 0 ? '' : info.value
  initCurrentData()
}

// 初始化获取分页信息
function initCurrentData() {
  queryInfo.current = 0
  totalPage.value = 0
  showList.value = []
  getShowList()
}
// 搜索订单信息
function onSearch(value) {
  queryInfo.orderNo = value
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
function toOrderDetail(item) {
  uni.navigateTo({
    url: `/pages/salesman/order/order-detail/index?id=${item.id}`,
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
