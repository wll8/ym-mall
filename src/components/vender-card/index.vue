<template>
  <view class="goods-card" @click="cardClick">
    <CommonCard :header-info="headerInfo" :type="cardType" :model-value="checked">
      <view class="goods-content">
        <view class="goods-list">
          <view class="goods-item">
            <view class="goods-cover">
              <image mode="scaleToFill" class="cover-img" :src="props.data?.goodsImage" />
            </view>
            <view class="goods-info">
              <view class="goods-title">{{ props.data?.goodsName }}</view>
              <view class="info-tips">
                <view class="info-tip">
                  <view class="info-tip-left">规格：</view>
                  <view class="info-tip-right">{{ props.data?.goodsSpec }}</view>
                </view>
                <view class="info-tip">
                  <view class="info-tip-left">数量：</view>
                  <view class="info-tip-right">{{ props.data?.goodsNum }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="goods-count" v-if="!isHidePrice">
          <view class="goods-tips">共 1 件商品，合计：</view>
          <view class="price">¥{{ data?.paymentAmount }}</view>
        </view>
      </view>
    </CommonCard>
  </view>
</template>

<script lang="ts" setup>
import type { IHeaderInfo } from '../common-card/type'

const emit = defineEmits(['cardClick', 'selectChange'])
interface IProps {
  headerInfo: IHeaderInfo
  data?: any
  isChecked?: boolean
  checked?: boolean
  isHidePrice?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  data: () => {},
  isChecked: false,
  checked: false,
  isHidePrice: false,
})

function cardClick() {
  emit('cardClick')
}

// 得到卡片类型
const cardType = computed(() => {
  return props.isChecked ? 'check' : 'normal'
})
</script>

<style lang="scss" scoped>
.goods-content {
  .goods-item {
    display: flex;
    padding: 10rpx 0;
    border-bottom: 2rpx solid #f5f5f5;

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  margin-top: 18rpx;
}

.goods-cover {
  display: flex;
  width: 160rpx;
  height: 160rpx;
  overflow: hidden;
  border-radius: 10rpx;

  .cover-img {
    width: 100%;
    height: 100%;
  }
}

.goods-info {
  margin-left: 20rpx;

  .goods-title {
    font-size: 28rpx;
    font-weight: bold;
    line-height: 44rpx;
    color: #333;
  }

  .info-tip {
    display: flex;
    margin-top: 8rpx;
    line-height: 40rpx;

    .info-tip-left {
      color: #9e9e9e;
    }

    .info-tip-right {
      color: #777;
    }
  }
}

.goods-count {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #707070;

  .price {
    font-size: 28rpx;
    font-style: normal;
    font-weight: 800;
    line-height: 44rpx;
    color: #b22338;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24rpx;

  .footer-buttons {
    display: flex;

    & > view {
      margin-left: 16rpx;

      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
