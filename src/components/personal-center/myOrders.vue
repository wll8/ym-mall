<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '',
  },
}
</route>

<template>
  <view class="myOrders">
    <view class="flex justify-between items-center mx-4 my-2" v-if="myOrdersItem.length > 0">
      <h3>我的订单</h3>
      <view style="color: #999" @click="toMyOrder(0)">
        全部订单
        <uni-icons type="right" size="16"></uni-icons>
      </view>
    </view>
    <wd-card v-if="myOrdersItem.length > 0">
      <view class="flex justify-around items-center h-6">
        <view
          class="flex flex-col items-center"
          v-for="item in myOrdersItem"
          :key="item.type"
          @click="toMyOrder(item.type, item.link)"
        >
          <view class="flex justify-between relative">
            <wd-img :width="25" :height="25" :src="httpurl(item.logo)" />
            <view v-show="item.message" class="badge">{{ item.message }}</view>
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
        <view v-if="item.notEnoughNumber" class="flex items-center">
          <view class="px-3">
            库存不足:
            <span class="text-rose-700">{{ item.notEnoughNumber }}</span>
          </view>
        </view>
        <view>
          <span v-show="item.number">{{ item.number }}</span>
          <uni-icons type="right" size="16"></uni-icons>
        </view>
      </view>
    </wd-card>
  </view>
</template>

<script lang="ts" setup>
interface cellListItem {
  id?: string
  name: string // 标签名
  logo: string //  图标
  link: string // 跳转地址
  number?: number // 数量
  notEnoughNumber?: any // 库存不足数量
}
interface myOrders {
  id?: string
  name: string // 标签名
  logo: string //  图标
  type: number // 跳转地址属性
  message?: number // 数量
  link?: string // 路径
}

const props = withDefaults(
  defineProps<{
    cellList: cellListItem[]
    myOrdersItem?: myOrders[]
    orderLink?: string
  }>(),
  {
    cellList: () => [
      {
        name: '订单统计',
        logo: httpurl('/static/images/personalCenter/icon_cell/youhuiquan.png'),
        link: 'pages/myCoupons',
        number: null,
      },
    ],
    myOrdersItem: () => [],
    orderLink: '',
  },
)

const CustomerPhoneNmb = ref(['18798092256', '13598092287'])
const changePage = (data: any) => {
  uni.navigateTo({ url: data })
}
function toMyOrder(data: any, link?: any) {
  if (props.orderLink) {
    uni.navigateTo({ url: props.orderLink })
    return
  }
  if (link) {
    uni.navigateTo({ url: `${link}?type=${data}` })
  } else {
    uni.navigateTo({ url: `/pages/order/my-order/index?type=${data}` })
  }
}
</script>

<style lang="scss" scoped>
//
.badge {
  position: absolute;
  right: -18px;
  width: 18px;
  height: 16px;
  font-size: 10px;
  line-height: 16px;
  color: #fff;
  text-align: center;
  background: #b22338;
  border-radius: 8px 8px 8px 1px;
}
</style>
