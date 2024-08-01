<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '投诉信息',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="order">
    <view class="header">
      <view class="header-tap" :style="{ top: headTop }">
        <Tabs :index="currentIndex" :tabs="tabs" @tab-change="changeSearchType" />
      </view>
    </view>
    <view class="order-list" v-if="showList.length">
      <view class="order-item" v-for="item in showList" :key="item.id">
        <view class="flex h-60px items-center">
          <image class="h-60px w-60px bg-current" :src="item.avatar">图片</image>
          <view>
            <view>名称</view>
            <view class="ccctext">投诉时间：{{ item.updateTime }}</view>
          </view>
        </view>
        <view>{{ item.content }}</view>
        <view class="ccctext">联系电话：{{ item.phone }}</view>
        <view class="ccctext">联系地址：{{ item.address }}</view>
        <view class="ccctext" v-if="item.handStatus == '1'">记录:{{ item.handResult }}</view>
        <view class="flex items-center justify-end">
          <view class="callPhone" @click="makePhone(item.phone)">拨打电话</view>
          <view class="finish" v-if="item.handStatus == '1'" @click="orderOver(item.id)">
            处理完成
          </view>
        </view>
        <hr class="hr-solid" />
      </view>
    </view>
    <NoneData v-if="!showList.length" />
    <SelectPaytype v-model:show="selectShow" v-model="payType" @confirm="onConfirmPay" />
  </view>
</template>

<script lang="ts" setup>
import Tabs from '@/components/tabs/index.vue'
import NoneData from '@/components/none-data/index.vue'
import { showToast } from '@/utils/interaction'
import { getOrdercomplain, handlecomplain } from '@/service/order'
import { isH5 } from '@/utils/system-info'

const currentIndex = ref(0)
const tabs = [
  {
    text: '未处理',
    value: 0,
  },
  {
    text: '已处理',
    value: 1,
  },
]

// 立即支付
const selectShow = ref(false)
// 支付类型
const payType = ref(1)
const currentPayInfo = ref<any>({})

// 确认支付
function onConfirmPay() {}
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
  handStatus: number
  orderState?: number | string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  handStatus: 0,
  orderState: null,
})
let loadData = false

onLoad((options) => {
  if (options.type) {
    currentIndex.value = Number(options.type)
    // 通过索引获取类型
    const mapTypes = [null, 1, 3, 4, 5]
    queryInfo.orderState = mapTypes[currentIndex.value]
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
const orderUpdate = ref<any>({
  handStatus: 1,
})
function getShowList() {
  queryInfo.current += 1
  getOrdercomplain(queryInfo)
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
function makePhone(e) {
  uni.makePhoneCall({
    phoneNumber: e,
  })
}
function orderOver(e) {
  uni.showModal({
    title: '解决记录',
    editable: true,
    success: function (res) {
      if (res.confirm) {
        orderUpdate.value.id = e
        orderUpdate.value.handResult = res.content
        handlecomplain(orderUpdate.value)
      }
    },
  })
}
// 改变订单状态
function changeSearchType(info: { index: number; value; any }) {
  queryInfo.handStatus = info.value
  currentIndex.value = info.index
  initCurrentData()
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

// 去订单详情
function toOrderDetail(item) {
  uni.navigateTo({
    url: `/pages/order/order-detail/index?id=${item.id}`,
  })
}
</script>

<style lang="scss">
page {
  box-sizing: border-box;
  padding: 0 24rpx;
  background-color: #f9f9f9;
}

.order {
  font-size: 14px;
}

.ccctext {
  font-size: 12px;
  color: #999;
}

.callPhone {
  width: 100px;
  height: 32px;
  font-size: 12px;
  line-height: 32px;
  color: #b22338;
  text-align: center;
  background: #fff7f8;
  border: 1px solid #b22338;
  border-radius: 16px;
}

.finish {
  width: 100px;
  height: 32px;
  font-size: 12px;
  line-height: 32px;
  color: #fff;
  text-align: center;
  background: #b22338;
  border-radius: 16px;
}

.hr-solid {
  margin: 13px 0;
  border: 0;
  border-top: 1px solid #cbc4c4;
}

.header {
  width: 100%;
  height: 116rpx;

  .header-tap {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 22;
    width: 100%;
    height: 116rpx;
    background-color: #f9f9f9;
  }
}

.order-item {
  margin-bottom: 24rpx;
}

//
</style>
