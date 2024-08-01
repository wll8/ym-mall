/* stylelint-disable order/properties-order */
<template>
  <view class="show-custom-service" v-if="modelValue">
    <view class="mask" @click="changeValue(false)"></view>
    <view class="content">
      <view class="title">客服电话</view>
      <view class="close svg-icon si-close" @click.stop="changeValue(false)"></view>
      <view class="phone-list">
        <view
          class="list-item c-red"
          v-for="(item, index) in phoneList"
          :key="index"
          @click="toPhone(item)"
        >
          {{ item.dictKey }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getCustomerPhoneList } from '@/service/user'

const emit = defineEmits(['update:modelValue'])
function changeValue(value: boolean) {
  emit('update:modelValue', value)
}

interface IProps {
  modelValue?: boolean
}
withDefaults(defineProps<IProps>(), {
  options: () => [],
  modelValue: true,
})
const phoneList = ref<any[]>([])
onMounted(() => {
  getCustomerPhoneList().then((res) => {
    phoneList.value = res.data
  })
})

// 去打电话
function toPhone(item: any) {
  uni.makePhoneCall({
    phoneNumber: item.dictKey, // 仅为示例
  })
}
</script>

<style lang="scss" scoped>
.phone-list {
  .list-item {
    position: relative;
    padding: 20rpx 0 18rpx 10rpx;
    margin: 20rpx 0;
    overflow: hidden;
    font-size: 30rpx;
    font-weight: bold;
    background-color: #ecf0f1;
    border-left: 10rpx solid #27ae58;
    border-radius: 10rpx;

    &::after {
      position: absolute;
      top: 50%;
      right: 40rpx;
      box-sizing: border-box;
      width: 26rpx;
      height: 26rpx;
      content: '';
      border: 6rpx solid #ccc;
      border-bottom-color: transparent;
      border-left-color: transparent;
      transform: rotate(45deg) translateY(-50%);
    }
  }
}

.mask {
  position: fixed;
  left: 0;
  /* stylelint-disable-next-line order/properties-order */
  right: 0;
  /* stylelint-disable-next-line order/properties-order */
  top: 0;
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  bottom: 0;
  z-index: 333;
  background-color: rgb(0 0 0 / 20%);
}

.content {
  position: fixed;
  top: 50%;
  right: 24rpx;
  left: 24rpx;
  z-index: 999;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  transform: translateY(-50%);

  .title {
    font-size: 30rpx;
    font-weight: bold;
    text-align: center;
  }

  .close {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
  }
}
</style>
