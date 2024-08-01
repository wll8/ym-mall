<template>
  <view class="me-cards">
    <view class="cards-header flex items-center justify-between mx15px mb3" @click="toPage(link)">
      <view class="header-title">{{ title }}</view>
      <view class="header-right" flex items-center>
        {{ subTitle }}
        <uni-icons type="right" size="16" ml20rpx></uni-icons>
      </view>
    </view>
    <wd-card class="card" v-if="cellList.length">
      <view class="card-content" flex>
        <view
          class="card-item flex-1"
          v-for="(item, index) in cellList"
          @click="toPage(item.link)"
          :key="index"
        >
          <template v-if="item.iconType === 'image'">
            <wd-img :width="25" :height="25" :src="httpurl(item.icon)" />
          </template>
          <template v-else>
            <view :class="`item-icon svg-icon si-${item.icon}`" w25px h25px></view>
          </template>
          <view class="name">{{ item.name }}</view>
          <view class="count" v-if="item.count">{{ item.count }}</view>
        </view>
      </view>
    </wd-card>
  </view>
</template>

<script lang="ts" setup>
interface CellListItem {
  name: string // 标签名
  icon: string //  图标
  iconType?: 'svg' | 'image'
  count?: number // 数量
  link?: string // 路径
}

const props = withDefaults(
  defineProps<{
    title?: string
    subTitle?: string
    link?: string
    cellList?: CellListItem[]
  }>(),
  {
    cellList: () => [],
    myOrdersItem: () => [],
    orderLink: '',
    title: '',
    subTitle: '',
  },
)
function toPage(link: string) {
  uni.navigateTo({
    url: link,
  })
}
</script>

<style lang="scss" scoped>
.header-title {
  font-size: 32rpx;
  font-weight: bold;
}

.header-right {
  font-size: 24rpx;
  color: #999;
}

.card-item {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.name {
  margin-top: 12rpx;
  color: #666;
}

.count {
  position: absolute;
  top: 0;
  right: -6rpx;
  padding: 0 12rpx;
  color: #fff;
  background-color: #b22338;
  border-radius: 16px 16px 16px 2px;
}
</style>
