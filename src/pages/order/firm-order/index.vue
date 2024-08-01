<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '确认订单',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="firm-order page-background">
    <view class="order-item">
      <AddressCard :is-default="current?.defaultState === 2 || false" :address-info="current" />
    </view>
    <!-- 菜品信息 -->
    <view class="order-item" v-for="(item, index) in goodsInfos" :key="item.id">
      <GoodsItemV2
        :data="item"
        v-model="payInfo.goodsInfos[index]"
        :is-counter="payInfo.isCat === 0"
      />
    </view>
    <view class="item-detail">
      <CellsCard title="付款明细" :columns="payInfoColumns">
        <template #goodsPrice>
          <!-- 商品金额  -->
          <view class="showprice">¥ {{ getPrice() }}</view>
        </template>
        <!-- 展示优惠金额 -->
        <template #coupon>
          <view class="show-coupon-info" @click="toChooseCoupon" flex items-center>
            <view class="showprice" v-if="currentCoupon.val">优惠金额：{{ getCouponPrice() }}</view>
            <view class="text" v-else>未选择优惠卷</view>
            <view class="svg-icon si-arrow-right" ml="sm"></view>
          </view>
        </template>
      </CellsCard>
    </view>
    <view class="payment-price">
      <view class="price-text">合计</view>
      <DisplayPrice :value="totalPrice" />
    </view>
    <view class="order-item">
      <BasicCard title="支付方式">
        <CellRadios :options="paytypeOptions" v-model="payType" />
      </BasicCard>
    </view>
    <!-- 支付功能 -->
    <FooterButtonCard class="justify-end">
      <CommonButton width="100%" @click="play">提交订单</CommonButton>
    </FooterButtonCard>
  </view>
</template>

<script lang="ts" setup>
import AddressCard from '@/components/address-card/index.vue'
import CellsCard from '@/components/cells-card/index.vue'
import DisplayPrice from '@/components/display-price/index.vue'
import { ICellsCardColumns } from '@/components/cells-card/type'
import GoodsItemV2 from '@/components/goods-item-v2/index.vue'
import FooterButtonCard from '@/components/footer-button-card/index.vue'
import BasicCard from '@/components/basic-card/index.vue'
import CellRadios from '@/components/cell-radios/index.vue'
import type { ICellRadiosOptions } from '@/components/cell-radios/type'
import { useAddressStore, useOrderStore } from '@/store'
import {
  addOrder,
  getAPayInfo,
  getCarAPayInfo,
  getCarWPayInfo,
  getWPayInfo,
  payment,
} from '@/service/order'
import { showToast } from '@/utils/interaction'
import { stringToNumber } from '@/utils/string-to-number'
import { add, subtract, multiply, divide, toFloorFixed } from '@/utils/math'

const orderStore = useOrderStore()
const addressStore = useAddressStore()
const { current } = storeToRefs(addressStore)
onLoad((options) => {
  if (!options.isDetail) {
    addressStore.loadDefaultAddressInfo()
  }
})

// 解构订单store
const { payInfo, goodsInfos } = orderStore
const { currentCoupon } = storeToRefs(orderStore)

// 支付方式列表
const paytypeOptions: ICellRadiosOptions = [
  {
    icon: 'alipay',
    label: '支付宝支付',
    value: 1,
  },
  {
    icon: 'wechat',
    label: '微信支付',
    value: 2,
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
    prop: 'freePrice',
    label: '运费',
  },
  {
    type: 'custom',
    prop: 'couponPrice',
    label: '优惠券',
    slotName: 'coupon',
  },
]

// 支付类型
const payType = ref(1)

// 获取全部运费
const getTotalFreePrice = () => {
  let price = 0
  if (payInfo.goodsInfos && payInfo.goodsInfos.length) {
    price = payInfo.goodsInfos.reduce((prev, _, index) => {
      /*
        goodsInfos[index]?.freePrice 商品运费
      */
      // 如果是根据商品数量确定运费，后续在加上与商品数量相乘
      const freePrice = stringToNumber(goodsInfos[index]?.freePrice)
      const val = add(prev, freePrice)
      return val
    }, 0)
  }
  return price
}
// 获取商品金额
function getPrice() {
  let price = 0
  if (payInfo.goodsInfos && payInfo.goodsInfos.length) {
    price = payInfo.goodsInfos.reduce((prev, cur, index) => {
      /*
        cur.num 购买数量，
        goodsInfos[index]?.salePrice： 商品价格
      */
      const salePrice = stringToNumber(goodsInfos[index]?.salePrice)
      const val = add(prev, multiply(cur.num, salePrice))
      return val
    }, 0)
  }
  return price
}
// 总价格
const totalPrice = computed(() => {
  // 商品金额价格
  let price = getPrice()
  // 加上运费
  price = add(price, getTotalFreePrice())
  // 减去优惠券价格
  if (currentCoupon.value.val) {
    // 是否满减券
    price = subtract(price, getCouponPrice())
  }
  return price
})
// 获取优惠金额
function getCouponPrice() {
  const price = getPrice()
  // 减去优惠券价格
  if (currentCoupon.value.val) {
    // 是否满减券
    if (
      String(currentCoupon.value.couponType) === '1' ||
      String(currentCoupon.value.couponType) === '3' ||
      String(currentCoupon.value.couponType) === '4'
    ) {
      return stringToNumber(currentCoupon.value.val)
    } else {
      // 当价格大于最大折扣金额，优惠金额就是最大折扣金额
      if (price > stringToNumber(currentCoupon.value.maxDiscount)) {
        return stringToNumber(currentCoupon.value.maxDiscount)
      } else {
        const val = stringToNumber(currentCoupon.value.val)
        // 得到打折后的价格，保留两位小数
        const discountPrice = toFloorFixed(multiply(price, divide(val, 100)))
        return subtract(price, discountPrice)
      }
    }
  }
}

