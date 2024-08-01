<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '我的供应商',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="my-supplier page-background">
    <view class="header">
      <view class="fix-top" :style="{ top: headTop }">
        <view class="search-area">
          <w-search placeholder="请输入商家名称" v-model="queryInfo.userName" @search="onSearch" />
        </view>
      </view>
    </view>
    <view class="main">
      <view class="business-count">共{{ total }}个商家</view>
      <view class="business-list" :data-data="showList.length">
        <view class="business-list-item" v-for="(item, index) in showList" :key="item.id">
          <BusinessCard :data="item" :is-border="showList.length - 1 === index ? false : true" />
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
// functions
import { isH5 } from '@/utils/system-info'
import { showToast } from '@/utils/interaction'
import { getVendorList } from '@/service/salesman'

// components
import BusinessCard from '../components/business-card.vue'

// 得到固定位置
// 得到headerTop定位位置
const headTop = computed(() => {
  if (isH5()) {
    return '44px'
  }
  return 0
})

/**
 * 获取订单列表
 */
interface IQueryInfo {
  current: number
  size: number
  userName?: string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  userName: '',
})

const totalPage = ref(0)
const total = ref(0)
const showList = ref<any[]>([])

// functions

function getShowList() {
  queryInfo.current += 1
  getVendorList(queryInfo)
    .then((res: any) => {
      if (queryInfo.current === 1) {
        // 得到总页数
        totalPage.value = Math.ceil(res.data.total / queryInfo.size)
        total.value = res.data.total
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
// 初始化获取分页信息
function initCurrentData() {
  queryInfo.current = 0
  totalPage.value = 0
  showList.value = []
  getShowList()
}
initCurrentData()
/**
 * 搜索订单
 */
function onSearch() {
  initCurrentData()
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
</script>

<style lang="scss" scoped>
.page-background {
  background-color: #fff;
}

.my-supplier {
  padding: 0 24rpx;
}

.header {
  height: 108rpx;

  .fix-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 22;
    height: 108rpx;
  }
}

.search-area {
  display: flex;
  align-items: center;
  height: 108rpx;
  padding: 0rpx 30rpx;
  background-color: #fff;
}

.business-count {
  font-size: 28rpx;
  color: #333;
}
</style>
