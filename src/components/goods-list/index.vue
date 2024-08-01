<template>
  <view class="goods-list">
    <GoodsItemCard v-for="item in data" :data="item" :key="item.id" @card-click="handleCardClick">
      <template #default="scope">
        <slot :row="scope.row"></slot>
      </template>
    </GoodsItemCard>
  </view>
</template>

<script lang="ts" setup>
import GoodsItemCard from './c-cpns/goods-item-card.vue'
interface IProps {
  data: any[]
}
const emit = defineEmits(['cardClick'])
withDefaults(defineProps<IProps>(), {
  data: () => [],
})
function handleCardClick(data) {
  emit('cardClick', data)
}
</script>

<style lang="scss" scoped>
/*
  .goods-list {
    flex-wrap: wrap;
    margin: 0 -11px;
  }
*/
</style>