// 去选择优惠券
function toChooseCoupon() {
  // 计算价格，判断是否有优惠券使用权限
  const price = getPrice()
  const goodsIds = payInfo.goodsInfos.map((item) => item.goodsId).join(',')
  uni.navigateTo({
    url: `/pages/coupons/choose-list/index?price=${price}&goodsIds=${goodsIds}`,
  })
}
let isplay = false

// 获取订单号
function getOrderNoByAddOrder(payInfo) {
  return new Promise<string>((resolve, reject) => {
    addOrder(payInfo)
      .then((res) => {
        resolve(res.data.orderNo)
      })
      .catch((error) => {
        isplay = false
        reject(error)
      })
  })
}
const saveOrderNo = ref('')
// 判断是否支付超时
const playResult = ref(false)
const playType = ref(1)
// 对支付进行封装，处理引用双开bug
function handlePayment(type: number, data: any) {
  playType.value = type
  return new Promise<any>((resolve, reject) => {
    payment(type, data)
      .then((res) => {
        playResult.value = true

        resolve(res)
      })
      .catch((err) => {
        playResult.value = true
        reject(err)
      })
  })
}

// function get
onShow(() => {
  // 判断是否支付超时, 判断选择的支付方式，微信支付才处理，通过支付结果，无论成功失败都不进入这里
  if (isplay && saveOrderNo.value && !playResult.value && playType.value === 2) {
    isplay = false
    toMyOrderPage()
  }
})
//  跳转到订单页面
function toMyOrderPage() {
  uni.showModal({
    title: '提示',
    content: '支付失败，跳转到我的订单待支付',
    showCancel: false,
    success: (success) => {
      if (success.confirm) {
        uni.redirectTo({
          url: '/pages/order/my-order/index?type=1',
        })
      }
    },
  })
}
// 立即支付
async function play() {
  if (isplay) return
  isplay = true // 防止重复点击
  payInfo.userAddressId = current.value.id

  if (!payInfo.userAddressId) {
    isplay = false
    showToast('地址未选择，请选择地址')
    return
  }
  // 加入优惠券
  if (currentCoupon.value.id) {
    payInfo.couponUserId = currentCoupon.value.id
  }
  // 得到订单编号
  const orderNo = await getOrderNoByAddOrder(payInfo)
  saveOrderNo.value = orderNo
  // 添加订单
  try {
    let payResult: any = {}
    if (payType.value === 1) {
      if (payInfo.isCat) {
        payResult = await getCarAPayInfo(orderNo)
      } else {
        payResult = await getAPayInfo(orderNo)
      }
    } else {
      if (payInfo.isCat) {
        payResult = await getCarWPayInfo(orderNo)
      } else {
        payResult = await getWPayInfo(orderNo)
      }
    }
    if (payResult.data) {
      const { errMsg } = await handlePayment(payType.value, payResult.data)
      if (errMsg === 'requestPayment:ok') {
        isplay = false
        // 支付成功条支付成功页面
        uni.redirectTo({
          url: '/pages/order/payment-detail/index',
        })
      } else {
        // 展示为什么支付失败提示
        showToast(errMsg)
        throw new Error(errMsg) // 支付失败信息
      }
    } else {
      // 展示获取支付信息失败
      showToast('获取支付信息失败')
      // 判断是测试环境跳转到完成支付页面
      throw new Error('获取支付信息失败')
    }
  } catch (error) {
    console.log(error)
    isplay = false
    toMyOrderPage()
  }
}
</script>

<style lang="scss" scoped>
.si-arrow-right {
  width: 20rpx;
  height: 20rpx;
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
  padding: 0 24rpx 24rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #666;
  background-color: #fff;
}

.item-detail {
  border-top: 2rpx solid #f5f5f5;
}
</style>
