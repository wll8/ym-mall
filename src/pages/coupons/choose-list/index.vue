<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '选择优惠卷',
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
        :is-used="true"
        :maxDiscount="item.maxDiscount"
        @use-click="useClick(item)"
      ></CouponCard>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getAvailableCoupon } from '@/service/coupon'
import { useOrderStore } from '@/store'
import { showToast } from '@/utils/interaction'
import { stringToNumber } from '@/utils/string-to-number'
interface IQueryInfo {
  current: number
  size: number
  useStatus?: number | string
  key?: string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  key: '',
})

const totalPage = ref(0)
const showList = ref<any[]>([])
const totalPrice = ref(0)
const goodsIds = ref('')
onLoad((options) => {
  if (options.price) {
    totalPrice.value = Number(options.price)
  }
  if (options.goodsIds) {
    goodsIds.value = options.goodsIds
    queryInfo.key = options.goodsIds
  }
  initCurrentData()
})
function getShowList() {
  queryInfo.current += 1
  getAvailableCoupon(queryInfo)
    .then((res: any) => {
      if (queryInfo.current === 1) {
        // 得到总页数
        totalPage.value = Math.ceil(res.data.total / queryInfo.size)

        // 关闭下拉加载
        uni.stopPullDownRefresh()
      }
      showList.value.push(...res.data)
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

// 使用优惠券
function useClick(item: any) {
  if (item.minSpend) {
    if (stringToNumber(totalPrice.value) < stringToNumber(item.minSpend)) {
      showToast('消费金额不足，请选择使用其它优惠券！')
      return
    }
  }
  if (item.couponType === '1' || item.couponType === '3' || item.couponType === '4') {
    if (stringToNumber(totalPrice.value) <= stringToNumber(item.val)) {
      showToast('消费金额不能小于优惠券金额，请使用其它优惠券！')
      return
    }
  }

  useOrderStore().changeCurrentCouponAction(item)
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
</style>
