/* stylelint-disable order/properties-order */
<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '个人中心' },
}
</route>

<template>
  <view class="" style="height: 100%; background-color: #f9f9f9">
    <userCard :userData="formData"></userCard>
    <myOrders :cellList="vendorcellList"></myOrders>
  </view>
</template>

<script lang="ts" setup>
import userCard from '../../components/personal-center/userCard.vue'
import myOrders from '../../components/personal-center/myOrders.vue'
import { getUserInfo } from '@/service/user'
import { getDriverOrderNumber } from '@/service/order/index'
import { useUserStore } from '@/store'
const vendorcellList = ref([
  {
    name: '我的订单',
    logo: httpurl('/static/images/personalCenter/icon_cell/dingwei.png'),
    link: '/pages/driver/order/my-order/index',
    number: 23,
  },
  {
    name: '设置',
    logo: httpurl('/static/images/personalCenter/icon_cell/shezhi.png'),
    link: '/pages/set/index',
    number: null,
  },
])
const userStore = useUserStore()

const formData = ref()
onLoad(() => {
  handleUserInfo()
  handleOrderNumber()
})
function handleUserInfo() {
  getUserInfo().then((res) => {
    formData.value = res.data
  })
}
function handleOrderNumber() {
  getDriverOrderNumber().then((res) => {
    const pendingOrders = res.data.filter((item) => item.supState === '1' || item.supState === '2')
    if (pendingOrders) {
      const even = vendorcellList.value.filter((item) => item.name === '我的订单')
      let sum = 0
      pendingOrders.forEach((item) => {
        sum += item.num
      })
      console.log(pendingOrders)
      console.log(sum)
      even[0].number = sum
    }
  })
}
</script>

<style lang="scss" scoped></style>
