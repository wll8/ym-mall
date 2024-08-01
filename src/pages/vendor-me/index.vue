/* stylelint-disable order/properties-order */
<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '个人中心' },
}
</route>

<template>
  <view class="" style="height: 100%; background-color: #f9f9f9">
    <userCard :userData="formData"></userCard>
    <myOrders
      :cellList="vendorcellList"
      orderLink="/pages/supplier/order/my-order/index"
      :myOrdersItem="myOrdersItem"
    ></myOrders>
  </view>
</template>

<script lang="ts" setup>
import { getSupplierCount, getSupOrderNum, getUserInfo } from '@/service/user'
import userCard from '../../components/personal-center/userCard.vue'
import myOrders from '../../components/personal-center/myOrders.vue'
import { useUserStore } from '@/store'
const vendorcellList = ref([
  {
    name: '我的商品',
    logo: httpurl('/static/images/personalCenter/icon_cell/dingwei.png'),
    link: '/pages/supplier/goods/my-goods/index',
    notEnoughNumber: 5,
    number: 23,
  },
  // {
  //   name: '商家审核',
  //   logo: httpurl('/static/images/personalCenter/icon_cell/shezhi.png'),
  //   link: 'pages/SubmitforReview',
  //   number: null,
  // },
  {
    name: '设置',
    logo: httpurl('/static/images/personalCenter/icon_cell/shezhi.png'),
    link: '/pages/set/index',
    number: null,
  },
])
const myOrdersItem = ref([
  {
    name: '待接单',
    logo: httpurl('/static/images/personalCenter/icon_cell/shijian.png'),
    link: '/pages/supplier/order/my-order/index',
    type: 1,
    message: null,
  },
  {
    name: '配送中',
    logo: httpurl('/static/images/personalCenter/icon_cell/yunshupeisong.png'),
    link: '/pages/supplier/order/my-order/index',
    type: 2,
    message: null,
  },
  {
    name: '已送达',
    logo: httpurl('/static/images/personalCenter/Done.png'),
    link: '/pages/supplier/order/my-order/index',
    type: 3,
    message: null,
  },
])
const formData = ref()
onLoad(() => {
  handleUserInfo()
})
onShow(() => {
  getGoodsNumber()
  getSupOrderNumData()
})
function handleUserInfo() {
  getUserInfo().then((res) => {
    formData.value = res.data
  })
}
const userStore = useUserStore()
function getGoodsNumber() {
  getSupplierCount().then((res) => {
    const even = vendorcellList.value.filter((item) => item.name === '我的商品')
    even[0].number = res.data.size
    even[0].notEnoughNumber = res.data.notEnoughNumber
  })
}
function getSupOrderNumData() {
  getSupOrderNum().then((res) => {
    const pendingOrders = res.data.filter((item) => item.supState === '1')
    if (pendingOrders.length !== 0) {
      const even = myOrdersItem.value.filter((item) => item.name === '待接单')
      even[0].message = pendingOrders[0].num
    } else {
      const even = myOrdersItem.value.filter((item) => item.name === '待接单')
      even[0].message = 0
    }
    const distributing = res.data.filter((item) => item.supState === '2')
    if (distributing.length !== 0) {
      const even1 = myOrdersItem.value.filter((item) => item.name === '配送中')
      even1[0].message = distributing[0].num
    } else {
      const even1 = myOrdersItem.value.filter((item) => item.name === '配送中')
      even1[0].message = 0
    }
  })
}
</script>

<style lang="scss" scoped></style>
