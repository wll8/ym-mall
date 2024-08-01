<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '订单详情',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="orderdetail page-background">
    <template v-if="orderInfo.orderState === 1">
      <OrderStatusCard icon="time" text="等待付款">剩余：{{ fmtShowTime(time) }}</OrderStatusCard>
    </template>
    <template v-else-if="orderInfo.orderState === 3">
      <OrderStatusCard icon="time" text="待收货" />
    </template>
    <template v-if="orderInfo.orderState === 4">
      <OrderStatusCard icon="has-success" color="#75BE00" text="已完成" />
    </template>
    <template v-if="orderInfo.orderState === 5">
      <OrderStatusCard icon="cancel" text="已取消" />
    </template>
    <template v-if="orderInfo.orderState === 6">
      <OrderStatusCard icon="cancel" text="退款中" />
    </template>
    <template v-if="orderInfo.orderState === 7">
      <OrderStatusCard icon="cancel" text="已退款" />
    </template>
    <view class="order-item">
      <AddressCard :address-info="current" :disabled="true" />
    </view>
    <!-- 菜品信息 -->
    <view class="order-item" v-for="item in orderInfo?.orderGrouponGoods" :key="item.id">
      <GoodsItem :data="item" />
    </view>
    <view class="order-item">
      <CellsCard title="订单信息" :data="orderInfo" :columns="orderInfoColumns">
        <template #payType></template>
      </CellsCard>
    </view>
    <view class="order-item" v-if="orderInfo.orderState == 6 || orderInfo.orderState == 7">
      <CellsCard title="退货信息" :data="returnInfo" :columns="returnInfoColumns">
        <template #type>
          {{ returnInfo?.type == '10' ? '无理由退货退款' : '其他' }}
        </template>
        <template #returnImg>
          <ShowImgs :data="mapImgs(customSplit(returnInfo?.returnImg))" />
        </template>
        <template #busiImg>
          <ShowImgs :data="mapImgs(customSplit(returnInfo?.busiImg))" />
        </template>
      </CellsCard>
    </view>
    <view class="order-item">
      <CellsCard title="付款明细" :data="orderInfo" :columns="payInfoColumns">
        <template #goodsPrice>
          <view class="showprice">¥ {{ orderInfo?.orderGrouponGoods?.[0]?.goodsPrice }}</view>
        </template>
        <view class="payment-price">
          <view class="price-text">需付款</view>
          <DisplayPrice :value="orderInfo?.paymentAmount" />
        </view>
      </CellsCard>
    </view>
    <view class="order-item" v-if="String(orderInfo.driverState) === '3'">
      <CellsCard title="配送信息" :data="orderInfo" :columns="sendColumns">
        <view class="distribution-voucher">
          <view class="voucher-title">配送完成凭证</view>
          <ShowImgs :data="mapImgs(orderInfo?.fileUrl)" />
        </view>
      </CellsCard>
    </view>
    <!-- 退款审核 -->
    <FooterButtonCard
      class="justify-end"
      v-if="orderInfo.orderState == 6 && returnInfo.busiStatus == 1"
    >
      <CommonButton mr2 bgColor="#3c9cff" color="#fff" @click="openRefoundRequest">
        通过
      </CommonButton>
      <CommonButton bgColor="#f56c6c" color="#fff" @click="openRefoundRequest(false)">
        拒绝
      </CommonButton>
    </FooterButtonCard>
    <RefundApplication ref="refundApplicationRef" @finished="onRefundFinished" />
  </view>
</template>

<script lang="ts" setup>
import AddressCard from '@/components/address-card/index.vue'
import CellsCard from '@/components/cells-card/index.vue'
import DisplayPrice from '@/components/display-price/index.vue'
import { ICellsCardColumns } from '@/components/cells-card/type'
import GoodsItem from '@/components/goods-item/index.vue'
import ShowImgs from '@/components/show-imgs/index.vue'
import OrderStatusCard from '@/components/order-status-card/index.vue'
import { getOrderDetail, getReturnInfo } from '@/service/order'
import { fmtShowTime } from '@/utils/format-time'
import RefundApplication from '../components/refund-application.vue'
import { customSplit } from '@/utils/common'

import useAddress from '@/hooks/useAddress'
import { mapImgs } from '@/utils/map-imgs'
import { showToast } from '@/utils/interaction'

