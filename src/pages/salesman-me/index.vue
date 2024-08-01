<route lang="json5" type="page">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '个人中心',
  },
}
</route>

<template>
  <view style="height: 100%; background-color: #f9f9f9">
    <userCard :userData="formData"></userCard>
    <me-cards
      :cellList="cardCellList"
      title="我的订单"
      subTitle="全部订单"
      link="/pages/salesman/order/all-order/index"
    />
    <count-card title="订单统计" :cellList="orderCountCellList" @search="handleCountSearch" />
    <myOrders :cellList="cellList"></myOrders>
  </view>
</template>

<script lang="ts" setup>
import userCard from '../../components/personal-center/userCard.vue'
import myOrders from '../../components/personal-center/myOrders.vue'
import { getUserInfo } from '@/service/user'
import { getUserId } from '@/utils/user'
import { getOrderStateCount, getAllOrderCount } from '@/service/order'
const cardCellList = ref<any>([
  {
    name: '待付款',
    iconType: 'image',
    icon: '/static/images/personalCenter/icon_cell/shijian.png',
    link: '/pages/salesman/order/all-order/index?type=1',
  },
  {
    name: '待收货',
    icon: '/static/images/personalCenter/icon_cell/yunshupeisong.png',
    iconType: 'image',
    link: '/pages/salesman/order/all-order/index?type=3',
  },
  {
    name: '售后订单',
    icon: 'customer',
    link: '/pages/salesman/order/all-order/index?type=6',
  },
  {
    name: '已完成',
    iconType: 'image',
    icon: '/static/images/personalCenter/Done.png',
    link: '/pages/salesman/order/all-order/index?type=4',
  },
])

const cellList = ref([
  {
    name: '我的商家',
    logo: httpurl('/static/images/personalCenter/icon_cell/youhuiquan.png'),
    link: '/pages/salesman/my-business/index',
    number: null,
  },
  {
    name: '投诉列表',
    logo: httpurl('/static/images/personalCenter/icon_cell/dingwei.png'),
    link: 'pages/my-complaints/index',
    number: null,
  },
  {
    name: '邀请码',
    logo: httpurl('/static/images/personalCenter/icon_cell/invite.png'),
    link: 'pages/inviteCode',
    number: null,
  },
  {
    name: '设置',
    logo: httpurl('/static/images/personalCenter/icon_cell/shezhi.png'),
    link: '/pages/set/index',
    number: null,
  },
])
const orderCountCellList = ref([
  { title: '订单数量', count: 0, icon: 'order', countColor: '#b22338' },
  { title: '订单金额', count: 0, icon: 'amount', countColor: '#7ec50b' },
])
const formData = ref()
const queryInfo = reactive({
  salesmanId: getUserId(),
  startTime: '',
})
onLoad(() => {
  handleUserInfo()
  // 获取用户id
})
onShow(() => {
  // 获取订单状态统计
  getOrderStateCount(queryInfo).then((res) => {
    cardCellList.value[0].count = res.data.unpaidNum
    cardCellList.value[1].count = res.data.todoNum
    cardCellList.value[2].count = res.data.afterNum
    cardCellList.value[3].count = res.data.doneNum
  })
  // 获取全部订单统计
  fetchAllOrderCount()
})
function fetchAllOrderCount() {
  getAllOrderCount(queryInfo).then((res) => {
    orderCountCellList.value[0].count = res.data.orderNum || 0
    orderCountCellList.value[1].count = res.data.totalAmount || 0
  })
}
function handleUserInfo() {
  getUserInfo().then((res) => {
    formData.value = res.data
  })
}
// 处理统计搜索
function handleCountSearch(info) {
  queryInfo.startTime = info.startTime
  fetchAllOrderCount()
}
</script>

<style lang="scss" scoped>
//
</style>
