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
    <navbar-fix-top>
      <view class="tabs-area">
        <TabsV2 :tabs="tabs" @tab-change="changeSearchType" :index="currentIndex" />
      </view>
    </navbar-fix-top>
    <view class="order-list" v-if="showList.length">
      <view class="order-item" v-for="item in showList" :key="item.id">
        <template v-if="item.orderState === 1">
          <GoodsCard
            :data="item"
            :header-info="{
              title: `订单编号：${item.orderNo}`,
              rightColor: '#FEA800',
              rightText: '待付款',
            }"
            @card-click="toOrderDetail(item)"
          >
            <template #footer>
              <view class="buttons">
                <GrayCardButton @click.stop="handleCancelOrder(item)" mr-2>取消订单</GrayCardButton>
                <CardButton @click.stop="handlePlayClick(item)">立即付款</CardButton>
              </view>
            </template>
          </GoodsCard>
        </template>
        <template v-else-if="item.orderState === 3 || item.orderState === 2">
          <GoodsCard
            :data="item"
            :header-info="{
              title: `订单编号：${item.orderNo}`,
              rightColor: '#FEA800',
              rightText: '待收货',
            }"
            @card-click="toOrderDetail(item)"
          >
            <template #footer>
              <view class="buttons">
                <CardButton
                  @click.stop="openRefoundRequest(item)"
                  borderColor="#7d5b28"
                  color="#e6a23c"
                  bgColor="#fdf6ec"
                  style="margin-right: 16rpx"
                >
                  申请退款
                </CardButton>
                <CardButton @click.stop="confirmReceipt(item)">确认收货</CardButton>
              </view>
            </template>
          </GoodsCard>
        </template>
        <template v-else-if="item.orderState === 4">
          <GoodsCard
            :data="item"
            :header-info="{
              title: `订单编号：${item.orderNo}`,
              rightColor: '#6EB22F',
              rightText: '已完成',
            }"
            @card-click="toOrderDetail(item)"
          >
            <template #footer>
              <view class="buttons">
                <CardButton
                  @click.stop="openRefoundRequest(item)"
                  borderColor="#7d5b28"
                  color="#e6a23c"
                  bgColor="#fdf6ec"
                  style="margin-right: 16rpx"
                  v-if="item.orderState != 6"
                >
                  申请退款
                </CardButton>
                <CardButton @click.stop="resetBuy(item)" flex-1>再次购买</CardButton>
                <CardButton
                  style="margin-left: 16rpx"
                  v-if="item.invoiceHeaderState == 0"
                  @click.stop="RequestInvoice(item)"
                  flex-1
                >
                  申请发票
                </CardButton>
              </view>
            </template>
          </GoodsCard>
        </template>
        <template v-else-if="item.orderState === 5">
          <GoodsCard
            :title="`订单编号：${item.orderNo}`"
            :data="item"
            :header-info="{
              title: `订单编号：${item.orderNo}`,
              rightColor: '#999999',
              rightText: '已取消',
            }"
            @card-click="toOrderDetail(item)"
          >
            <template #footer>
              <view class="buttons">
                <CardButton @click.stop="resetBuy(item)">再次购买</CardButton>
              </view>
            </template>
          </GoodsCard>
        </template>
        <template v-else-if="item.orderState === 6 || item.orderState === 7">
          <GoodsCard
            :data="item"
            :header-info="{
              title: `订单编号：${item.orderNo}`,
              rightColor: '#999999',
              rightText: item.orderState === 6 ? '退款中' : '已退款',
            }"
            @card-click="toOrderDetail(item)"
          >
            <template #footer>
              <view class="buttons">
                <CancelRefund :data="item" @finished="initCurrentData" />
                <CardButton @click.stop="resetBuy(item)">再次购买</CardButton>
              </view>
            </template>
          </GoodsCard>
        </template>
      </view>
    </view>
    <NoneData v-if="!showList.length" />
    <SelectPaytype v-model:show="selectShow" v-model="payType" @confirm="onConfirmPay" />
    <!-- 退货弹窗 -->
    <RefundApplication ref="refundApplicationRef" @finished="initCurrentData" />
  </view>
</template>

<script lang="ts" setup>
import type { ITab } from '@/components/tabs/type'
import NoneData from '@/components/none-data/index.vue'
import { showToast } from '@/utils/interaction'
import RefundApplication from '../components/refund-application.vue'
import CancelRefund from '../components/cancel-refund.vue'

