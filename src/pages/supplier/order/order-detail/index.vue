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
    <template v-if="orderInfo.supState === '1'">
      <OrderStatusCard icon="time" text="待接单" />
    </template>
    <template v-if="orderInfo.supState === '2'">
      <OrderStatusCard icon="has-success" color="#75BE00" text="配送中" />
    </template>
    <template v-if="orderInfo.supState === '3'">
      <OrderStatusCard icon="cancel" text="已送达" />
    </template>
    <view class="order-item">
      <AddressCard :address-info="current" :disabled="true" />
    </view>
    <!-- 菜品信息 -->
    <view class="order-item" v-for="item in orderInfo?.orderGrouponGoods" :key="item.id">
      <GoodsItem :data="item" />
    </view>
    <view class="order-item">
      <CellsCard title="订单信息" :data="orderInfo" :columns="orderInfoColumns"></CellsCard>
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

    <FooterButtonCard v-if="orderInfo.supState === '1'">
      <CommonButton width="100%" @click="sendGoods">发货</CommonButton>
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
import OrderStatusCard from '@/components/order-status-card/index.vue'
import { getOrderDetail, modifyOrderState } from '@/service/order'
import { showToast } from '@/utils/interaction'
import { useAddressStore } from '@/store'
import { mapImgs } from '@/utils/map-imgs'
const addressStore = useAddressStore()
const { current } = storeToRefs(addressStore)

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
        addressStore.changeCurrentAction(addressInfo)
      }
    })
  }
})

function sendGoods() {
  modifyOrderState(orderInfo.value.id, '2').then((res) => {
    showToast(res.msg).then(() => {
      uni.navigateBack({ delta: 1 })
    })
  })
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
