<template>
  <view
    @touchmove.stop.prevent="handleTouchMove"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    :class="`wd-fab ${customClass}`"
    :style="rootStyle"
  >
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { type CSSProperties, computed, onBeforeMount, ref, watch, onBeforeUnmount } from 'vue'
import { isDef, isH5, objToStyle } from 'wot-design-uni/components/common/util'
import { reactive } from 'vue'

const props = defineProps({
  position: String,
  customClass: String,
  customStyle: String,
  zIndex: Number,
  draggable: Boolean,
  gap: Object,
})

watch(
  () => props.position,
  () => initPosition(),
)

const top = ref<number>(0)
const left = ref<number>(0)
const screen = reactive({ width: 0, height: 0 })
const fabSize = ref<number>(56)
const bounding = reactive({
  minTop: 0,
  minLeft: 0,
  maxTop: 0,
  maxLeft: 0,
})

function getBounding() {
  const sysInfo = uni.getSystemInfoSync()
  const { top = 16, left = 16, right = 16, bottom = 16 } = props.gap || {}
  screen.width = sysInfo.windowWidth
  screen.height = isH5 ? sysInfo.windowTop + sysInfo.windowHeight : sysInfo.windowHeight
  bounding.minTop = isH5 ? sysInfo.windowTop + top : top
  bounding.minLeft = left
  bounding.maxLeft = screen.width - fabSize.value - right
  bounding.maxTop = screen.height - fabSize.value - bottom
}

function initPosition() {
  const pos = props.position
  const { minLeft, minTop, maxLeft, maxTop } = bounding
  if (pos === 'left-top') {
    top.value = minTop
    left.value = minLeft
  } else if (pos === 'right-top') {
    top.value = minTop
    left.value = maxLeft
  } else if (pos === 'left-bottom') {
    top.value = maxTop
    left.value = minLeft
  } else if (pos === 'right-bottom') {
    top.value = maxTop
    left.value = maxLeft
  }
}

// 按下时坐标相对于元素的偏移量
const touchOffset = reactive({ x: 0, y: 0 })
const attractTransition = ref<boolean>(false)
function handleTouchStart(e: TouchEvent) {
  if (props.draggable === false) return

  const touch = e.touches[0]
  touchOffset.x = touch.clientX - left.value
  touchOffset.y = touch.clientY - top.value
  attractTransition.value = false
}

function handleTouchMove(e: TouchEvent) {
  if (props.draggable === false) return

  const touch = e.touches[0]
  const { minLeft, minTop, maxLeft, maxTop } = bounding
  let x = touch.clientX - touchOffset.x
  let y = touch.clientY - touchOffset.y

  if (x < minLeft) x = minLeft
  else if (x > maxLeft) x = maxLeft

  if (y < minTop) y = minTop
  else if (y > maxTop) y = maxTop

  top.value = y
  left.value = x
}

function handleTouchEnd() {
  if (props.draggable === false) return

  const screenCenterX = screen.width / 2
  const fabCenterX = left.value + fabSize.value / 2
  attractTransition.value = true
  if (fabCenterX < screenCenterX) {
    left.value = bounding.minLeft
  } else {
    left.value = bounding.maxLeft
  }
}

const rootStyle = computed(() => {
  const style: CSSProperties = {
    top: top.value + 'px',
    left: left.value + 'px',
    transition: attractTransition.value ? 'all ease 0.3s' : 'none',
  }
  if (isDef(props.zIndex)) {
    style['z-index'] = props.zIndex
  }
  return `${objToStyle(style)};${props.customStyle}`
})

onBeforeMount(() => {
  getBounding()
  initPosition()
})

onBeforeUnmount(() => {})
</script>

<style lang="scss" scoped>
@import './index';
</style>
