<template>
  <view class="list">
    <view>
      <view class="m4 mt0 flex justify-between">
        <view class="title font-size-6 font-600">{{ name }}</view>
        <view class="text-gray-500 mt2 g-todo-hide" @click="moreClick">更多></view>
      </view>
      <view class="m4 mb0">
        <view>
          <uv-scroll-list :indicator="false">
            <view
              v-for="(item, index) in list"
              :key="index"
              class="prod-item"
              @click="prodClick(item)"
            >
              <view class="cover-wrap">
                <image class="cover" mode="widthFix" :src="item.image" />
              </view>
              <view class="g-line-2 pl2 pr2 pt1">
                <view v-show="item.hot" class="hot"></view>
                <text class="font-size-4 text">{{ item.text }}</text>
              </view>
              <view class="text-info flex justify-between pl2 pr2 pb2">
                <text v-if="false" class="size font-size-3 pt1 c-coolGray">
                  {{ item.sales }} 购买过
                </text>
                <text>
                  <text class="price font-size-4 font-600" v-if="$handleHidePrice()">
                    <text class="font-size-3 mr--1">￥</text>
                    {{ item.price }}
                  </text>
                </text>
                <add-car :goodsId="item.id" />
              </view>
            </view>
          </uv-scroll-list>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
interface GoodsItem {
  id: string
  price: number // 价格
  sales: number // 销量
  image: string // 图片
  text: string // 文本
  hot: boolean // 热销
}

const props = withDefaults(
  defineProps<{
    name?: string
    link?: string
    list?: GoodsItem[]
  }>(),
  {
    name: `低价促销`,
    link: `/`,
    list: () => [
      {
        id: `1`,
        price: 7.9,
        sales: 1233,
        hot: true,
        image: 'https://via.placeholder.com/200x200.png/3c9cff/fff',
        text: `一些文本一些文本一些文本`,
      },
    ],
  },
)

const moreClick = () => {
  uni.navigateTo({
    url: `/pages/goods/list?name=${props.name}`,
  })
}
const prodClick = (item) => {
  uni.navigateTo({
    url: `/pages/goods/goods-detail/index?id=${item.id}`,
  })
}
</script>

<style lang="scss" scoped>
$show-lines: 1;

@import '@climblee/uv-ui/libs/css/variable';

.list {
  .hot {
    display: inline-block;
    width: 24px;
    height: 16px;
    margin-right: 2px;
    background-image: httpurl('/static/icon/hot@2x.png');
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: cover;
    background-size: contain;
  }

  .title {
    background-image: httpurl('/static/images/title_bg@2x.png');
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: cover;
    background-size: contain;
  }

  .prod-item {
    width: 156px;
    margin-right: 10px;
    margin-bottom: 10px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 12px#e9e6e6;

    .cover-wrap {
      display: flex;
      align-items: center;
      width: 156px;
      height: 156px;
      overflow: hidden;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;

      .cover {
        width: 100%;
      }
    }

    .g-line-2 {
      display: inline-block;
      min-height: 42px;
    }

    .text-info {
      .price {
        color: #b22338;
      }
    }
  }
}
</style>
