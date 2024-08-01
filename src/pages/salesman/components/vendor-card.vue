<template>
  <view
    class="business-card"
    :style="{ borderBottom: isRight ? ' border-bottom: 2rpx solid #eee;' : '' }"
    @click="toDetail"
  >
    <view class="cover">
      <image :src="data?.avatar" class="img" mode="scaleToFill" />
    </view>
    <view class="business-info">
      <view class="title">{{ data?.userName }}</view>
      <view class="count-info" flex>
        <!-- <view class="count-info-item right-line" flex>
          <view class="info-item-left">商品数量：</view>
          <view class="info-item-right">件</view>
        </view> -->
        <view class="count-info-item">
          <view flex>
            <view class="info-item-left">商品数量：</view>
            <view class="info-item-right">{{ data?.goodsNum }}个</view>
          </view>
          <view flex>
            <view class="info-item-left">订单数量：</view>
            <view class="info-item-right">{{ data?.orderNum }}笔</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="isRight" class="right-icon svg-icon si-arrow-right"></view>
  </view>
</template>

<script lang="ts" setup>
import useBusinessStore from '@/store/business'

interface IProps {
  data?: any
  isRight?: boolean
}
const emit = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<IProps>(), {
  isRight: true,
})

// 去商品详情
function toDetail() {
  if (!props.isRight) {
    return
  }
  useBusinessStore().changeBusinessInfoAction(props.data)
  uni.navigateTo({ url: `/pages/salesman/vendor-detail/index?id=${props.data.id}` })
}
</script>

<style lang="scss" scoped>
.business-card {
  padding: 34rpx 0;
}

.business-card {
  display: flex;
  align-items: center;

  .business-info {
    flex: 1;
  }

  .cover {
    width: 120rpx;
    height: 120rpx;
    margin-right: 24rpx;
    overflow: hidden;
    border-radius: 50%;

    .img {
      width: 100%;
      height: 100%;
    }
  }

  .business-info {
    .title {
      margin-bottom: 16rpx;
      font-size: 32rpx;
      color: #333;
    }
  }
}

.count-info {
  line-height: 40rpx;
  color: #999;

  .right-line {
    position: relative;
    padding-right: 24rpx;

    &::after {
      position: absolute;
      top: 50%;
      right: 0;
      width: 2rpx;
      height: 28rpx;
      content: '';
      background-color: #ddd;
      transform: translateY(-50%);
    }

    padding-left: 24rpx;

    &:first-child {
      padding-left: 0;
    }
  }

  .right-icon {
    width: 32rpx;
    height: 32rpx;
  }
}
</style>
