<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '供应商订单',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="order">
    <view class="order-list" v-if="showList.length">
      <view class="order-item" v-for="item in showList" :key="item.id">
        <template v-if="item.supState == 1">
          <CommodityCard
            :title="`订单编号：${item.orderNo}`"
            :data="item"
            @card-click="toOrderDetail(item)"
            is-hide-price
          />
        </template>
      </view>
    </view>
    <NoneData v-if="!showList.length" />
  </view>
</template>

<script lang="ts" setup>
import CommodityCard from '@/components/venderOrder-vard/index.vue'
import NoneData from '@/components/none-data/index.vue'
import { showToast } from '@/utils/interaction'
import { getOrderByuserId } from '@/service/order'
import { isH5 } from '@/utils/system-info'

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
  orderState?: number
  userId?: string | number
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  orderState: null,
  userId: NaN,
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

// 去订单详情
function toOrderDetail(item) {
  uni.navigateTo({
    url: `/pages/salesman/order/order-detail/index?id=${item.orderId}`,
  })
}
</script>

<style lang="scss">
page {
  box-sizing: border-box;
  padding: 0 24rpx;
  background-color: #f9f9f9;
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