import {
  cancelOrder,
  sureReceipt,
  getAPayInfo,
  getWPayInfo,
  payment,
  RequestAnInvoice,
  userOrderReturn,
} from '@/service/order'
import { useLoadDataList } from '@/hooks/useLoadDataList'

const refundApplicationRef = ref<InstanceType<typeof RefundApplication>>()

const currentIndex = ref(0)
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
    text: '退款中',
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

interface IQueryInfo {
  orderState?: number
  orderNo?: IdType
  startTime?: string
  endTime?: string
}
const queryInfo = reactive<IQueryInfo>({
  orderState: null,
})
const {
  dataList: showList,
  initCurrentData,
  isLoadData,
} = useLoadDataList(queryInfo, {
  url: '/v1/order/getOrderPage',
})

onLoad((options) => {
  if (options.type) {
    currentIndex.value = tabs.findIndex((item) => item.value === Number(options.type))
    // 通过索引获取类型
    queryInfo.orderState = Number(options.type) || null
  }
  initCurrentData()
})
onShow(() => {
  if (isLoadData.value) {
    initCurrentData()
  }
})

// 改变订单状态
function changeSearchType(info: { index: number; value; any }) {
  queryInfo.orderState = info.value === 0 ? '' : info.value
  currentIndex.value = info.index
  initCurrentData()
}

// 立即支付
const selectShow = ref(false)
// 支付类型
const payType = ref(1)
const currentPayInfo = ref<any>({})

// 确认支付
async function onConfirmPay() {
  const { orderNo } = currentPayInfo.value
  try {
    let payResult: any = {}
    if (payType.value === 1) {
      payResult = await getAPayInfo(orderNo)
    } else {
      payResult = await getWPayInfo(orderNo)
    }
    if (payResult.data) {
      await payment(payType.value, payResult.data)
      uni.showModal({
        title: '提示',
        content: '支付成功',
        showCancel: false,
        success: () => {
          initCurrentData()
        },
      })
    } else {
      // 测试
      uni.showModal({
        title: '提示',
        content: '支付成功',
        showCancel: false,
        success: () => {
          initCurrentData()
        },
      })
    }
  } catch (error) {
    console.log(error)
    uni.showModal({
      title: '提示',
      content: '支付失败',
      showCancel: false,
    })
  }
}

// 去订单详情
function toOrderDetail(item) {
  uni.navigateTo({
    url: `/pages/order/order-detail/index?id=${item.id}`,
  })
}
// 取消订单
function handleCancelOrder(data) {
  cancelOrder(data.id).then((res) => {
    if (res.code === 200) {
      showToast('取消订单成功！')
      initCurrentData()
    }
  })
}
// 立即付款
function handlePlayClick(data) {
  selectShow.value = true
  currentPayInfo.value = data
}

// 再次购买
function resetBuy(data) {
  const goodsId = data?.orderGrouponGoods?.[0]?.goodsId
  uni.navigateTo({ url: '/pages/goods/goods-detail/index?id=' + goodsId })
}
// 申请发票
function RequestInvoice(item) {
  const data = {
    id: item.id,
    invoiceHeaderState: '1',
  }
  RequestAnInvoice(data).then((res) => {
    if (res.code === 599) {
      uni.showToast({
        icon: 'none',
        title: '检测到没有发票抬头 即将跳转',
        duration: 2000,
      })
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/me/pages/InvoiceTitle`,
        })
      }, 2000)
    } else {
      initCurrentData()
      uni.showToast({
        icon: 'none',
        title: '申请成功',
        duration: 2000,
      })
    }
  })
}

// 确认收货
function confirmReceipt(data) {
  sureReceipt(data.id).then((res) => {
    if (res.code === 200) {
      showToast(res.msg)
      initCurrentData()
    }
  })
}
// 退货
function openRefoundRequest(item) {
  if (String(item.supState) === '1') {
    uni.showModal({
      title: '提示',
      content: '未发货，直接退款是否确定',
      success(res) {
        if (res.confirm) {
          userOrderReturn({
            orderId: item.id,
          }).then((res) => {
            if (res.code === 200) {
              showToast('提交成功')
              initCurrentData()
            }
          })
        }
      },
    })
  } else {
    refundApplicationRef.value.open(item)
  }
}
</script>

<style lang="scss" scoped>
.page-background {
  box-sizing: border-box;
  padding: 0 24rpx;
  background-color: #f9f9f9;
}

.tabs-area {
  background-color: #f9f9f9;
}

.order-item {
  margin-bottom: 24rpx;
}

//
.buttons {
  display: flex;
}
</style>
