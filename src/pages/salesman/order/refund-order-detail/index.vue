<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '退款订单详情',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="orderdetail page-background">
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
    <view class="refund-instructions">退款说明</view>
    <FooterButtonCard>
      <CommonButton width="100%" @click="handleRefoundOrder">退款订单处理</CommonButton>
    </FooterButtonCard>
  </view>
</template>

<script lang="ts" setup>
import AddressCard from '@/components/address-card/index.vue'
import CellsCard from '@/components/cells-card/index.vue'
import DisplayPrice from '@/components/display-price/index.vue'
import { ICellsCardColumns } from '@/components/cells-card/type'
import GoodsItem from '@/components/goods-item/index.vue'
import ShowImgs from '@/components/show-imgs/index.vue'
import { getOrderDetail } from '@/service/order'

import useAddress from '@/hooks/useAddress'
import { mapImgs } from '@/utils/map-imgs'

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

// 订单信息
const orderInfo = ref<any>({})
// 更改订单地址信息
const { current, changeCurrentAction } = useAddress()
// 获取订单信息
onLoad((options) => {
  if (options.id) {
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
    })
  }
})

// 处理退款订单
function handleRefoundOrder() {
  console.log('处理退款订单')
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
