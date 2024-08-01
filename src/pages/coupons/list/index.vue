<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '优惠卷',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="coupons page-background">
    <view class="header">
      <view class="header-tap" :style="{ top: headTop }">
        <Tabs :tabs="tabs" @tab-change="changeSearchType" />
      </view>
    </view>
    <view class="coupon-list" :data-data="showList.length">
      <view class="coupon-list-item" v-for="item in showList" :key="item.id">
        <CouponCard
          :price="item.val"
          :subtitle="`满${item.minSpend}可用`"
          :title="item.name"
          :type="item.couponType"
          :time="item.expirationDate"
          :description="item.detai"
          :state="item.useStatus"
          :maxDiscount="item.maxDiscount"
          @card-click="toDetail(item)"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ITab } from '@/components/tabs/type'
import { getCouponsList } from '@/service/coupon'
import { showToast } from '@/utils/interaction'
import { isH5 } from '@/utils/system-info'
import useCouponStore from '@/store/coupon/index'
// 得到headerTop定位位置
const headTop = computed(() => {
  const value = uni.getStorageSync('navigationBarHeight')
  if (isH5()) {
    return value + 'px'
  }
  return 0
})
const tabs: ITab[] = [
  {
    text: '未使用',
    value: '0',
  },
  {
    text: '已使用',
    value: '1',
  },
  {
    text: '已过期',
    value: '-1',
  },
]

interface IQueryInfo {
  current: number
  size: number
  useStatus?: number | string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  useStatus: '0',
})

const totalPage = ref(0)
const showList = ref<any[]>([])

function getShowList() {
  queryInfo.current += 1
  getCouponsList(queryInfo)
    .then((res: any) => {
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
  queryInfo.useStatus = info.value
  initCurrentData()
}

// 初始化获取分页信息
function initCurrentData() {
  queryInfo.current = 0
  totalPage.value = 0
  showList.value = []
  getShowList()
}
initCurrentData()
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

// 去优惠券详情
function toDetail(item: any) {
  useCouponStore().changeCouponInfoAction(item)
  uni.navigateTo({
    url: `/pages/coupons/detail/index?id=${item.id}`,
  })
}
</script>

<style lang="scss" scoped>
.coupon-list-item {
  margin-top: 24rpx;

  &:first-child {
    margin-top: 0;
  }
}

.coupons {
  height: 100%;
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
</style>
