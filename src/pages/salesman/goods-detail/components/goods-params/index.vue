<template>
  <view class="goods-params">
    <WBottomDrawer :modelValue="modelValue" @update:modelValue="changeValue" title="商品参数">
      <view class="param-infos">
        <view class="infos-item flex items-center" v-for="item in paramsOptions" :key="item.label">
          <view class="infos-item-left">{{ item.label }}</view>
          <view class="infos-item-right">{{ item.value }}</view>
        </view>
      </view>
      <CommonButton>确定</CommonButton>
    </WBottomDrawer>
  </view>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue'])
function changeValue(value: boolean) {
  emit('update:modelValue', value)
}

interface IProps {
  modelValue: boolean
  options?: any[]
  config: {
    label?: string
    value?: string
  }
}
const props = withDefaults(defineProps<IProps>(), {
  options: () => [],
})
// 获取遍历信息
const paramsOptions = computed<IBaseOption<string>[]>(() => {
  const { config, options } = props
  const labelTitle = config.label || 'label'
  const valueTitle = config.value || 'value'
  const newOptions: IBaseOption<string>[] = options.map((item) => ({
    label: item[labelTitle],
    value: item[valueTitle],
  }))
  return newOptions
})
</script>

<style lang="scss" scoped>
.infos-item {
  .infos-item-left {
    width: 240rpx;
    color: #999;
  }

  padding: 28rpx 0;
  font-size: 28rpx;
  border-bottom: 2rpx solid #eee;

  &:last-child {
    border-bottom: none;
  }
}
</style>
