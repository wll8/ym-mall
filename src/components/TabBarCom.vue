<template>
  <view class="tab-bar" v-show="!isHide">
    <view class="content">
      <view
        class="one-tab"
        v-for="(item, index) in tabBarList"
        :key="index"
        @click="selectTabBar(index)"
      >
        <view>
          <view class="tab-img">
            <image
              v-show="tabIndex === index"
              class="img"
              :src="httpurl(item.selectedIconPath)"
            ></image>
            <image v-show="!(tabIndex === index)" class="img" :src="httpurl(item.iconPath)"></image>
          </view>
        </view>
        <view v-show="tabIndex === index" class="tit select-texts">{{ item.text }}</view>
        <view v-show="!(tabIndex === index)" class="tit texts">{{ item.text }}</view>
      </view>
    </view>
  </view>
  <view class="tab-bar-box" :style="{ height: tabbarHeight + 'px' }" v-show="tabbarHeight">
    &nbsp;
  </view>
</template>

<script setup lang="ts">
import { useTabbarStore } from '@/store/tabbar'
import { getLastItem } from '@/utils'

const { tabBarList, tabIndex, tabbarHeight, isHide } = storeToRefs(useTabbarStore())

function selectTabBar(index: number) {
  tabIndex.value = index
  uni.redirectTo({ url: tabBarList.value[index].pagePath })
}

onShow(() => {
  const pages = getCurrentPages()
  const lastPage = getLastItem(pages) || {}
  const currRoute = lastPage.$page
  if (!currRoute) {
    return undefined
  }
  console.log(`redirect`, currRoute)

  const index = tabBarList.value.findIndex(
    (e) => e.pagePath === ((currRoute.fullPath || ``).replace(/\?.*$/, ``) || currRoute.path),
  )
  index !== -1 && (tabIndex.value = index)
})
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  padding-top: 10rpx;
  padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
  background-color: #fff;

  .content {
    display: flex;

    .one-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;

      .tab-img {
        width: 50rpx;
        height: 50rpx;
        margin-top: 5px;

        .img {
          width: 100%;
          height: 100%;
        }
      }

      .tit {
        font-size: 30rpx;
        transform: scale(0.7);
      }

      .select-texts {
        color: #018d71;
      }

      .texts {
        color: block;
      }
    }
  }
}
</style>
