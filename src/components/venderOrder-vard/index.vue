<template>
  <view class="commodity-card">
    <GoodsCard
      :data="data"
      :header-info="{ title, ...headerOption }"
      :isHidePrice="isHidePrice"
      @cardClick="cardClick"
    />
  </view>
</template>

<script lang="ts" setup>
import GoodsCard from '../vender-card/index.vue'
import type { ICardOption } from './type'
import type { IButton } from '../goods-card/type'
const emit = defineEmits(['cardClick'])
interface IProps {
  data?: any
  buttons?: IButton[]
  title?: string
  headerOption?: ICardOption
  isHidePrice?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  isHidePrice: false,
})
function cardClick(item: any) {
  console.log('进入了')
  emit('cardClick', item)
}
</script>

<style lang="scss" scoped>
//
</style>
