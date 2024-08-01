<template>
  <view class="complete-delivery" v-if="show">
    <view class="mask"></view>
    <view class="content">
      <view class="title">完成配送</view>
      <view class="files">
        <UploadImages v-model:imgs-list="fileList" />
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
}
withDefaults(defineProps<IProps>(), {
  show: false,
})
const emit = defineEmits(['update:show', 'confirm'])
const fileList = ref<string[]>([])

// 取消确定
function cancel() {
  emit('update:show', false)
}
// 点击确定
function onConfirm() {
  if (!fileList.value.length) {
    showToast('未上传图片，请上传后确认?')
    return
  }
  cancel()
  emit('confirm', fileList.value)
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

.footer {
  display: flex;
  margin-top: 40rpx;
}
</style>
