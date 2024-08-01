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
    <template v-else-if="orderInfo.orderState === 3 || orderInfo.orderState === 2">
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
      <AddressCard
        :address-info="current"
        :disabled="String(orderInfo.orderState) !== '1'"
        :is-default="String(current?.defaultState) === '2' || false"
      />
    </view>
    <!-- 菜品信息 -->
    <view class="order-item" v-for="item in orderInfo?.orderGrouponGoods" :key="item.id">
      <GoodsItem :data="item" />
    </view>
    <view class="order-item">
      <CellsCard title="订单信息" :data="orderInfo" :columns="orderInfoColumns"></CellsCard>
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
    <!-- 支付功能 -->
    <FooterButtonCard class="justify-end">
      <!-- 待付款订单 -->
      <template v-if="orderInfo.orderState == 1">
        <CommonButton color="#666" bg-color="#f5f5f5" @click="onCancalOrder">取消订单</CommonButton>
        <CommonButton style="margin-left: 16rpx">
          <view class="pay-button" @click="payClick">
            立即支付
            <view class="btn-price">
              <view class="small">¥</view>
              <view class="num">{{ orderInfo?.paymentAmount }}</view>
            </view>
          </view>
        </CommonButton>
      </template>
      <!-- 待收货订单 -->
      <template v-else-if="orderInfo.orderState == '3' || orderInfo.orderState == 2">
        <CommonButton color="#fff" bgColor="#e6a23c" @click.stop="openRefoundRequest()" mr2>
          申请退款
        </CommonButton>
        <CommonButton @click="sureGetGoods">确认收货</CommonButton>
      </template>
      <!-- 已完成与已取消订单 -->
      <template v-else>
        <view class="complaints" @click="toComplaints" v-if="orderInfo.orderState === 4" mr2>
          投诉
        </view>
        <!-- <CommonButton color="#666" bg-color="#f5f5f5" @click="onDeleteOrder">删除订单</CommonButton> -->
        <CommonButton
          color="#fff"
          @click.stop="openRefoundRequest()"
          v-if="orderInfo.orderState != 6 && orderInfo.orderState != 7"
          bgColor="#e6a23c"
          style="margin-left: 16rpx"
        >
          申请退款
        </CommonButton>
        <!-- 取消退款 -->
        <CancelRefund :data="orderInfo" buttonType="bottom" @finished="handleCancelRefund" />
        <CommonButton @click="toGoodsDetail">再次购买</CommonButton>
      </template>
    </FooterButtonCard>
    <SelectPaytype v-model:show="selectShow" v-model="payType" @confirm="onConfirmPay" />
    <!-- 退货弹窗 -->
    <RefundApplication ref="refundApplicationRef" @finished="onRefundFinished" />
  </view>
</template>

<script lang="ts" setup>
import AddressCard from '@/components/address-card/index.vue'
import CellsCard from '@/components/cells-card/index.vue'
import DisplayPrice from '@/components/display-price/index.vue'
import { ICellsCardColumns } from '@/components/cells-card/type'
import GoodsItem from '@/components/goods-item/index.vue'
import FooterButtonCard from '@/components/footer-button-card/index.vue'
import ShowImgs from '@/components/show-imgs/index.vue'
import OrderStatusCard from '@/components/order-status-card/index.vue'
import RefundApplication from '../components/refund-application.vue'
import { customSplit } from '@/utils/common'
import CancelRefund from '../components/cancel-refund.vue'
import {
  cancelOrder,
  getOrderDetail,
  payment,
  getWPayInfo,
  modifyOrderAddress,
  sureReceipt,
  getAPayInfo,
  getReturnInfo,
  userOrderReturn,
} from '@/service/order'
import { fmtShowTime } from '@/utils/format-time'
import { showToast } from '@/utils/interaction'

import useAddress from '@/hooks/useAddress'
import { mapImgs } from '@/utils/map-imgs'

