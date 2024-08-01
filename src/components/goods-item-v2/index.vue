<template>
  <view class="goods-item-v2" :style="{ paddingBottom: isPaddingBottom ? '24rpx' : '0' }">
    <view class="item-cover">
      <image mode="widthFix" :src="data.goodsCover" class="img" />
    </view>
    <view class="goods-info">
      <view class="goods-info-wrap">
        <view class="info-title">{{ data?.goodsName }}</view>
        <!-- <view class="menu-wrap mt2">
          <wd-drop-menu>
            <wd-drop-menu-item
              disabled
              :model-value="modelValue.specificationsId"
              :options="data.商品规格"
              value-key="id"
              label-key="name"
            />
          </wd-drop-menu>
        </view> -->
        <view class="choose-weight" @click="onChoose">
          <view class="weight-left">
            {{ data?.goodsSpec }}
          </view>
          <!-- <view class="weight-right flex justify-center items-center">
            <WSvgIcon name="arrow-down" width="32rpx" height="32rpx" />
          </view> -->
        </view>
        <view class="pay-info">
          <DisplayPrice :value="data?.salePrice" />
          <Counter
            v-if="isCounter"
            :max-value="data?.totalStock"
            :model-value="modelValue?.num"
            @update:model-value="changeCount"
          />
          <view class="show-numb" v-else>x{{ modelValue?.num }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import DisplayPrice from '../display-price/index.vue'
import Counter from '../counter/index.vue'
import { IPayGoods } from '@/service/order/type'

interface IProps {
  isPaddingBottom?: boolean
  data?: any
  modelValue?: IPayGoods
  isCounter?: boolean
}
const emit = defineEmits(['choose', 'update:modelValue'])
const props = withDefaults(defineProps<IProps>(), {
  isPaddingBottom: true,
  isCounter: true,
})

// 改变商品购买数据
function changeCount(count: number) {
  const modelValue = props.modelValue
  const data = props.data
  if (modelValue && modelValue.goodsId && data) {
    const info = { ...modelValue, num: count }
    emit('update:modelValue', info)
  }
}
// 改变商品规格
function changeSpecificationId(specificationsId: IdType) {
  const modelValue = props.modelValue
  if (modelValue && modelValue.goodsId) {
    const info = { ...modelValue, specificationsId }
    emit('update:modelValue', info)
  }
}

// 发送事件
function onChoose() {
  emit('choose')
}
</script>

<style lang="scss" scoped>
.goods-item-v2,
.pay-info {
  display: flex;
}

.goods-item-v2 {
  padding: 24rpx 32rpx;
  background-color: #fff;

  .menu-wrap {
    line-height: 1;
    --wot-drop-menu-height: 1;

    text-align: left;

    :deep(.wd-drop-menu__item) {
      text-align-last: left;
    }

    :deep(.wd-drop-menu__item-title) {
      padding-left: 0;
    }
  }

  .item-cover {
    display: flex;
    align-items: center;
    width: 144rpx;
    height: 144rpx;
    margin-right: 24rpx;
    overflow: hidden;
    border-radius: 10rpx;
  }
}

.goods-info {
  flex: 1;

  .goods-info-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: 100%;
  }
}

.choose-weight {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 300rpx;
  padding: 6rpx 20rpx;
  margin-top: 8rpx;
  overflow: hidden;
  color: #999;
  cursor: pointer;
  background-color: #fafafa;
  border-radius: 6rpx;
}

.pay-info {
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #999;
}
</style>
