<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '商品详情',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="goods-detail page-background">
    <CustomDetailNavbar @share="toShare" />
    <DetailSwiper :data="mapImgs(data.slideshowList)" />
    <DetailInfos
      :id="detailId"
      :title="data.goodsName"
      :price="data.salePrice"
      :market-price="data.marketPrice"
    />
    <DetailSelect :data="data" />
    <DetailDisplay
      :imgs="mapImgs(data.detailImgUrlList)"
      :is-string="true"
      :data="data.detailContent"
    />
    <DetailBottomBar @pay-click="pay" />
  </view>
</template>

<script lang="ts" setup>
import CustomDetailNavbar from '@/components/custom-detail-navbar/index.vue'
import DetailInfos from './components/detail-infos/index.vue'
import DetailSelect from './components/detail-select/index.vue'
import DetailDisplay from './components/detail-display/index.vue'
import DetailBottomBar from './components/detail-bottom-bar/index.vue'
import { ref } from 'vue'
import { mapImgs } from '@/utils/map-imgs'
import { getGoodsDetail } from '@/service/goods'
import { useOrderStore, useGoodsStore } from '@/store'
const goodsStore = useGoodsStore()

const detailId = ref('')
onLoad((options) => {
  // 通过id获取商品信息
  if (options.id) {
    // 重置购买信息
    goodsStore.resetPurchaseInformationAction(options.id)
    detailId.value = options.id
    fetchGoodsData()
    // 设置商品id
    goodsStore.purchaseInformation.goodsId = options.id
  }
})
// 滚动到顶部
onShow(() => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 0,
  })
})
const data = ref<any>({})

function fetchGoodsData() {
  getGoodsDetail(detailId.value).then((res) => {
    data.value = res.data
  })
}
uni.$on('refreshData', () => {
  fetchGoodsData()
})
function toShare() {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 1,
    summary: '我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！',
    success: function (res) {
      console.log('success:' + JSON.stringify(res))
    },
    fail: function (err) {
      console.log('fail:' + JSON.stringify(err))
    },
  })
}

// 去支付
function pay() {
  // 存储订单信息
  const orderStore = useOrderStore()
  const { goodsId, num } = goodsStore.purchaseInformation

  // 改变商品id
  orderStore.changePayInfoGoodsInfos([{ goodsId, num }])
  // 改变商品展示信息
  orderStore.changeGoodsInfosAction([data.value])
  uni.navigateTo({
    url: `/pages/order/firm-order/index?isDetail=1`,
  })
}
</script>

<style lang="scss" scoped>
.page-background {
  height: 100vh;
}
</style>
