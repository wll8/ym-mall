<template>
  <view class="detail-swiper">
    <swiper
      class="swiper"
      circular
      :current="currentIndex"
      @change="changeCurrentIndex"
      :indicatorDots="config.indicatorDots"
      :autoplay="config.autoplay"
      :duration="config.duration"
      :style="{ height: swiperHeight + 'px' }"
    >
      <swiper-item v-for="(item, index) in images" :key="index" @click="showImage(item.path)">
        <view :class="`swiper-item swiper-item-${index}`">
          <image mode="widthFix" :src="item.path" class="img" @load="loadImage" />
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'

interface IProps {
  data?: FileInfo[]
}
const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
})

// swiperHeight 的高度
const swiperHeight = ref(375)

// 当前切块的索引
const currentIndex = ref(0)

const images = computed(() => {
  return props.data || []
})
const config = reactive({
  indicatorDots: false,
  autoplay: true,
  interval: 2000,
  duration: 500,
})

const imgs = ref<string[]>([])
watchEffect(() => {
  imgs.value = props.data?.map((item) => item.path) || []
})
// 第一张图片加载完成设置高度
function loadImage() {
  if (currentIndex.value === 0) {
    nextTick(() => {
      setSwiperHeight()
    })
  }
}
function showImage(item: string) {
  uni.previewImage({
    current: item,
    urls: imgs.value,
  })
}

// 切换当前索引
function changeCurrentIndex(e) {
  const { current } = e.detail
  currentIndex.value = current
  nextTick(() => {
    setSwiperHeight()
  })
}
function setSwiperHeight() {
  const query = uni.createSelectorQuery()
  const elName = `.swiper-item-${currentIndex.value}`
  query
    .select(elName)
    .boundingClientRect((rect: any) => {
      if (rect && rect.height) {
        swiperHeight.value = rect.height
      }
    })
    .exec()
}
</script>

<style lang="scss" scoped>
.detail-swiper {
  width: 100%;
}

.swiper {
  position: relative;
}

.swiper-item {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;

  .img {
    width: 100%;
    height: 100%;
  }
}
</style>
