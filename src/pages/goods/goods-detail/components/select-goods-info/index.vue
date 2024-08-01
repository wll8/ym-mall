<template>
  <view class="select-goods-info">
    <WBottomDrawer :modelValue="show" @update:modelValue="changeShow">
      <view class="goods-info">
        <view class="cover">
          <image :src="imageSrc" mode="scaleToFill" class="img" />
        </view>
        <view class="info">
          <view class="price-area" flex>
            <DisplayPrice :value="price" />
            <view class="real-price" text-sm flex items-center>
              实付价：¥
              <view class="price-number">{{ totalPrice }}</view>
            </view>
          </view>

          <view class="goods-num">库存：{{ inventory }}件</view>
        </view>
      </view>
      <view class="select-area">
        <view class="specifications area-item">
          <view class="title">选择规格</view>
          <view class="specifications-content">
            <GoodsSelect :active-index="modelValue" :options="goodsOptions" />
          </view>
        </view>
        <view class="select-goods-num area-item" v-if="userStore.userInfo.role_name === 'user'">
          <view class="title">选择数量</view>
          <Counter v-model="purchaseInformation.num" :maxValue="inventory" />
        </view>
      </view>
      <CommonButton @click="onConfirm">确定</CommonButton>
    </WBottomDrawer>
  </view>
</template>

<script lang="ts" setup>
import GoodsSelect from '@/components/goods-select/index.vue'
import Counter from '@/components/counter/index.vue'
import { IOptions } from '@/components/goods-select/type'
import { useGoodsStore } from '@/store'
import { multiply, toFloorFixed } from '@/utils/math'
const { purchaseInformation } = useGoodsStore()

interface IProps {
  modelValue?: number // 选中索引
  selectConfig?: {
    label?: string
    value?: string
  }
  show?: boolean
  imageSrc?: string
  inventory?: number
  selectOptions?: any[]
  price?: number | string
}
const props = withDefaults(defineProps<IProps>(), {
  selectOptions: () => [],
  modelValue: 0,
  show: false,
  selectConfig: () => ({
    label: 'label',
    value: 'value',
  }),
  imageSrc: '',
  inventory: 0, // 库存
})
const emit = defineEmits(['update:modelValue', 'update:show', 'confirm'])

// 获取规格选择信息
const goodsOptions = computed<IOptions>(() => {
  const { selectConfig, selectOptions } = props
  const labelTitle = selectConfig.label || 'label'
  const valueTitle = selectConfig.value || 'value'
  const options: IOptions = selectOptions.map((item) => ({
    label: item[labelTitle],
    value: item[valueTitle],
  }))
  return options
})
// 未选择规格暂时不需要
// function changeValue(value: string | number) {
//   emit('update:modelValue', value)
// }
// 改变显示
function changeShow(value: boolean) {
  emit('update:show', value)
}
// 选择商品购买信息
const checkGoodsInfo = reactive({
  count: 1,
  // 规格信息
  // unit: {},
})

// 真实际价格
const totalPrice = computed(() => {
  return toFloorFixed(multiply(Number(props.price), purchaseInformation.num))
})
// 改变商品规格, 暂时不需要使用
// function changeUnit({ index, value }: { index: number; value: IBaseOption }) {
//   // 改变激活索引
//   changeValue(index)
//   // 得到选中信息
//   const id = value.value
//   const options = props.selectOptions
//   const option = options.find((item) => item.id === id)
//   checkGoodsInfo.unit = option ? JSON.parse(JSON.stringify(option)) : undefined
// }

// 点击确定
function onConfirm() {
  changeShow(false)
  emit('confirm', checkGoodsInfo)
}
</script>

<style lang="scss" scoped>
.goods-info {
  display: flex;

  .cover {
    width: 220rpx;
    height: 220rpx;
    margin-right: 20rpx;
    overflow: hidden;
    border-radius: 16rpx;
  }

  .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;

    .goods-num {
      margin-top: 8rpx;
      font-size: 24rpx;
      color: #666;
    }
  }
}

.real-price {
  padding: 0 20rpx;
  margin-left: 8rpx;
  color: #fff;
  background-color: rgb(180 42 62);
  border-radius: 40rpx;

  .price-number {
    font-size: 32rpx;
    font-weight: bold;
  }
}

.area-item {
  margin-top: 34rpx;

  .title {
    font-size: 28rpx;
    font-weight: 600;
    line-height: 40rpx;
    color: #333;
  }
}

.select-goods-num {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}
</style>
