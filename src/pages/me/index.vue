<route lang="json5" type="page">
{
  layout: 'tabbar',
  style: { navigationBarTitleText: '个人中心' },
}
</route>

<template>
  <view style="min-height: 90vh; background-color: #f9f9f9">
    <view class="userCard" @click="toUserCard">
      <wd-img :width="72" :height="72" round :src="httpurl(formData.avatar)" />
      <view style="margin-left: 12px">
        <view style="font-weight: bold">{{ formData.name }}</view>
        <view>{{ formData.phone || null }}</view>
      </view>
    </view>
    <view class="myOrders">
      <view class="flex justify-between items-center mx-4 my-3">
        <h3>我的订单</h3>
        <view style="color: #999" @click="toMyOrder(0)">
          全部订单
          <uni-icons type="right" size="16"></uni-icons>
        </view>
      </view>
      <wd-card>
        <view class="flex justify-around items-center h-6">
          <view
            class="flex flex-col items-center"
            v-for="item in myOrdersItem"
            :key="item.type"
            @click="toMyOrder(item.type)"
          >
            <view>
              <wd-img :width="25" :height="25" :src="httpurl(item.logo)" />
            </view>
            <view>{{ item.name }}</view>
          </view>
        </view>
      </wd-card>
      <wd-card v-for="item in cellList" :key="item.name">
        <view class="cell flex items-center justify-between h-1" @click="changePage(item.link)">
          <view class="flex items-center">
            <wd-img :width="27" :height="25" :src="httpurl(item.logo)" />
            <view class="px-3">{{ item.name }}</view>
          </view>
          <view>
            <span>{{ item.number }}</span>
            <uni-icons type="right" size="16"></uni-icons>
          </view>
        </view>
      </wd-card>
      <wd-card>
        <view class="flex items-center h-2">
          <wd-img
            :width="27"
            :height="25"
            :src="httpurl('/static/images/personalCenter/icon_cell/Customer.png')"
          />
          <view class="px-3">
            <view class="flex justify-between">
              <span class="mx-1">专属客服</span>
              <view class="c-red flex">
                <view
                  class="mr-10px"
                  v-for="item in CustomerPhoneNmb"
                  :key="item"
                  @click="makePhone(item.dictKey)"
                >
                  {{ item.dictKey }}
                </view>
              </view>
            </view>
            <view class="flex justify-between mt-1">
              <span class="mx-1">客服经理</span>
              <view class="c-red flex">
                <view class="mr-10px" @click="makePhone(mangerNumber.phone)">
                  {{ mangerNumber.phone || null }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </wd-card>
    </view>
    <view class="copyright">
      <view>贵州亿侎在线科技有限公司</view>
      <view>ICP备案号：黔ICP备2024024973号</view>
      <view>Copyright@2024-2025</view>
      <view>gzymzx.com 版权所有</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { httpurl } from '@/utils/index'
import { getCustomerPhoneList, getUserInfo, getCustomerPhone } from '@/service/user'
const cellList = ref([
  {
    name: '我的优惠券',
    logo: '/static/images/personalCenter/icon_cell/youhuiquan.png',
    link: '/pages/coupons/list/index',
  },
  {
    name: '发票抬头管理',
    logo: '/static/images/personalCenter/icon_cell/youhuiquan.png',
    link: 'pages/InvoiceTitle',
  },
  {
    name: '地址管理',
    logo: '/static/images/personalCenter/icon_cell/dingwei.png',
    link: 'pages/Address',
    number: null,
  },
  {
    name: '设置',
    logo: '/static/images/personalCenter/icon_cell/shezhi.png',
    link: '/pages/set/index',
  },
])
const myOrdersItem = ref([
  {
    name: '待付款',
    logo: '/static/images/personalCenter/pendingPay.png',
    type: 1,
  },
  {
    name: '待收货',
    logo: '/static/images/personalCenter/pendingReceivy.png',
    type: 3,
  },
  {
    name: '已完成',
    logo: '/static/images/personalCenter/Done.png',
    type: 4,
  },
])
const formData = ref({
  avatar: null,
  name: null,
  phone: null,
})
onLoad(() => {
  uni.$on('getAddress', function (data) {})
})
onShow(() => {
  handleUserInfo()
})
const CustomerPhoneNmb = ref()
const mangerNumber = ref()
const changePage = (data) => {
  uni.navigateTo({ url: data })
}
function toUserCard() {
  uni.navigateTo({ url: '/pages/me/pages/PersonalData' })
}
function toMyOrder(data) {
  uni.navigateTo({ url: `/pages/order/my-order/index?type=${data}` })
}
function makePhone(e) {
  uni.makePhoneCall({
    phoneNumber: e,
  })
}
function getPhoneList() {
  getCustomerPhoneList().then((res) => {
    CustomerPhoneNmb.value = res.data
  })
  getCustomerPhone().then((res) => {
    if (res.data) {
      mangerNumber.value = res.data
    }
  })
}

function handleUserInfo() {
  getUserInfo().then((res) => {
    formData.value = res.data
  })
}
getPhoneList()
</script>

<style lang="scss" scoped>
/* stylelint-disable-next-line selector-class-pattern */
.userCard {
  display: flex;
  align-items: center;
  height: 116px;
  padding: 0 28px;
  background-image: httpurl('/static/images/personalCenter/personalCenterBgi.png');
}

.copyright {
  position: relative;
  bottom: 5px;
  left: 50%;
  width: 300px;
  margin: 10px;
  font-size: 12px;
  color: #9b9b9b;
  text-align: center;
  transform: translateX(-50%);
}
</style>
