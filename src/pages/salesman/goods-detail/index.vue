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
    <CustomDetailNavbar />
    <DetailSwiper :data="mapImgs(data.slideshowList)" />
    <DetailInfos :title="data.goodsName" :price="data.costPrice" />
    <DetailSelect :data="data" />
    <DetailDisplay :isString="true" :data="data.detailContent" />
  </view>
</template>

<script lang="ts" setup>
import CustomDetailNavbar from '@/components/custom-detail-navbar/index.vue'
import DetailInfos from './components/detail-infos/index.vue'
import DetailSelect from './components/detail-select/index.vue'
import DetailDisplay from './components/detail-display/index.vue'
import { mapImgs } from '@/utils/map-imgs'
import { ref } from 'vue'
import { getGoodsDetail } from '@/service/goods'
const id = ref('')

// 用来判断onShow是否加载数据
let isFirstLoad = false
onLoad((options) => {
  // 通过id获取商品信息
  if (options.id) {
    id.value = options.id
    fetchGoodsData(id.value)
  }
})
onShow(() => {
  if (isFirstLoad) {
    fetchGoodsData(id.value)
  }
})
const data = ref<any>({})

function fetchGoodsData(id: number | string) {
  getGoodsDetail(id).then((res) => {
    isFirstLoad = true
    data.value = res.data
  })
}
</script>

<style lang="scss" scoped>
.page-background {
  height: 100vh;
}
</style>
