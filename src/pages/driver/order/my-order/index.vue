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
            placeholder="订单号、商品名、收货人、手机号查询"
            v-model="queryInfo.goodsName"
            @search="onSearch"
          />
          <view class="svg-icon si-filter" @click="openFilterOrder" ml1></view>
        </view>
        <view class="tabs-area">
          <Tabs :tabs="tabs" :is-count="true" @tab-change="changeSearchType" />
        </view>
      </view>
    </view>
    <view class="main">
      <view class="order-list" v-if="showList.length">
        <view class="order-item" v-for="item in showList" :key="item.id">
          <template v-if="String(item.driverState) === '1'">
            <CommodityCard
              :title="`订单编号：${item.orderNo}`"
              :data="item"
              :checked="isChecked(item)"
              @card-click="toOrderDetail"
              :header-option="{ rightColor: '#FEA800', rightText: '待配送' }"
              @select-change="changeChecked"
              :buttons="cardTypeButtons['1']"
              :is-hide-price="true"
              :is-checked="true"
              :is-buy-info="true"
            />
          </template>
          <template v-else-if="String(item.driverState) === '2'">
            <CommodityCard
              :title="`订单编号：${item.orderNo}`"
              :data="item"
              :checked="isChecked(item)"
              @card-click="toOrderDetail"
              :header-option="{ rightColor: '#FEA800', rightText: '配送中' }"
              @select-change="changeChecked"
              :buttons="cardTypeButtons['2']"
              :is-hide-price="true"
              :is-checked="true"
              :is-buy-info="true"
            />
          </template>
          <template v-else-if="String(item.driverState) === '3'">
            <CommodityCard
              :title="`订单编号：${item.orderNo}`"
              :data="item"
              :checked="isChecked(item)"
              @card-click="toOrderDetail"
              :header-option="{ rightColor: '#6EB22F', rightText: '已送达' }"
              @select-change="changeChecked"
              :is-hide-price="true"
              :is-buy-info="true"
            />
          </template>
        </view>
      </view>
      <NoneData v-else />
    </view>
    <view class="operate">
      <view
        class="svg-icon si-delivery"
        @click="driverMoreSend"
        v-if="queryInfo.driverState === 1"
      ></view>
      <view
        class="svg-icon si-service"
        @click="driverMoreServed"
        v-else-if="queryInfo.driverState === 2"
      ></view>
    </view>
    <CompleteDelivery v-model:show="show" @confirm="onConfirm" />
    <OrderFilter ref="orderFilterFef" @confirm="handleFilter" />
  </view>
</template>

<script lang="ts" setup>
import WSearch from '@/components/w-search/index.vue'
import Tabs from '@/components/tabs/index.vue'
import CommodityCard from '@/components/commodity-card-v2/index.vue'
import NoneData from '@/components/none-data/index.vue'
import { ITab } from '@/components/tabs/type'
import { isH5 } from '@/utils/system-info'
import { driverSend, getDriverOrderList, getDriverOrderNumber } from '@/service/order'
import { showToast } from '@/utils/interaction'
import type { IButton, ISelectChangeValue } from '@/components/goods-card/type'
import { stringToNumber } from '@/utils/string-to-number'

