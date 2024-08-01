<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '供应商商品',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="my-goods">
    <view class="header">
      <view class="header-top" :style="{ top: headTop }">
        <view class="search-area">
          <WSearch
            placeholder="请输入查询商品名称"
            v-model="queryInfo.goodsName"
            @search="onSearch"
          />
        </view>
      </view>
    </view>
    <view class="main">
      <GoodsList v-if="showList.length" :data="showList" />
      <none-data v-else />
    </view>
  </view>
</template>

<script lang="ts" setup>
import GoodsList from '@/components/goods-list/index.vue'
import { getSupplierGoodsList } from '@/service/goods'
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
  goodsName?: null | string
  userId?: null | string
}
const queryInfo = reactive<IQueryInfo>({
  current: 0,
  size: 10,
  goodsName: null,
  userId: null,
})

const showList = ref<any[]>([])
const totalPage = ref(0)
const InquireId = ref('')
onLoad((options) => {
  queryInfo.userId = options.userId
})
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
// 搜索
function onSearch() {
  initCurrentData()
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
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 108rpx;

  .header-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 22;
  }

  .search-area {
    display: flex;
    align-items: center;
    height: 108rpx;
    padding: 0rpx 30rpx;
    background-color: #fff;
  }
}

.main {
  padding: 0 24rpx;
}

.add-goods {
  position: fixed;
  right: 8rpx;
  bottom: 204rpx;
  cursor: pointer;
}
</style>
