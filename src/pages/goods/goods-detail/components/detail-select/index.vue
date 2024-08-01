<template>
  <view class="detail-select">
    <view class="select-item" @click="openSelectGoodsInfoShow">
      <view class="item-left">选择</view>
      <view class="item-center">已选：{{ specification }}</view>
      <view class="item-right">
        <view class="svg-icon si-more" :style="{ width: '40rpx', height: '40rpx' }" />
      </view>
    </view>
    <view
      class="select-item"
      @click="toChooseAddress()"
      v-if="userStore.userInfo.role_name === 'user'"
    >
      <view class="item-left">送至</view>
      <view class="item-center">
        <view class="address-info">
          <WSvgIcon name="position" height="38rpx" width="38rpx" />
          <view class="address-text single-line-ellipsis">
            {{ detailAddress || '未选择送货地址，请选择地址' }}
          </view>
        </view>
        <!-- <view class="fetch-time" v-if="isAddress()">现货，今日下单，预计3天内(5月23日)</view> -->
      </view>
      <view class="item-right">
        <view class="svg-icon si-more" :style="{ width: '40rpx', height: '40rpx' }" />
      </view>
    </view>
    <view class="select-item" @click="openGoodsParamsShow" v-if="data?.goodsParamsList?.length">
      <view class="item-left">参数</view>
      <view class="item-center single-line-ellipsis">{{ goodsParamsSimple }}</view>
      <view class="item-right">
        <view class="svg-icon si-more" :style="{ width: '40rpx', height: '40rpx' }" />
      </view>
    </view>
    <!-- 选择商品信息 -->
    <SelectGoodsInfo
      v-model:show="selectGoodsInfoShow"
      :select-options="[{ name: data?.goodsSpec, id: 1 }]"
      :select-config="{ label: 'name', value: 'id' }"
      :image-src="data?.goodsCover"
      :inventory="data?.totalStock"
      :price="data.salePrice"
    />
    <!-- 商品参数 -->
    <GoodsParams
      v-model="goodsParamsShow"
      :options="data.goodsParamsList"
      :config="{ label: 'paramName', value: 'paramValue' }"
    />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import GoodsParams from '../goods-params/index.vue'
import SelectGoodsInfo from '../select-goods-info/index.vue'
import useAddress from '@/hooks/useAddress'
interface IProps {
  data?: any
}
const props = defineProps<IProps>()
const { toChooseAddress, detailAddress } = useAddress()

/**
 * 通过计算属性得到页面上需要渲染的值
 */
// 展示已经选择规格
const specification = computed(() => {
  const { data } = props
  if (data && data.goodsSpec) {
    return data.goodsSpec
  }
  return ''
})
// 简单商品参数
const goodsParamsSimple = computed(() => {
  const { data } = props
  if (data && data.goodsParamsList && data.goodsParamsList.length) {
    return data.goodsParamsList.map((item) => item.paramName).join(' ')
  }
  return ''
})

/*
  展现详细信息
*/
const goodsParamsShow = ref(false)
const selectGoodsInfoShow = ref(false)
// 打开商品规格选择
function openSelectGoodsInfoShow() {
  selectGoodsInfoShow.value = true
}
// 打开商品参数查看
function openGoodsParamsShow() {
  goodsParamsShow.value = true
}
</script>

<style lang="scss" scoped>
.detail-select {
  padding: 24rpx 32rpx;
  margin-top: 24rpx;
  background-color: #fff;
}

.select-item {
  display: flex;
  margin-top: 30rpx;
  font-size: 28rpx;

  &:last-child {
    margin-top: 0;
  }

  .item-center {
    flex: 1;
    width: 0;
    line-height: 40rpx;
    color: #666;
  }

  .item-left {
    width: 86rpx;
    font-weight: bolder;
    color: #333;
  }

  .item-right {
    display: flex;
    justify-content: flex-end;
    width: 110rpx;
  }
}

.address-info {
  display: flex;
  width: 100%;

  .address-text {
    flex: 1;
    margin-left: 4rpx;
    overflow: hidden;
  }
}

.fetch-time {
  margin-top: 4rpx;
  font-style: 24rpx;
  color: #999;
}
</style>
