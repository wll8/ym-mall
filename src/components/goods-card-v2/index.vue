<template>
  <view class="goods-card" @click="cardClick">
    <CommonCard
      :header-info="headerInfo"
      :type="cardType"
      :model-value="checked"
      @update:modelValue="changeChecked"
    >
      <view class="goods-content">
        <view class="goods-list">
          <view class="goods-item">
            <view class="goods-item-top flex">
              <view class="goods-cover">
                <image mode="widthFix" class="cover-img" :src="data?.goodsImage" />
              </view>
              <view class="goods-info">
                <view class="goods-title">{{ data?.goodsName }}</view>
                <view class="info-tips">
                  <view class="info-tip">
                    <view class="info-tip-left">规格：</view>
                    <view class="info-tip-right">{{ data?.goodsSpec }}</view>
                  </view>
                  <view class="info-tip">
                    <view class="info-tip-left">数量：</view>
                    <view class="info-tip-right">{{ data?.goodsNum }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="goods-count" v-if="!isHidePrice">
          <view class="goods-tips">共 {{ data?.goodsNum }} 件商品，合计：</view>
          <view class="price">¥{{ data?.paymentAmount }}</view>
        </view>
      </view>
      <view class="footer">
        <slot name="footer">
          <view class="footer-buttons">
            <template v-for="(item, index) in buttons" :key="index">
              <template v-if="item.type === 'normal'">
                <view>
                  <CardButton :key="index" @click.stop="item.click(data)">
                    {{ item.label }}
                  </CardButton>
                </view>
              </template>
              <template v-else>
                <view>
                  <GrayCardButton :key="index" @click.stop="item.click(data)">
                    {{ item.label }}
                  </GrayCardButton>
                </view>
              </template>
            </template>
          </view>
        </slot>
      </view>
    </CommonCard>
  </view>
</template>

<script lang="ts" setup>
import type { IHeaderInfo } from '../common-card/type'
import type { IButton } from './type'
const emit = defineEmits(['cardClick', 'selectChange'])
interface IProps {
  headerInfo: IHeaderInfo
  buttons?: IButton[]
  data?: any
  isChecked?: boolean
  checked?: boolean
  isHidePrice?: boolean
  isBuyInfo?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  data: () => {},
  isChecked: false,
  checked: false,
  isHidePrice: false,
  isBuyInfo: false,
})
function cardClick() {
  emit('cardClick')
}

// 得到卡片类型
const cardType = computed(() => {
  return props.isChecked ? 'check' : 'normal'
})
// 改变是否选择
const changeChecked = (flag: boolean) => {
  const value = { check: flag, value: props.data }
  emit('selectChange', value)
}

// 去拨号
function callPhone(phone: string) {
  if (phone) {
    uni.makePhoneCall({
      phoneNumber: phone,
    })
  }
}
// 获取地址
function getAddress(item: any) {
  return `${item?.province} ${item?.city} ${item?.district} ${item?.street}`
}
</script>

<style lang="scss" scoped>
.goods-content {
  .goods-item {
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
  align-items: center;
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
  flex: 1;
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

.buy-info {
  flex-direction: column;
  font-size: 24rpx;
  font-weight: bold;

  .info-name {
    padding-bottom: 12rpx;
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
