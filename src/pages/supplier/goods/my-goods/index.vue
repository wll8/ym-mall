<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '我的商品',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="my-goods page-background">
    <view class="header">
      <view class="header-tap" :style="{ top: headTop }">
        <TabsV2 :tabs="tabs" @tab-change="changeSearchType" />
      </view>
    </view>
    <view class="main">
      <GoodsList v-if="showList.length" :data="showList" @cardClick="toEditGoods">
        <template #default="scope">
          <view class="item-content" w-full>
            <view class="buttons" flex justify-end>
              <view class="btn-item" v-if="queryInfo.status === 1">
                <uv-button
                  type="primary"
                  :plain="true"
                  text="上架"
                  @click="onShelf(scope.row)"
                ></uv-button>
              </view>
              <view class="btn-item" v-else-if="queryInfo.status === 0">
                <uv-button
                  type="warning"
                  @click="onShelf(scope.row, false)"
                  :plain="true"
                  text="下架"
                ></uv-button>
              </view>
              <view class="btn-item" v-if="queryInfo.status === 0">
                <uv-button
                  type="success"
                  @click="ModifyInventory(scope.row)"
                  :plain="true"
                  text="修改库存"
                ></uv-button>
              </view>
              <view class="btn-item" v-if="queryInfo.status !== 0 && queryInfo.status !== 5">
                <uv-button
                  type="success"
                  :plain="true"
                  @click="toEditGoods(scope.row)"
                  text="编辑"
                ></uv-button>
              </view>
              <view class="btn-item" v-if="queryInfo.status !== 0 && queryInfo.status !== 5">
                <uv-button
                  type="error"
                  :plain="true"
                  text="删除"
                  @click="onDeleteGoods(scope.row)"
                ></uv-button>
              </view>
            </view>
            <view
              class="reject-content"
              w-full
              v-if="queryInfo.status == 4 && scope.row.auditMessage"
            >
              <view class="reject-content-title">审核信息：</view>
              {{ scope.row.auditMessage }}
            </view>
          </view>
        </template>
      </GoodsList>
      <none-data v-else />
    </view>
    <view
      @click="toAddGoods"
      class="add-goods svg-icon si-add-goods"
      :style="{ width: '152rpx', height: '152rpx' }"
    ></view>
  </view>
</template>

<script lang="ts" setup>
import GoodsList from '@/components/goods-list/index.vue'
import type { ITab } from '@/components/tabs/type'
import {
  deleteGoods,
  getSupplierGoodsList,
  goodsOnOrDownShelves,
  changeInventory,
} from '@/service/goods'
import { showToast } from '@/utils/interaction'
import { isH5 } from '@/utils/system-info'
// 得到固定位置
// 得到headerTop定位位置
const headTop = computed(() => {
  if (isH5()) {
    return '44px'
  }
  return 0
})

interface IQueryInfo {
  current: number
  size: number
  status?: number | string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  status: -1,
})

const tabs: ITab[] = [
  {
    text: '全部',
    value: -1,
  },
  {
    text: '待审核',
    value: 2,
  },
  {
    text: '已通过',
    value: 3,
  },
  {
    text: '未通过',
    value: 4,
  },
  {
    text: '上架',
    value: 0,
  },
  {
    text: '下架',
    value: 1,
  },
  {
    text: '库存不足',
    value: 5,
  },
]
function changeSearchType(info: any) {
  queryInfo.status = info.value
  initCurrentData()
}

const showList = ref<any[]>([])
const totalPage = ref(0)
onShow(() => {
  initCurrentData()
})

function getShowList() {
  queryInfo.current += 1
  getSupplierGoodsList(queryInfo)
    .then((res: any) => {
      if (queryInfo.current === 1) {
        // 得到总页数
        totalPage.value = Math.ceil(res.data.total / queryInfo.size)

        // 关闭下拉加载
        uni.stopPullDownRefresh()
      }
      showList.value.push(...res.data.records)
    })
    .catch(() => {
      if (queryInfo.current === 1) {
        // 关闭下拉加载
        uni.stopPullDownRefresh()
      }
    })
}
// 初始化获取分页信息
function initCurrentData() {
  queryInfo.current = 0
  totalPage.value = 0
  showList.value = []
  getShowList()
}

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  if (queryInfo.current > totalPage.value - 1) {
    showToast('没有下一页数据！')
    return
  }
  getShowList()
})
/**
 * 页面下拉刷新
 */
onPullDownRefresh(() => {
  uni.startPullDownRefresh({
    success() {
      initCurrentData()
    },
  })
})
/**
 * 编辑商品
 */
function toEditGoods(item: any) {
  uni.navigateTo({
    url: '/pages/supplier/goods/edit-goods/index?id=' + item.id,
  })
}
// 删除商品
function onDeleteGoods(item: any) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该商品吗？',
    success: (res) => {
      if (res.confirm) {
        deleteGoods(item.id).then((res) => {
          if (res.code === 200) {
            uni
              .showToast({
                title: res.msg,
                icon: 'none',
              })
              .then(() => {
                initCurrentData()
              })
          }
        })
      }
    },
  })
}
// 修改库存
function ModifyInventory(item: any) {
  uni.showModal({
    title: '修改库存数量',
    content: '',
    editable: true, // 是否显示输入框
    placeholderText: '请输入最新的库存数量', // 输入框提示内容
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        const data = {
          ids: item.id,
          stock: res.content,
        }
        console.log('输入的内容：', res.content)
        changeInventory(data).then((res) => {
          console.log(res)
        })
      }
    },
  })
}

// 商品上下架
function onShelf(item: any, isOnSelf = true) {
  uni.showModal({
    title: '提示',
    content: `确定要${isOnSelf ? '上架' : '下架'}该商品吗？`,
    success: (res) => {
      if (res.confirm) {
        goodsOnOrDownShelves(item.id).then((res) => {
          if (res.code === 200) {
            showToast(res.msg)
            initCurrentData()
          }
        })
      }
    },
  })
}
/**
 * 去商品添加
 */
function toAddGoods() {
  uni.navigateTo({
    url: '/pages/supplier/goods/add-goods/index',
  })
}
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 116rpx;

  .header-tap {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 22;
    width: 100%;
    height: 116rpx;
    background-color: #f9f9f9;
  }
}

.main {
  padding: 0 24rpx;

  :deep(.uv-button) {
    height: 34px !important;
    padding: 0 5px !important;
    font-size: 12px;
    line-height: 1.4;
  }
}

.reject-content {
  padding: 10rpx 0;
  color: #666;

  .reject-content-title {
    display: inline;
    color: #333;
  }
}

.btn-item {
  margin-left: 10rpx;
}

.add-goods {
  position: fixed;
  right: 8rpx;
  bottom: 204rpx;
  cursor: pointer;
}
</style>
