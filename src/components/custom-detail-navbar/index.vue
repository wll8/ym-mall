<template>
  <view
    class="custom-detail-navbar"
    :style="{
      height: navInfo.showHeight,
      color: textColor,
      background: bgColor,
    }"
  >
    <view :style="{ height: navInfo.showHeight }"></view>
    <view
      class="navbar"
      :style="{
        marginTop: navInfo.statusBarHeight,
      }"
    >
      <view class="left pview" @click="backPage">
        <WSvgIcon
          name="nav-arrow-left"
          height="74rpx"
          width="74rpx"
          class="back-icon"
          v-if="isBack"
        />
        <!-- <view class="btn" ></view> -->
      </view>
      <view class="center pview">{{ title }}</view>
      <view class="right pview">
        <slot name="right">
          <view class="share flex justify-end g-todo-hide" @click="shareClick">
            <WSvgIcon name="nav-share" width="72rpx" height="74rpx" />
          </view>
        </slot>
      </view>
    </view>
  </view>
  <!-- 占位高度 -->
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const emit = defineEmits(['backPage', 'share'])
interface IProps {
  title?: string
  isBack?: boolean
  bgColor?: string
  textColor?: string
}
withDefaults(defineProps<IProps>(), {
  title: '',
  isBack: true,
  bgColor: 'transparent',
  textColor: '#fff',
})
const navInfo = reactive({
  // 状态栏高度
  statusBarHeight: `${uni.getStorageSync('statusBarHeight')}px`,
  // 导航栏高度
  navigationBarHeight: `${uni.getStorageSync('navigationBarHeight')}px`,
  // 胶囊按钮高度
  menuButtonHeight: `${uni.getStorageSync('menuButtonHeight')}px`,
  // 导航栏和状态栏高度
  navigationBarAndStatusBarHeight: `${uni.getStorageSync('statusBarHeight') + uni.getStorageSync('navigationBarHeight')}px`,
  // 展示高度
  showHeight: `${uni.getStorageSync('statusBarHeight') + 8}px`,
})
// 点击返回按钮
function backPage() {
  uni.navigateBack({
    delta: 1,
  })
  emit('backPage')
}
// 点击分享按钮
function shareClick() {
  emit('share')
}
</script>

<style lang="scss" scoped>
.custom-detail-navbar {
  position: fixed;
  top: 0rpx;
  right: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  background-color: transparent;
}

.white-icon {
  box-sizing: border-box;
  width: 18rpx;
  height: 18rpx;
  margin-left: 34rpx;
  border: 5rpx solid #fff;
  border-top: none;
  border-right: none;
  transform: rotate(45deg);
}

.share {
  width: 100%;
  padding-right: 30rpx;
}

.left {
  position: relative;
}

.left .btn {
  position: absolute;
  left: 0;
  /* stylelint-disable-next-line order/properties-order */
  right: 0;
  /* stylelint-disable-next-line order/properties-order */
  top: 0;
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  bottom: 0;
  z-index: 1000;
  background-color: pink;
}

.navbar {
  display: flex;
  width: 100%;
}

.navbar > .pview {
  display: flex;
  align-items: center;
  height: 100%;
}

.left,
.right {
  display: flex;
  align-items: center;
  width: 120rpx;
}

.back-icon {
  width: 18rpx;
  height: 32rpx;
  margin-left: 30rpx;
}

.center,
.left {
  font-size: 26rpx;
}

.left .icon {
  width: 18rpx;
  /* margin-left: ; */
  padding-left: 30rpx;
  overflow: hidden;
  font-size: 38rpx;
  font-weight: bold;
}

.center {
  flex: 1;
  justify-content: center;
  text-align: center;
}
</style>
