<route lang="json5" type="page">
{
  layout: 'tabbar',
  style: { navigationBarTitleText: '分类', navigationStyle: 'custom' },
}
</route>

<template>
  <view class="page" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <!-- #ifdef MP-WEIXIN -->
    <uv-gap height="50"></uv-gap>
    <!-- #endif -->
    <wd-search
      custom-class="g-todo-hide"
      placeholder-left
      placeholder="请输入商品名称搜索"
      :hide-cancel="true"
    ></wd-search>
    <view class="wraper">
      <wd-sidebar v-model="active" @change="handleChange">
        <wd-sidebar-item
          v-for="(item, index) in categories"
          :key="index"
          :value="index"
          :label="item.name"
        />
      </wd-sidebar>
      <scroll-view
        class="content"
        scroll-y
        scroll-with-animation
        :scroll-top="scrollTop"
        :throttle="false"
        @scroll="onScroll"
      >
        <view v-for="(item, index) in categories" :key="index" class="category">
          <view class="p-2 banner" v-if="item.imagePath">
            <image class="img" :src="item.imagePath" />
          </view>
          <view class="m-2 text-size-lg">{{ item.name }}</view>
          <view class="cell-list">
            <view
              use-slot
              @click="onClickCell({ cell, index })"
              v-for="(cell, index) in item.children"
              :key="index"
              class="cell"
            >
              <image class="img" :src="cell.imagePath" />
              <view class="text g-line-1">{{ cell.name }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="js" setup>
import useNavbarWeixin from '@/hooks/useNavbarWeixin'
import { onMounted, ref } from 'vue'
import { getRect, isArray } from 'wot-design-uni/components/common/util'
import { getType } from '@/service/goods'
import { useTabbarStore } from '@/store/tabbar'
import { getLastItem } from '@/utils'

const { tabBarList, tabIndex, tabbarHeight } = storeToRefs(useTabbarStore())

const { pages, isTabbar, onScrollToLower, safeAreaInsets } = useNavbarWeixin()
const active = ref(0)
const scrollTop = ref(0)
const itemScrollTop = ref([])
const offsetTop = ref(50)

const onClickCell = ({ cell }) => {
  uni.navigateTo({
    url: `/pages/goods/goods-detail/index?id=${cell.id}`,
  })
}

const tabbarheightcss = computed(() => {
  return tabbarHeight.value + `px`
})

const categories = ref([])
getType({}).then(async (res) => {
  categories.value = res.data.list
  await nextTick()
  getRect('.category', true).then((rects) => {
    if (isArray(rects)) {
      itemScrollTop.value = rects.map((item) => item.top || 0)
      scrollTop.value = rects[active.value].top || 0
      scrollTop.value -= offsetTop.value
    }
  })
})

onMounted(() => {})

function handleChange({ value }) {
  active.value = value
  scrollTop.value = itemScrollTop.value[value]
  scrollTop.value -= offsetTop.value
}
function onScroll(e) {
  const { scrollTop } = e.detail
  const threshold = offsetTop.value // 下一个标题与顶部的距离
  if (scrollTop < threshold) {
    active.value = 0
    return
  }
  const index = itemScrollTop.value.findIndex(
    (top) => top > scrollTop && top - scrollTop <= threshold,
  )
  if (index > -1) {
    active.value = index
  }
}
</script>

<style lang="scss" scoped>
$show-lines: 1;

@import '@climblee/uv-ui/libs/css/variable';

.category {
  .banner {
    .img {
      width: 100%;
      height: 70px;
      border-radius: 10px;
    }
  }
}

.cell-list {
  display: flex;
  flex-wrap: wrap;

  .cell {
    width: 33%;
    margin-bottom: 20px;
    text-align: center;

    .img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .text {
      margin-top: 10px;
      font-size: 12px;
      text-align: center;
    }
  }
}

.wraper {
  display: flex;
  height: calc(100vh - var(--window-top) - v-bind(tabbarheightcss));
  height: calc(
    100vh - var(--window-top) - constant(safe-area-inset-bottom) - v-bind(tabbarheightcss)
  );
  height: calc(100vh - var(--window-top) - env(safe-area-inset-bottom) - v-bind(tabbarheightcss));
  height: calc(100vh - var(--window-top) - env(safe-area-inset-bottom) - v-bind(tabbarheightcss));
}

.content {
  flex: 1;
  background: #fff;
}
</style>
