/* stylelint-disable CssSyntaxError */
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '退款订单',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="my-business">
    <view class="header">
      <view class="fix-top" :style="{ top: headTop }">
        <view class="search-area">
          <w-search placeholder="请输入商家名称" v-model="queryInfo.userName" @search="onSearch" />
        </view>
      </view>
    </view>
    <view class="main">
      <view class="business-count">共{{ total }}个退款订单</view>
      <view class="business-list" :data-data="showList.length">
        <view class="business-list-item" v-for="(item, index) in showList" :key="item.id">
          <refundCard
            :data="item"
            :is-border="showList.length - 1 === index ? false : true"
            @rejected="onRejected"
            @agree="onAgree"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// functions
import { isH5 } from '@/utils/system-info'
import { showToast } from '@/utils/interaction'
import { getBusinesses, updateRegisterState } from '@/service/salesman'

// types
import type { IUpdateRegisterStateInfo } from '@/service/salesman'

// components
import refundCard from '../components/refund-card.vue'
import EnterRejectedContent from '../components/enter-rejected-content.vue'
import { stringToNumber } from '@/utils/string-to-number'

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
const enterRef = ref<InstanceType<typeof EnterRejectedContent>>(null)
// functions

function getShowList() {
  queryInfo.current += 1
  getBusinesses(queryInfo)
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
// 按钮事件处理
// 修改状态
function modifyRegistryState(postInfo: IUpdateRegisterStateInfo) {
  updateRegisterState(postInfo).then((res) => {
    if (stringToNumber(res.code) === 200) {
      showToast(res.msg)
      initCurrentData()
    }
  })
}
// 拒绝
function onRejected(data: any) {
  // 打开拒绝内容输入框
  // enterRef.value.openModal(data)
}
// 确认拒绝
function sureRejected(form: IUpdateRegisterStateInfo) {
  modifyRegistryState(form)
}
// 同意
function onAgree(data: any) {
  uni.showModal({
    title: '提示',
    content: '是否同意当前申请',
    success(res: any) {
      if (res.confirm) {
        const postInfo: IUpdateRegisterStateInfo = { id: data.userId, registerState: 20 }
        modifyRegistryState(postInfo)
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.my-business {
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