const refundApplicationRef = ref<InstanceType<typeof RefundApplication>>()
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
  //   prop: 'discountPrice',
  //   label: '优惠促销',
  // },
  {
    type: 'showprice',
    prop: 'discountAmount',
    label: '优惠金额',
  },
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
const orderId = ref<IdType>('')
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
    fetchReturnInfo(orderId.value)
  }
})
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
    hide: true,
    isColumn: true,
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

/**
 * 修改地址
 */
function changeAddress(addressInfo) {
  modifyOrderAddress(orderId.value, addressInfo.current.id).then((res) => {
    if (String(res.code) === '200') {
      showToast(res.msg)
    }
  })
}
onMounted(() => {
  // 修改地址
  uni.$on('getAddress', changeAddress)
})
onUnmounted(() => {
  // 页面关闭后不修改地址
  uni.$off('getAddress', changeAddress)
})
// 取消订单
function onCancalOrder() {
  cancelOrder(orderInfo.value.id).then((res) => {
    if (res.code === 200) {
      showToast('取消订单成功！')
      uni.navigateBack({ delta: 1 })
    }
  })
}
// 删除订单
function onDeleteOrder() {
  // todo
}

// 投诉订单
function toComplaints() {
  uni.navigateTo({ url: '/pages/order/order-complaints/index?id=' + orderInfo.value.id })
}

// 立即支付
const selectShow = ref(false)
// 支付类型
const payType = ref(1)
// 点击立即支付按钮
function payClick() {
  selectShow.value = true
}

// 再次购买
function toGoodsDetail() {
  const goodsId = orderInfo.value?.orderGrouponGoods?.[0]?.goodsId
  if (goodsId) {
    uni.navigateTo({ url: '/pages/goods/goods-detail/index?id=' + goodsId })
  }
}

// 确认支付
async function onConfirmPay() {
  const { orderNo } = orderInfo.value
  try {
    let payResult: any = {}
    if (payType.value === 1) {
      payResult = await getAPayInfo(orderNo)
    } else {
      payResult = await getWPayInfo(orderNo)
    }
    if (payResult.data) {
      const res = await payment(payType.value, payResult.data)
      if (res === 'requestPayment:ok') {
        uni.showModal({
          title: '提示',
          content: '支付成功',
          showCancel: false,
          success: () => {
            uni.navigateBack({
              delta: 1,
            })
          },
        })
      } else {
        // 测试
        uni.showModal({
          title: '提示',
          content: '支付成功',
          showCancel: false,
          success: () => {
            uni.navigateBack({
              delta: 1,
            })
          },
        })
      }
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

// 确认收货
function sureGetGoods() {
  sureReceipt(orderInfo.value.id).then((res) => {
    if (res.code === 200) {
      showToast(res.msg)
      uni.navigateBack({ delta: 1 })
    }
  })
}
// 退货
function openRefoundRequest() {
  // 判断是否未发货
  if (String(orderInfo.value.supState) === '1') {
    uni.showModal({
      title: '提示',
      content: '未发货，直接退款是否确定退款',
      success(res) {
        if (res.confirm) {
          userOrderReturn({
            orderId: orderInfo.value.id,
          }).then((res) => {
            if (res.code === 200) {
              showToast('提交成功')
              setTimeout(() => {
                uni.navigateBack({ delta: 1 })
              }, 1000)
            }
          })
        }
      },
    })
  } else {
    refundApplicationRef.value.open(orderInfo.value)
  }
}
// 退货申请成功
function onRefundFinished() {
  showToast('提交成功')
  setTimeout(() => {
    uni.navigateBack({ delta: 1 })
  }, 1000)
}
// 取消退款申请成功
function handleCancelRefund() {
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.complaints {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 84rpx;
  padding: 0 30rpx;
  font-size: 28rpx;

  // font-size: 16px;
  // color: rgb(154 2 2);
  color: #fff;
  background-color: #3a34a1;
  border-radius: 42rpx;

  // text-decoration-line: underline;

  // transform: translateX(-18vw);
}

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
