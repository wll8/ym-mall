<template>
  <view class="commodity-card">
    <GoodsCard
      :data="data"
      @card-click="cardClick(data)"
      :header-info="{ title, ...headerOption }"
      :buttons="buttons"
    />
  </view>
</template>

<script lang="ts" setup>
import GoodsCard from '../goods-card/index.vue'
import type { ICardOption } from './type'
import type { IButton } from '../goods-card/type'
const emit = defineEmits(['cardClick'])
interface IProps {
  data?: any
  buttons?: IButton[]
  title?: string
  headerOption?: ICardOption
}

const props = defineProps<IProps>()
function cardClick(item: any) {
  emit('cardClick', item)
}
</script>

<style lang="scss" scoped>
//
</style>
