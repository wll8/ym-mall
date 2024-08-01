<route lang="json5" type="page">
{
  layout: 'tabbar',
  style: { navigationBarTitleText: '分类', navigationStyle: 'custom' },
}
</route>

<template>
  <view class="page" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <wd-search
      custom-class="g-todo-hide"
      placeholder-left
      placeholder="请输入商品名称搜索"
      :hide-cancel="true"
    ></wd-search>
    <view class="scroll m2 mb0">
      <uv-scroll-list :indicator="false">
        <view
          v-for="item in rootList"
          :key="item.id"
          :class="[`cell-item`, { cur: item.id === rootListCur.id }]"
          @click="rootListCurClick(item)"
        >
          <view class="box w-50px p-6px">
            <img class="cover w-50px h-50px bg-slate-200 rounded-full" :src="item.logo" />
            <view class="text uv-line-1 font-size-12px">{{ item.title }}</view>
          </view>
        </view>
      </uv-scroll-list>
    </view>
    <view class="wraper">
      <wd-sidebar v-model="subListCurIndex" @change="subListCurClick">
        <wd-sidebar-item
          v-for="(item, index) in subList"
          :key="index"
          :value="index"
          :label="item.label"
          :icon="item.icon"
          :disabled="item.disabled"
          customClass="wd-sidebar-item"
        />
      </wd-sidebar>
      <view
        class="content"
        :style="`transform: translateY(-${subListCurIndex * 100}%)`"
        :data-data="subList.length"
      >
        <scroll-view
          v-for="(item, index) in subList"
          :key="index"
          class="category"
          scroll-y
          scroll-with-animation
          :show-scrollbar="false"
          :scroll-top="scrollTop"
          :throttle="false"
          @scrolltolower="scrolltolower"
        >
          <view class="car-list">
            <view
              class="car-item p2 pt0"
              v-for="item in cellList"
              :key="item.id"
              @click.stop="prodClick(item)"
            >
              <view class="image" @click="item.select = !item.select">
                <img class="img mr2" :src="item.img" alt="" />
              </view>
              <view class="info">
                <view class="title mb2">{{ item.name }}</view>
                <div class="des font-size-12px color-gray mb-8px g-line-1">{{ item.spec }}</div>
                <view class="flex justify-between items-center h2">
                  <view class="price">
                    <view v-if="$handleHidePrice()">
                      <text class="unit">¥</text>
                      <text class="value">{{ item.price }}</text>
                    </view>
                  </view>
                  <add-car :goodsId="item.id" />
                  <view :class="[`acc g-todo-hide`, { zero: !item.num }]">
                    <view
                      v-show="!item.num"
                      class="i-carbon-add-filled mr4 c-red-6"
                      @click="item.num = item.num + 1"
                    ></view>
                    <wd-input-number
                      v-show="item.num"
                      :min="0"
                      v-model="item.num"
                      @change="({ value }) => (item.num = value)"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-show="isEnd" class="color-gray text-center p2 text-4">没有了</view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script lang="js" setup>
import useNavbarWeixin from '@/hooks/useNavbarWeixin'
import { onMounted, ref } from 'vue'
import { getRect, isArray } from 'wot-design-uni/components/common/util'
import { getType, getCategory, getGoods } from '@/service/goods'
import { useTabbarStore } from '@/store/tabbar'
import { getLastItem } from '@/utils'

const { tabBarList, tabIndex, tabbarHeight } = storeToRefs(useTabbarStore())

const { pages, isTabbar, onScrollToLower, safeAreaInsets } = useNavbarWeixin()

const tabbarheightcss = computed(() => {
  return tabbarHeight.value + `px`
})

const prodClick = (item) => {
  uni.navigateTo({
    url: `/pages/goods/goods-detail/index?id=${item.id}`,
  })
}

// 父分类
const rootList = ref([])
const rootListCur = ref({})

function rootListCurClick(item, subId) {
  console.log(`item`, item)
  rootListCur.value = item
  subListCurIndex.value = 0
  item.id && getCategoryFn(item.id, subId)
}

// 子分类
const subListCurIndex = ref(0)
const subListCurItem = ref({})
const scrollTop = ref(0)
const subList = ref([])