// 剩余时间
const time = ref(0)
// 订单信息columns
const orderInfoColumns: ICellsCardColumns = [
  {
    prop: 'orderNo',
    label: '订单编号',
  },
  {
    prop: 'createTime',
    label: '下单时间',
  },
  {
    prop: 'paymentMode',
    label: '支付方式',
    hide: true,
  },
]
// 付款明细columns
const payInfoColumns: ICellsCardColumns = [
  {
    type: 'custom',
    prop: 'goodsPrice',
    label: '商品金额',
    slotName: 'goodsPrice',
  },
  // {
  //   type: 'showprice',
  //   prop: '优惠促销',
  //   label: '优惠促销',
  // },
  {
    type: 'showprice',
    prop: 'free',
    label: '运费',
  },
]
// 配送信息columns
const sendColumns: ICellsCardColumns = [
  {
    prop: 'driverName',
    label: '配送司机',
  },
]
// 剩余时间计算时间
function remainingTimer() {
  const timer = setInterval(() => {
    if (time.value <= 0) {
      clearInterval(timer)
    } else {
      time.value -= 1000
    }
  }, 1000)
}
// 订单信息
const orderInfo = ref<any>({})
// 更改订单地址信息
const { current, changeCurrentAction } = useAddress()
const orderId = ref<string>('')
// 获取订单信息
onLoad((options) => {
  if (options.id) {
    orderId.value = options.id
    getOrderDetail(options.id).then((res) => {
      orderInfo.value = res.data
      time.value = res.data.remainingTime
      if (orderInfo.value?.orderDetail) {
        const addressInfo: any = {}
        addressInfo.defaultState = 1
        const orderDetail = orderInfo.value.orderDetail
        addressInfo.addressAllName = `${orderDetail.province} ${orderDetail.city} ${orderDetail.district}`
        addressInfo.detail = orderDetail.address
        addressInfo.realName = orderInfo.value?.consignee
        addressInfo.phone = orderInfo.value?.consigneePhoneNumber
        changeCurrentAction(addressInfo)
      }

      // 剩余时间计时
      if (time.value > 0) {
        remainingTimer()
      }
    })
    fetchReturnInfo(options.id)
  }
})
const refundApplicationRef = ref<InstanceType<typeof RefundApplication>>()
const returnInfo = ref<any>({})
const returnInfoColumns: ICellsCardColumns = [
  {
    type: 'custom',
    prop: 'type',
    label: '退货方式',
    slotName: 'type',
  },

  {
    type: 'showprice',
    prop: 'refuseAmount',
    label: '退货金额',
  },
  {
    prop: 'reason',
    label: '退货理由',
    isColumn: true,
  },
  {
    type: 'custom',
    prop: 'returnImg',
    label: '申请图片',
    slotName: 'returnImg',
    isColumn: true,
    hide: true,
  },
  {
    prop: 'busiDesc',
    label: '业务员处理说明',
    hide: true,
    isColumn: true,
  },
  {
    type: 'custom',
    prop: 'busiImg',
    label: '业务处理图片',
    slotName: 'busiImg',
    isColumn: true,
    hide: true,
  },
  {
    prop: 'buyerDesc',
    label: '采购员处理说明',
    hide: true,
    isColumn: true,
  },
]
// 获取退货信息
function fetchReturnInfo(id) {
  getReturnInfo(id).then((res) => {
    returnInfo.value = res.data
  })
}
// 打开退货
function openRefoundRequest(isPass = true) {
  const newInfo = { ...returnInfo.value }
  if (isPass) {
    newInfo.buyerStatus = '1'
  } else {
    newInfo.buyerStatus = '2'
  }

  refundApplicationRef.value.open(orderInfo.value, newInfo)
}
// 退货申请成功
function onRefundFinished() {
  showToast('提交成功')
  setTimeout(() => {
    uni.navigateBack({ delta: 1 })
  }, 1000)
}
</script>

<style lang="scss" scoped>
.order-item {
  margin-top: 24rpx;
}

.showprice {
  font-size: 28rpx;
  font-weight: bold;
  color: #b22338;
}

// 需付款
.payment-price {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 24rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #666;
}

// 配送信息
.distribution-voucher {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #666;
}

.pay-button {
  align-items: center;

  &,
  .btn-price {
    display: flex;
  }

  .btn-price {
    align-items: flex-end;
    margin-left: 6rpx;
    line-height: 40rpx;

    .num {
      margin-left: 4rpx;
      font-size: 36rpx;
    }
  }
}
</style>
