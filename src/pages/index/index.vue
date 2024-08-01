<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
    'app-plus': {
      titleNView: {
        type: 'transparent',
      },
    },
  },
}
</route>

<template>
  <view class="page" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <!-- #ifdef MP-WEIXIN -->
    <uv-gap height="50"></uv-gap>
    <!-- #endif -->
    <wd-search
      @focus="() => focus()"
      placeholder-left
      placeholder="请输入商品名称搜索"
      :hide-cancel="true"
      custom-class=""
    ></wd-search>
    <view class="overflow-hidden pt-2 px-4">
      <view class="banner">
        <wd-swiper
          v-if="swiperList.length"
          :list="swiperList"
          autoplay
          :current="0"
          @click="swiperClick"
        ></wd-swiper>
      </view>
    </view>
    <view class="m4">
      <uv-notice-bar
        v-show="notice.length"
        :text="notice.map((item) => item.title)"
        direction="column"
        @click="noticeClick"
      ></uv-notice-bar>
    </view>
    <div
      class="rounded coupon p-10px pl-5px pr-5px m4"
      v-if="couponList.length && userStore.userInfo.role_name === 'user'"
    >
      <uv-scroll-list :indicator="false">
        <view v-for="(item, index) in couponList" :key="index">
          <div class="item p-10px text-center m-5px rounded-lg truncate">
            <div class="" v-if="item.couponType === `1` && $handleHidePrice()">
              <text class="text-rose-900">￥</text>
              <text class="text-2xl text-rose-900 font-bold mr4px">{{ item.val }}</text>
            </div>
            <div class="" v-else>
              <text class="text-2xl text-rose-900 font-bold mr4px">{{ item.val / 10 }}</text>
              <text class="text-rose-900">折</text>
            </div>
            <div class="text-rose-700 my10px g-line-1">{{ `满${item.minSpend}可用` }}</div>
            <div class="color-gray mb10px g-todo-hide g-line-1">{{ item.name }}</div>
            <div class="rounded-lg btn text-rose-900" @click="receiveCoupon(item.id)">立即领取</div>
          </div>
        </view>
      </uv-scroll-list>
    </div>
    <div class="rounded type-list p-10px pl-5px pr-5px m4" v-show="rootList.length">
      <uv-scroll-list :indicator="false">
        <view flex v-for="(arr, index) in rootList" :key="index">
          <div
            class="item p-6px text-center rounded-lg"
            v-for="item in arr"
            @click="toType([item.id])"
            :key="item.id"
          >
            <div class="">
              <img class="w-50px h-50px" :src="item.logo" />
              <div class="g-line-1 font-size-12px">{{ item.title }}</div>
            </div>
          </div>
        </view>
      </uv-scroll-list>
    </div>
    <ListCom
      :name="item.dictValue"
      :list="item.list || []"
      v-for="(item, index) in dirList"
      :key="index"
    />
  </view>
</template>

<script lang="js" setup>
import useNavbarWeixin from '@/hooks/useNavbarWeixin'
import toBindInvitaionCode from '@/utils/to-bind-invitaion-code'
import * as qs from 'qs'

import { getDir, getGoods, getCategory } from '@/service/goods'
import { get as getSwiperList } from '@/service/banner'
import { get as getNotice, getById } from '@/service/notice'
import { indexList as getCouponList, receive as getCoupon } from '@/service/coupon'
import ListCom from './components/ListCom.vue'

const { pages, isTabbar, onScrollToLower, safeAreaInsets } = useNavbarWeixin()

const toType = function (ids = []) {
  const str = ids.filter(Boolean).join(`,`)
  uni.redirectTo({
    url: `/pages/type/index?id=${str}`,
  })
}

const couponList = ref([])
function getCouponListFn() {
  getCouponList().then((res) => {
    couponList.value = res.data || []
  })
}
getCouponListFn()

const focus = (str) => {
  const qStr = str ? `?${str}` : ``
  uni.navigateTo({
    url: `/pages/search/index${qStr}`,
  })
}