const orderFilterFef = ref<any>()
const tabs = ref<ITab[]>([
  {
    text: '待配送',
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
])

// 完成配送弹出框
const show = ref(false)
// 完成配送类型
const servedType = ref(1)
// 完成配送当前数据
const finishDriverData = ref<any>({})
interface ICardTypeButtons {
  [index: string]: IButton[]
}
const cardTypeButtons: ICardTypeButtons = {
  1: [
    {
      type: 'normal',
      label: '开始配送',
      click(data) {
        driverSend([data.orderId]).then((res) => {
          if (res.code === 200) {
            initCurrentData()
          }
        })
      },
    },
  ],
  2: [
    {
      type: 'normal',
      label: '完成配送',
      click(data) {
        finishDriverData.value = data
        servedType.value = 1
        show.value = true
      },
    },
  ],
}
/**
 * 获取订单统计
 */
function fetchOrderCount() {
  getDriverOrderNumber().then((res) => {
    const newTabs = [...tabs.value]
    for (const tab of newTabs) {
      const newItem = res.data.find(
        (item) =>
          stringToNumber(item.supState) === tab.value && stringToNumber(item.supState) !== 3,
      )
      if (newItem) {
        tab.count = newItem.num
      } else {
        tab.count = ''
      }
    }
    tabs.value = newTabs
  })
}

// 选择中列表
const goodsSelectList = ref<any[]>([])
// 判断是否选择
const isChecked = (value) => {
  const index = goodsSelectList.value.findIndex((item) => item.orderId === value.orderId)
  return index !== -1
}
// 改变选中
const changeChecked = (info: ISelectChangeValue) => {
  const { check, value } = info
  const isCheckedIndex = goodsSelectList.value.findIndex((item) => item.orderId === value.orderId)
  if (check) {
    if (isCheckedIndex === -1) {
      goodsSelectList.value.push(value)
    }
  } else {
    if (isCheckedIndex !== -1) {
      // 从数组中移除
      goodsSelectList.value.splice(isCheckedIndex, 1)
    }
  }
}

// 得到固定位置
// 得到headerTop定位位置
const headTop = computed(() => {
  if (isH5()) {
    return '44px'
  }
  return 0
})
/**
 * 获取订单列表
 */
interface IQueryInfo {
  current: number
  size: number
  driverState?: number
  goodsName?: string
  startTime?: string
  endTime?: string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  driverState: 1,
  goodsName: '',
  startTime: '',
  endTime: '',
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
// 判断onShow是否要重新加载数据
let isFirstLocalData = false
onShow(() => {
  if (isFirstLocalData && !show.value) initCurrentData()
})
function getShowList() {
  queryInfo.current += 1
  getDriverOrderList(queryInfo)
    .then((res: any) => {
      isFirstLocalData = true
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
// 初始化获取分页信息
function initCurrentData() {
  queryInfo.current = 0
  totalPage.value = 0
  showList.value = []
  goodsSelectList.value = []
  fetchOrderCount()
  getShowList()
}
initCurrentData()

// 改变配送状态
function changeSearchType(info: { index: number; value; any }) {
  queryInfo.driverState = info.value
  initCurrentData()
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
  uni.navigateTo({
    url: `/pages/driver/order/order-detail/index?id=${item.orderId}`,
  })
}

/**
 * 多个订单开始配送
 */
function driverMoreSend() {
  if (!showList.value || showList.value.length === 0) {
    showToast('没有订单不能配送！')
    return
  }
  if (goodsSelectList.value.length === 0) {
    uni.showModal({
      title: '提示',
      content: '未选中订单，订单不能配送',
      showCancel: false,
    })
  } else {
    uni.showModal({
      title: '提示',
      content: '将要对订单进行发货，确定选中订单是否正确',
      success(res: any) {
        if (res.confirm) {
          const ids = goodsSelectList.value.map((item) => item.orderId)
          driverSend(ids).then((res) => {
            if (res.code === 200) {
              showToast(res.msg)
              initCurrentData()
            }
          })
        }
      },
    })
  }
}
// 打开图片填写
function driverMoreServed() {
  if (!showList.value || showList.value.length === 0) {
    showToast('没有订单不能送达！')
    return
  }
  show.value = true
  servedType.value = 2
}

// 确定配送
function onConfirm(imgsList: string[]) {
  if (servedType.value === 1) {
    driverSend([finishDriverData.value.orderId], imgsList, '3').then((res) => {
      if (res.code === 200) {
        showToast(res.msg)
        initCurrentData()
      }
    })
  } else {
    if (goodsSelectList.value.length === 0) {
      uni.showModal({
        title: '提示',
        content: '未选中订单，订单不能一键送达',
        showCancel: false,
      })
    } else {
      uni.showModal({
        title: '提示',
        content: '将要对订单进行一键送达，确定选中订单是否正确',
        success(res: any) {
          if (res.confirm) {
            const ids = goodsSelectList.value.map((item) => item.orderId)
            driverSend(ids, imgsList, '3').then((res) => {
              if (res.code === 200) {
                showToast(res.msg)
                initCurrentData()
              }
            })
          }
        },
      })
    }
  }
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

.operate {
  .svg-icon {
    position: fixed;
    right: 8rpx;
    bottom: 170rpx;
    width: 140rpx;
    height: 140rpx;
  }
}
</style>
