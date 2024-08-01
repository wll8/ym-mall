<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '领取商品优惠券',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="coupons-choose-list page-background" :data-data="showList.length">
    <view class="coupon-list-item" v-for="item in showList" :key="item.id">
      <CouponCard
        :price="item.val"
        :type="item.couponType"
        :subtitle="`满${item.minSpend}可用`"
        :title="item.name"
        :description="item.detai"
        :state="item.useStatus"
        :time="item.expirationDate"
        :maxDiscount="item.maxDiscount"
      >
        <view class="button" @click="useClick(item)">领取并使用</view>
      </CouponCard>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getCouponByProductId, receive } from '@/service/coupon'
import { useOrderStore } from '@/store'
import { showToast } from '@/utils/interaction'
import { stringToNumber } from '@/utils/string-to-number'
interface IQueryInfo {
  current: number
  size: number
  useStatus?: number | string
  busiId?: string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  busiId: '',
})

const totalPage = ref(0)
const showList = ref<any[]>([])
const totalPrice = ref(0)
const goodsIds = ref('')

onLoad((options) => {
  if (options.price) {
    totalPrice.value = Number(options.price)
  }
  if (options.goodsId) {
    goodsIds.value = options.goodsIds
    queryInfo.busiId = options.goodsId
  }
  initCurrentData()
})
function getShowList() {
  queryInfo.current += 1
  getCouponByProductId(queryInfo).then((res: any) => {
    if (queryInfo.current === 1) {
      // 得到总页数
      totalPage.value = Math.ceil(res.data.total / queryInfo.size)

      // 关闭下拉加载
      uni.stopPullDownRefresh()
    }
    showList.value.push(...res.data.records)
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

// 使用优惠券
async function useClick(item: any) {
  // 领取优惠券
  const res = await receive(item.id)
  const couponInfo = res.data
  if (couponInfo.minSpend) {
    if (stringToNumber(totalPrice.value) < stringToNumber(item.minSpend)) {
      showToast('消费金额不足，请选择使用其它优惠券！')
      return
    }
  }
  if (
    couponInfo.couponType === '1' ||
    couponInfo.couponType === '3' ||
    couponInfo.couponType === '4'
  ) {
    if (stringToNumber(totalPrice.value) <= stringToNumber(couponInfo.val)) {
      showToast('消费金额不能小于优惠券金额，请使用其它优惠券！')
      return
    }
  }

  useOrderStore().changeCurrentCouponAction(couponInfo)
  uni.navigateBack({
    delta: 1,
  })
}
</script>

<style lang="scss" scoped>
.coupons-choose-list {
  padding: 0 24rpx;
}

.coupon-list-item {
  margin-top: 24rpx;
}

.button {
  padding: 14rpx 32rpx;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #b42a3e;
  text-align: center;
  background-color: #f7e9eb;
  border-radius: 32rpx;
}
</style>
