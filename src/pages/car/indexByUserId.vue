<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '商家购物车',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view :class="[`read`, 'page pb10']" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <carListCom :carList="carList" />
  </view>
</template>

<script lang="js" setup>
import { listByUserId } from '@/service/goods'
import carListCom from './carListCom.vue'
const carList = ref([])

const query = ref({
  userId: undefined,
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad((arg) => {
  query.value = arg
  listByUserId({
    userId: query.value.userId,
  }).then((res) => {
    carList.value = res.data || []
  })
})
</script>

<script lang="js">
export default {
  options: { styleIsolation: 'shared' },
}
</script>

<style lang="scss" scoped>
.page {
  &.read {
    ::v-deep .acc,
    ::v-deep .check-box {
      pointer-events: none;
      opacity: 0;
    }
  }
}
</style>
