<template>
  <view class="">
    <div class="search-result">
      <scroll-view
        :scroll-top="0"
        scroll-y="true"
        class="scroll-Y"
        @scrolltoupper="upper"
        @scrolltolower="lower"
        @scroll="scroll"
      >
        <zlxls-goods-list :productList="goodsList" :column="2" :status="moreStatus" />
      </scroll-view>
    </div>
  </view>
</template>

<script lang="js" setup>
import { getGoods } from '@/service/goods'
const moreStatus = ref(`loading`)
const current = ref(1)
const size = ref(10)
const props = defineProps({
  topheight: {
    type: String,
    default: `0px`,
  },
  keyword: {
    type: String,
    default: ``,
  },
  querys: {
    type: Object,
    default: () => ({}),
  },
})
const { querys, topheight, keyword } = props

const goodsList = ref([])
const getGoodsFn = () => {
  moreStatus.value = `loading`
  getGoods({
    current: current.value,
    size: size.value,
    goodsName: keyword,
    userId: querys.merchantId,
  }).then((res) => {
    goodsList.value = [
      ...goodsList.value,
      ...res.data.records.map((item) => ({
        id: item.id,
        name: item.goodsName,
        marks: [],
        cover: item.goodsCover,
        total: item.salePrice,
        number: item.totalSales,
        cate_name: [item.activityName].filter(Boolean),
      })),
    ]
    if (res.data.total <= goodsList.value.length) {
      moreStatus.value = `noMore`
    } else {
      moreStatus.value = `more`
      current.value = current.value + 1
    }
  })
}
getGoodsFn()

const upper = () => {
  // console.log(`upper`)
}

const lower = () => {
  moreStatus.value !== `noMore` && getGoodsFn()
}

const scroll = () => {
  // console.log(`scroll`)
}
</script>

<style lang="scss" scoped>
.scroll-Y {
  height: calc(100vh - v-bind(topheight));
}
</style>