async function receiveCoupon(id) {
  if (!toBindInvitaionCode()) return
  await getCoupon(id)
  await getCouponListFn()
  uni.showToast({
    title: '领取成功',
    icon: 'none',
  })
}

// 父分类
const rootList = ref([])

async function getWidth() {
  const data =
    (await new Promise((resolve, reject) =>
      uni
        .createSelectorQuery()
        .in(this)
        .select('.uni-scroll-view-content')
        .boundingClientRect(resolve)
        .exec(() => {}),
    )) || {}
  return data.width || 1
}

getCategory(0).then(async (res) => {
  const size = Math.floor((await getWidth()) / 62)
  const data = res.data || []
  rootList.value = (
    data.length <= size * 2
      ? [data.slice(0, size), data.slice(size)]
      : [data.slice(0, data.length / 2), data.slice(data.length / 2)]
  ).sort((a, b) => b.length - a.length)
})

const dirList = ref([])
function fetchDirList() {
  getDir().then(({ data = [] }) => {
    dirList.value = data
    dirList.value.forEach((item, index) => {
      getGoods({ activity: item.dictKey }).then((res) => {
        dirList.value[index].list = res.data.records.map((item) => ({
          id: item.id,
          price: item.salePrice,
          sales: item.totalSales,
          image: item.goodsCover,
          text: item.goodsName,
          hot: Boolean(item.isHot),
        }))
      })
    })
  })
}
fetchDirList()

const swiperList = ref([])
const swiperListFull = ref([])
getSwiperList().then((res) => {
  swiperListFull.value = res.data
  swiperList.value = res.data.map((item) => item.imageUrl)
})
const swiperClick = ({ index }) => {
  const item = swiperListFull.value[index]
  if (item.advertisementType === `1`) {
    toType([item.businessId])
  }
  if (item.advertisementType === `2`) {
    focus(
      qs.stringify({
        merchantId: item.businessId,
        pageType: `auto`,
      }),
    )
  }
  if (item.advertisementType === `0`) {
    uni.navigateTo({
      url: `/pages/goods/goods-detail/index?id=${item.businessId}`,
    })
  }
}

const notice = ref([])
getNotice().then((res) => {
  const records = res.data.records || []
  notice.value = records
})
const noticeClick = (index) => {
  const id = notice.value[index].id
  console.log(`noticeClick`, id)
  viewHtml(() => getById(id).then((res) => res.data))
}
// 从绑定邀请码回来后刷新数据
uni.$on('refreshData', () => {
  getCouponListFn()
  fetchDirList()
})

onLoad(() => {
  console.log(`onLoad`)
})
</script>
<script lang="js">
export default {
  options: { styleIsolation: 'shared' },
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #f9f9f9;
  background-image: httpurl('/static/images/index_bg@2x.png');
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  background-size: contain;
}

.coupon {
  background: linear-gradient(135deg, #ffe5df 0%, #ef9da9 100%);
  border-radius: 12px;

  .item {
    background: #fbf4f5;

    .btn {
      padding: 4px 0;
      font-size: 14px;
      background: rgb(180 42 62 / 10%);
      border: 1px solid #b42a3e;
      border-radius: 16px;
    }
  }
}

.type-list {
  background: linear-gradient(135deg, #d1d1df 0%, #e0aadea8 100%);

  .item {
    width: 50px;
  }
}

::v-deep {
  .type-list {
    .uv-scroll-list__scroll-view__content {
      flex-direction: column;
    }
  }

  .rounded {
    .uv-scroll-list {
      padding-bottom: 0;
    }
  }

  .wd-search.wd-search {
    background-color: transparent;

    .wd-icon-user-circle {
      width: 100%;
      height: 50px;
      margin-right: 10px;
      line-height: 50px;
      text-align: center;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    .wd-search__search-left-icon {
      // color: #f00;
      z-index: 1;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    .wd-search__input {
      background-color: #fff;
      border-radius: 20px;
    }
  }
}
</style>
