<template>
  <view class="goods-item-card">
    <view class="goods-info-card" @click="toEditGoods">
      <view class="cover">
        <img class="img" :src="data?.goodsCover" />
      </view>
      <view class="goods-info">
        <view class="flex justify-between">
          <view class="goods-name">{{ data?.goodsName }}</view>
        </view>

        <view class="info-bottom">
          <view class="goods-num">{{ data?.totalSales }}人购买过</view>
          <view class="price flex">
            <view class="small">¥</view>
            <view class="price-number">{{ data?.costPrice }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="card-buttons flex justify-end">
      <slot :row="data"></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  data: any
}
const emit = defineEmits(['cardClick'])
const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
})
// 去商品编辑
function toEditGoods() {
  emit('cardClick', props.data)
}
</script>

<style lang="scss" scoped>
.goods-item-card {
  // width: 50%;
  padding: 24rpx;
  margin-bottom: 24rpx;
  background-color: #fff;

  .goods-info-card {
    display: flex;

    .cover {
      display: flex;
      align-items: center;
      width: 160rpx;
      height: 160rpx;
      margin-right: 20rpx;
      overflow: hidden;
      border-radius: 10rpx;

      .img {
        width: 100%;
        height: auto;
        background-size: 100% auto;
      }
    }

    .goods-info {
      padding: 16rpx 20rpx;

      .goods-name {
        font-size: 24rpx;
        font-weight: 400;
        color: #666;
      }

      .info-bottom {
        margin-top: 16rpx;

        .goods-num {
          font-size: 20rpx;
          color: #999;
        }

        .price {
          display: flex;
          align-items: flex-end;
          margin-top: 10rpx;
          font-size: 34rpx;
          line-height: 1;
          color: #b22338;

          .small {
            font-size: 24rpx;
            line-height: 1.2;
          }

          .pice-number {
            line-height: 1;
          }
        }
      }
    }
  }
}
</style>
