<template>
  <view class="tabs" :style="{ position: sticky, backgroundColor: bgColor }">
    <view class="tab-item" @click="tabChange(index)" v-for="(item, index) in tabs" :key="item">
      <view class="tab-item-text" :class="{ active: index === currentIndex }">
        {{ item.text }}
        <view class="count" v-if="isCount && item.count !== ''">{{ item.count ?? 0 }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ITab } from './type'

interface IProps {
  tabs: ITab[]
  index?: number
  isCount?: boolean
  isSticky?: boolean
  bgColor?: string
}
const props = withDefaults(defineProps<IProps>(), {
  index: 0,
  isCount: false,
  isSticky: true,
  bgColor: '#f9f9f9',
})
const emit = defineEmits(['tabChange'])
const currentIndex = ref(0)
watchEffect(() => {
  currentIndex.value = props.index
})

function tabChange(index: number) {
  currentIndex.value = index
  const info = {
    index,
    value: props.tabs[index].value,
  }
  emit('tabChange', info)
}
const sticky = computed(() => {
  return props.isSticky ? 'sticky' : 'static'
})
</script>

<style lang="scss" scoped>
.tabs {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding-top: 24rpx;

  .tab-item {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 44rpx;
    color: #999;

    .count {
      position: absolute;
      top: 0;
      right: -6rpx;
      z-index: 22;
      padding: 4rpx 12rpx;
      font-size: 20rpx;
      line-height: 28rpx;
      color: #fff;
      background: #b22338;
      border-radius: 50%;
      transform: translateX(100%);
    }
  }

  .tab-item .tab-item-text {
    position: relative;
    padding-bottom: 24rpx;

    &.active {
      color: #b22338;

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 12rpx;
        content: '';
        background: #dd5468;
        border-radius: 6rpx;
      }
    }
  }
}
</style>
