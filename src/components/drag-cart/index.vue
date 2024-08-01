<template>
  <view>
    <extWdxFab position="right-bottom" draggable @click="toCar">
      <view class="num">{{ carNum >= 99 ? `99+` : carNum }}</view>
      <view class="cart">
        <view i-carbon-shopping-cart></view>
      </view>
    </extWdxFab>
  </view>
</template>

<script lang="js" setup>
import { useCarStore } from '@/store/car'
import extWdxFab from '@/components/ext-wd-fab/wd-fab.vue'

const carStore = useCarStore()
const { carNum = 0 } = storeToRefs(carStore)

const toCar = () => {
  uni.navigateTo({
    url: '/pages/car/index',
  })
}
const fabActive = ref(true)
watch(fabActive, (val) => {
  console.log(`val`, val)
  // toCar()
})
</script>

<style lang="scss" scope>
.num {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  font-size: 10px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  background-color: #f00;
  border-radius: 50%;
}

.cart {
  width: 60px;
  height: 60px;
  font-size: 30px;
  line-height: 60px;
  text-align: center;
  background-color: #fff;
  border-radius: 50%;
}
</style>