watch(subListCurItem, () => {
  cellList.value = []
  subListCurIndex.value =
    subList.value.findIndex((item) => String(item.id) === String(subListCurItem.value.id)) || 0
  page.value = 1
  getGoodsByTypeFn()
})
function getCategoryFn(id, subId) {
  getCategory(id).then((res) => {
    subList.value = (res.data || []).map((item) => ({
      ...item,
      label: item.title,
      items: [],
    }))
    const item =
      (subId
        ? subList.value.find((item) => String(item.id) === String(subId))
        : subList.value[0]) || {}
    subListCurItem.value = item
    console.log(`res`, res)
  })
}
function subListCurClick({ value }) {
  scrollTop.value = -1
  nextTick(() => {
    scrollTop.value = 0
  })
  const item = subList.value[value] || {}
  subListCurItem.value = item
}

// 商品列表
const cellList = ref([])
function getGoodsByTypeFn() {
  const categoryId = subListCurItem.value.id
  if (page.value === 1) {
    cellList.value = []
    isEnd.value = false
  }
  categoryId &&
    getGoods({
      goodsCategoryId: categoryId,
      size: pageSize.value,
      current: page.value,
    }).then((res) => {
      const { records = [], total = 0 } = res.data
      cellList.value = [
        ...cellList.value,
        ...records.map((item) => ({
          ...item,
          img: item.goodsCover,
          name: item.goodsName,
          spec: item.goodsSpec,
          price: item.salePrice,
          num: item.goodsNum || 0,
        })),
      ]
      if (cellList.value.length < total) {
        page.value = page.value + 1
      } else {
        page.value = 1
        isEnd.value = true
      }
      console.log(`page.value`, page.value, cellList.value.length)
    })
}

// 分页
const isEnd = ref(false)
const pageSize = ref(10)
const page = ref(1)
function scrolltolower() {
  if (page.value !== 1) {
    getGoodsByTypeFn()
  }
}

onLoad((options) => {
  const { id: idStr = `` } = options
  const [rootId, subId] = idStr.split(`,`)
  getCategory(0).then((res) => {
    rootList.value = res.data || []
    const rootItem = rootId
      ? rootList.value.find((item) => String(item.id) === String(rootId))
      : rootList.value[0]
    rootListCurClick(rootItem || {}, subId)
  })
})
onMounted(() => {})
</script>
<script lang="js">
export default {
  options: { styleIsolation: 'shared' },
}
</script>

<style lang="scss" scoped>
$show-lines: 1;

@import '@climblee/uv-ui/libs/css/variable';

%price {
  font-weight: bold;
  color: #b22338;

  .unit {
    font-size: 10px;
  }
}
/* stylelint-disable-next-line selector-type-no-unknown */
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

view {
  ::v-deep {
    .wd-button.wd-button.is-medium.is-round {
      min-width: 60px;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    .wd-input-number__input {
      // width: 50px;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    .wd-drop-menu__item {
      height: 20px;
      line-height: 20px;
      text-align: left;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    .wd-drop-menu__item-title {
      padding-left: 0;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    .wd-drop-menu__item-title::after {
      display: none;
    }

    .wd-sidebar-item {
      display: initial !important;
    }

    .wd-badge {
      text-align: left;
      /* stylelint-disable-next-line scss/at-extend-no-missing-placeholder */
      @extend .uv-line-1;
    }
  }
}

.cell-item {
  .cover {
    box-sizing: border-box;
  }

  .text {
    padding: 2px 4px;
    border-radius: 18px;
  }

  &.cur {
    // background-color: #f00;

    .cover {
      border: 2px solid #b22338;
      border-radius: 60px;
    }

    .text {
      color: #fff;
      background-color: #b22338;
    }
  }

  .box {
    width: 68px;
  }

  text-align: center;
  background: #fff;
  border-radius: 5px;

  .text-info {
    .price {
      color: #b22338;
    }
  }
}

.category {
  box-sizing: border-box;
}

.car-list {
  .car-item {
    display: flex;

    .image {
      display: flex;
      align-items: center;
      justify-content: center;

      .img {
        width: 80px;
        height: 80px;
        border-radius: 4px;
      }
    }

    .info {
      width: 100%;

      .type {
        display: inline-block;
        min-width: 100px;
        padding: 4px;
        padding-right: 10px;
        padding-left: 10px;
        font-size: 14px;
        color: #999;
        background: #efefef;
        border-radius: 4px;
      }

      .price {
        @extend %price;
      }
    }
  }
}

.content {
  flex: 1;
  background: #fff;
  transition: transform 0.3s ease;
}

.wraper {
  display: flex;
  height: calc(100vh - var(--window-top));
  height: calc(100vh - var(--window-top) - constant(safe-area-inset-bottom));
  height: calc(
    100vh - var(--window-top) - env(safe-area-inset-bottom) - 120px - v-bind(tabbarheightcss)
  );
  overflow: hidden;
}
</style>
