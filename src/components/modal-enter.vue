<template>
  <view class="modal-enter" v-if="show">
    <view class="mask"></view>
    <view class="content">
      <view class="title">{{ title }}</view>
      <view class="enter-form">
        <uv-textarea v-model="inpValue" placeholder="请输入" autoHeight></uv-textarea>
      </view>
      <view class="footer">
        <view flex-1>
          <CommonButton width="100%" @click="cancel" color="#666" bg-color="#f5f5f5">
            取消
          </CommonButton>
        </view>
        <view flex-1 style="margin-left: 16rpx">
          <CommonButton width="100%" @click="onConfirm">确定</CommonButton>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { showToast } from '@/utils/interaction'

interface IProps {
  show?: boolean
  title?: string
}
withDefaults(defineProps<IProps>(), {
  show: false,
})
const emit = defineEmits(['update:show', 'confirm'])
const inpValue = ref('')

// 取消确定
function cancel() {
  emit('update:show', false)
}
// 点击确定
function onConfirm() {
  if (!inpValue.value) {
    showToast('未填写内容，请填写后确认?')
    return
  }
  cancel()
  emit('confirm', inpValue.value)
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  /* stylelint-disable-next-line order/properties-order */
  right: 0;
  /* stylelint-disable-next-line order/properties-order */
  top: 0;
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  bottom: 0;
  z-index: 998;
  background-color: rgb(0 0 0 / 10%);
}

.content {
  position: fixed;
  top: 50%;
  right: 40rpx;
  left: 40rpx;
  z-index: 999;
  padding: 40rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 20rpx;
  transform: translateY(-50%);

  .title {
    margin-bottom: 42rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
  }
}

.enter-form {
  padding-top: 20px;
  padding-bottom: 20px;
}

.footer {
  display: flex;
  margin-top: 40rpx;
}
</style>
