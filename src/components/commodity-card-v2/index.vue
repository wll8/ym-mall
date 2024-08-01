<template>
  <view class="commodity-card-v2">
    <GoodsCard
      :data="data"
      @card-click="cardClick(data)"
      :header-info="{ title, ...headerOption }"
      :buttons="buttons"
      :checked="checked"
      @selectChange="selectChange"
      :is-checked="isChecked"
      :is-hide-price="isHidePrice"
      :is-buy-info="isBuyInfo"
    />
  </view>
</template>
<script lang="ts" setup>
import GoodsCard from '../goods-card/index.vue'
import type { ICardOption } from './type'
import type { IButton, ISelectChangeValue } from '../goods-card/type'
const emit = defineEmits(['cardClick', 'selectChange'])
interface IProps {
  data?: any
  buttons?: IButton[]
  title?: string
  headerOption?: ICardOption
  checked?: boolean
  isHidePrice?: boolean
  isChecked?: boolean
  isBuyInfo?: boolean
}
withDefaults(defineProps<IProps>(), {
  isHidePrice: false,
  checked: true,
  isChecked: false,
  buttons: () => [],
  data: {},
  isBuyInfo: false,
})

function cardClick(item: any) {
  emit('cardClick', item)
}
function selectChange(value: ISelectChangeValue) {
  emit('selectChange', value)
}
</script>

<style lang="scss" scoped>
//
</style>
