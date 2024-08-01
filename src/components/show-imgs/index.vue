<template>
  <view class="show-imgs">
    <view
      class="item-wrap"
      :style="{ width, padding }"
      v-for="(item, index) in data"
      :key="index"
      @click="showImage(item.path)"
    >
      <view class="item">
        <image class="img" mode="widthFix" :src="item.path" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  width?: string // 百分比
  padding?: string
  data?: FileInfo[]
}
const props = withDefaults(defineProps<IProps>(), {
  width: '25%',
  padding: '8rpx',
  data: () => [],
})
const fetchImgs = () => {
  const imgs = props.data.map((item) => item.path)
  return imgs
}
function showImage(item: any) {
  uni.previewImage({
    current: item,
    urls: fetchImgs(),
  })
}
</script>

<style lang="scss" scoped>
.show-imgs {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 -8rpx;
  margin-top: 24rpx;
  cursor: pointer;

  .item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 160rpx;
    overflow: hidden;
    background-color: rgb(0 0 0 / 30%);
    border-radius: 8rpx;
  }

  .img {
    width: 100%;
    height: 100%;
  }
}
</style>
