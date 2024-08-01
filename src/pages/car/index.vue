<route lang="json5" type="page">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '购物车',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view :class="[query, 'page']" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="navbar w-full bg-white z-9" flex justify-between>
      <view
        class="navbar-left w100rpx"
        @click="backPage"
        :style="{ opacity: query.hideBar ? 1 : 0 }"
      >
        <view class="svg-icon si-arrow-left mt2 ml4"></view>
      </view>
      <view
        class="edit-text mr4 mt2"
        :class="isEdit ? 'quit-edit-text' : ''"
        @click="handleIsEdit"
        flex
        justify-end
        v-if="carList.length !== 0"
      >
        {{ isEdit ? '退出编辑' : '编辑' }}
      </view>
    </view>
    <carListCom :carList="carList" :checkBoxChange="checkBoxChange" :updateNumFn="updateNumFn" />
    <uv-gap height="80"></uv-gap>
    <template v-if="!isEdit">
      <div
        v-if="carList.length"
        class="tool-bar flex justify-between"
        :style="{ bottom: tabbarStore.tabbarHeight + 'px' }"
      >
        <div class="flex flex-1 items-end mb2">
          <div class="check-box">
            <wd-checkbox
              custom-class="box p4 pb0"
              shape="square"
              v-model="selectAll"
              @change="selectAllFn"
            >
              全选
            </wd-checkbox>
          </div>
          <div>
            已选
            <text>{{ selectEd }}</text>
            件，合计
          </div>
          <text class="price p1 pb0">
            <text class="unit">¥</text>
            <text class="value">{{ selectAcc }}</text>
          </text>
        </div>
        <wd-button custom-class="mr4 mt2" @click="pay" :disabled="!selectEd">去结账</wd-button>
      </div>
    </template>
    <template v-else>
      <div
        v-if="carList.length"
        class="tool-bar flex justify-between"
        :style="{ bottom: tabbarStore.tabbarHeight + 'px' }"
      >
        <div class="flex flex-1 items-end mb2">
          <div class="check-box">
            <wd-checkbox
              custom-class="box p4 pb0"
              shape="square"
              v-model="selectAll"
              @change="selectAllFn"
            >
              全选
            </wd-checkbox>
          </div>
        </div>
        <wd-button custom-class="mr4 mt2" @click="deleteCars" :disabled="!selectEd" type="error">
          删除
        </wd-button>
      </div>
    </template>
  </view>
</template>

<script lang="js" setup>
import carListCom from './carListCom.vue'
import { watch } from 'vue'
import { useToast } from 'wot-design-uni'

import { getCar, delCar, updateNum } from '@/service/goods'

import { useUserStore, useTabbarStore, useOrderStore } from '@/store'
import { useCarStore } from '@/store/car'

const carStore = useCarStore()
const { carList } = storeToRefs(carStore)
function checkBoxChange(item, value) {
  item.select = value
}

const query = ref({
  userId: undefined,
  hideBar: false,
})
const fabActive = ref(false)
const isEdit = ref(false)
watch(fabActive, (val) => {
  uni.showModal({
    title: '提示',
    content: '是否删除所选内容？',
    success: async function (res) {
      if (res.confirm) {
        const ids = carList.value
          .filter((item) => item.select)
          .map((item) => item.id || item.shoppingCartId)
        console.log('用户点击确定', ids)
        await delCar(ids)
        carStore.refreshList(query.value)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const tabbarStore = useTabbarStore()
function updateNumFn(item, value) {
  item.goodsNum = value
  carStore.changeNum(item.shoppingCartId, value)
}

onLoad((arg) => {
  query.value = arg
  query.value.hideBar && tabbarStore.hideByPage()
  carStore.refreshList(query.value)
})

const pay = () => {
  const carListEd = carList.value.filter((item) => item.select)
  useOrderStore().loadCarListData(carListEd)
  uni.navigateTo({
    url: `/pages/order/firm-order/index`,
  })
}

// 编辑
const handleIsEdit = () => {
  isEdit.value = !isEdit.value
}

// 已选数量
const selectEd = computed(() => {
  return carList.value.filter((item) => item.select).length
})
// 合计
const selectAcc = computed(() => {
  const num = carList.value.reduce((acc, item) => {
    if (item.select) {
      acc += item.goodsNum * item.salePrice
    }
    return acc
  }, 0)
  return parseFloat(num.toFixed(2))
})

const selectAll = ref(false)
const selectAllFn = ({ value }) => {
  if (value) {
    carList.value.forEach((item) => {
      item.select = true
    })
  } else {
    carList.value.forEach((item) => {
      item.select = false
    })
  }
}
watch(selectEd, (newVal, oldVal) => {
  if (newVal === carList.value.length) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
})

// 返回上一页
function backPage() {
  uni.navigateBack({
    delta: 1,
  })
}
// 删除购物车
// 编辑
const deleteCars = () => {
  uni.showModal({
    title: '提示',
    content: '是否删除所选内容？',
    success: async function (res) {
      if (res.confirm) {
        const ids = carList.value
          .filter((item) => item.select)
          .map((item) => item.id || item.shoppingCartId)
        console.log('用户点击确定', ids)
        await delCar(ids)
        carStore.refreshList(query.value)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
}
</script>

<script lang="js">
export default {
  options: { styleIsolation: 'shared' },
}
</script>

<style lang="scss" scoped>
%price {
  font-weight: bold;
  color: #b22338;

  .unit {
    font-size: 10px;
  }
}

.edit-text {
  color: #999;
}

.quit-edit-text {
  color: #f85825;
}

.page {
  .tool-bar {
    position: fixed;
    z-index: 1;
    width: 100%;
    padding-bottom: 10px;
    font-size: 14px;
    background-color: #fff;

    .price {
      @extend %price;

      .value {
        font-size: 20px;
      }
    }
  }
}

view {
  ::v-deep {
    .wd-button.is-medium.is-round {
      min-width: 60px;
    }

    .wd-button {
      width: 32px;
      min-width: auto;
      height: 32px;
      margin-right: 20px;
      border-radius: 16px;
    }
  }
}
</style>
