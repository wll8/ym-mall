<template>
  <view class="tabs" :style="{ position: sticky, backgroundColor: bgColor }">
    <uv-tabs
      :list="list"
      lineWidth="32"
      lineColor="#B22338"
      lineHeight="6px"
      :activeStyle="{
        color: '#B22338',
        fontWeight: 'bold',
      }"
      :inactiveStyle="{
        color: '#999999',
      }"
      :current="currentIndex"
      itemStyle="height: 34px; align-items: flex-start; padding-left: 15px; padding-right: 15px; "
      @change="tabChange"
      :scrollable="isScroll"
    ></uv-tabs>
  </view>
</template>

<script lang="ts" setup>
interface ITab {
  count?: number | string
  text: string
  value?: any
}
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
const list = computed(() => {
  return props.tabs.map((item) => {
    let badge: any = null

    if (props.isCount && item.count != null && item.count !== '') {
      badge = {
        value: item.count,
      }
    }

    return {
      name: item.text,
      badge,
    }
  })
})
const isScroll = computed(() => {
  return props.tabs.length > 4
})
watchEffect(() => {
  currentIndex.value = props.index
})

function tabChange({ index }: any) {
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
  padding-top: 24rpx;

  :deep(.uv-tabs__wrapper__nav__item__text) {
    font-size: 30rpx;
    font-weight: bold;
  }
}
</style>
