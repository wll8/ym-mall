<template>
  <view class="add-goods-param">
    <view class="good-item" v-for="(item, index) in infos" :key="index">
      <view class="param-name">
        <input
          v-model="item.paramName"
          class="inp"
          :disabled="disabled"
          placeholder="请输入参数名称"
        />
      </view>
      <view class="param-value">
        <input
          class="inp"
          v-model="item.paramValue"
          :disabled="disabled"
          placeholder="请输入参数值"
        />
      </view>
      <view class="right" v-if="!disabled">
        <view class="svg-icon si-del" @click="delAddInfo(index)"></view>
        <view
          class="svg-icon si-add"
          @click="addInfo"
          v-show="index === infos.length - 1"
          ml-4
        ></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { showToast } from '@/utils/interaction'
interface IInfo {
  paramName: string
  paramValue: string
}
interface IProps {
  modelValue?: IInfo[]
  disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: () => [],
  disabled: false,
})
const emit = defineEmits(['update:modelValue'])
const infos = ref<IInfo[]>([])

watchEffect(() => {
  infos.value = props.modelValue
})
// 添加商品参数
const addInfo = () => {
  infos.value.push({
    paramName: '',
    paramValue: '',
  })
  emit('update:modelValue', infos)
}

// 删除商品行
function delAddInfo(index: number) {
  if (infos.value.length === 1) {
    showToast('最少请填写一个商品参数')
    return
  }
  infos.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.add-goods-param {
  width: 100%;
  margin-top: 8rpx;
}

.good-item {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 14rpx;

  .param-name,
  .param-value {
    flex: 1;

    input {
      width: 100%;
    }
  }
}

.right {
  display: flex;
  width: 70px;
}
</style>
