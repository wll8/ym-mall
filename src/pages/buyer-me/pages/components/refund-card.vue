<template>
  <view class="business-card" :class="{ cardBorder: isBorder }" @click="toDetail">
    <view
      class="business-status"
      :style="{ color: statusInfos?.[data?.registerState]?.color }"
      flex
      justify-end
    >
      {{ statusInfos?.[data?.registerState]?.text }}
    </view>
    <view class="card-head">
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
          <view class="count-info-item" flex>
            <view class="info-item-left">订单数量：</view>
            <view class="info-item-right">{{ data?.orderNum }}笔</view>
          </view>
        </view>
      </view>
      <view v-if="isRight" class="right-icon svg-icon si-arrow-right"></view>
    </view>
    <view class="buttons" flex justify-end v-if="10 === stringToNumber(data.registerState)">
      <CardButton width="160rpx" @click.stop="onRejected">拒绝</CardButton>
      <view ml-14rpx>
        <CardButton
          width="160rpx"
          @click.stop="onAgree"
          bgColor="#f0f9eb"
          color="#67c23a"
          borderColor="#67c23a"
        >
          同意
        </CardButton>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import useBusinessStore from '@/store/business'
import { stringToNumber } from '@/utils/string-to-number'
interface IProps {
  data?: any
  isRight?: boolean
  isBorder?: boolean
}
const emit = defineEmits(['update:modelValue', 'rejected', 'agree'])
const props = withDefaults(defineProps<IProps>(), {
  isRight: true,
  isBorder: true,
  isButton: false,
})
// 状态提示内容
const statusInfos = {
  10: {
    text: '申请中',
    color: '#e6a23c',
  },
  20: {
    text: '已通过',
    color: '#67c23a',
  },
  30: {
    text: '已駁回',
    color: '#f56c6c',
  },
}
// 去商品详情
function toDetail() {
  if (!props.isRight) {
    return
  }
  useBusinessStore().changeBusinessInfoAction(props.data)
  uni.navigateTo({ url: `/pages/salesman/business-detail/index?id=${props.data.id}` })
}

// 事件处理
// 拒绝按钮点击
function onRejected() {
  emit('rejected', props.data)
}
// 同意按钮点击
function onAgree() {
  emit('agree', props.data)
}
</script>

<style lang="scss" scoped>
.business-card {
  padding: 34rpx 0;
}

.cardBorder {
  border-bottom: 2rpx solid #eee;
}

.business-card {
  .card-head {
    display: flex;
    align-items: center;
  }

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
}

.right-icon {
  width: 32rpx;
  height: 32rpx;
}

.buttons {
  margin-top: 16rpx;
}
</style>
