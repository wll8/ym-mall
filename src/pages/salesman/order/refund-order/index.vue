<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '退款订单',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="order page-background">
    <view class="header">
      <view class="header-tap" :style="{ top: headTop }">
        <Tabs :tabs="tabs" @tab-change="changeSearchType" />
      </view>
    </view>
    <view class="order-list" v-if="showList.length">
      <view class="order-item" v-for="item in showList" :key="item.id">
        <GoodsCard
          :data="item"
          :header-info="{
            title: `订单编号：${item.orderNo}`,
            rightColor: '#999999',
            rightText: '申请中',
          }"
          @card-click="toOrderDetail(item)"
        >
          <template #footer>
            <view class="buttons">
              <!-- <CardButton @click.stop="resetBuy(item)">同意</CardButton>
              <CardButton @click.stop="resetBuy(item)">拒绝</CardButton> -->
            </view>
          </template>
        </GoodsCard>
      </view>
    </view>
    <NoneData v-if="!showList.length" />
  </view>
</template>

<script lang="ts" setup>
import Tabs from '@/components/tabs/index.vue'
import CommodityCard from '@/components/commodity-card/index.vue'
import type { ITab } from '@/components/tabs/type'
import NoneData from '@/components/none-data/index.vue'
import { showToast } from '@/utils/interaction'
import { getOrderList } from '@/service/order'
import { isH5 } from '@/utils/system-info'

const tabs: ITab[] = [
  {
    text: '申请中',
    value: 0,
  },
  {
    text: '已通过',
    value: 1,
  },
  {
    text: '已拒绝',
    value: 2,
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
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  orderState: null,
  userId: '',
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
</script>

<style lang="scss" scoped>
.page-background {
  padding: 0 24rpx;
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
</style>
