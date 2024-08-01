<template>
  <view>
    <view class="product-box" :class="column == 2 ? 'bgfff padding' : 'bg-gray'">
      <view
        class="product-item"
        @tap="toDetail"
        :data-id="product.id"
        :class="col"
        v-for="(product, index) in productList"
        :key="index"
      >
        <view style="position: relative; z-index: 8">
          <image mode="widthFix" class="product-img" lazy-load="true" :src="product.cover"></image>
        </view>
        <view class="product-left">
          <view class="product-name g-line-2">
            <text
              :class="[`product-cate`, `product-num${index2 + 1}`]"
              v-for="(cate, index2) in product.cate_name"
              :key="cate"
            >
              {{ cate }}
            </text>
            {{ product.name }}
          </view>
          <view class="product-desc" v-if="product.marks.length">
            <block v-for="(mark, index1) in product.marks" :key="index1">
              <text class="product-marks" v-if="mark">{{ mark }}</text>
            </block>
          </view>
          <view class="product-sale">
            <view class="g-todo-hide">销量 {{ product.number }}</view>
            <view>
              <span class="price">
                <span>
                  <text class="font-size-12px">￥</text>
                  <text>{{ product.total }}</text>
                </span>
              </span>
            </view>
            <add-car :goodsId="product.id" />
          </view>
        </view>
      </view>
    </view>
    <uni-load-more :status="status"></uni-load-more>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
/**
 * GridItem 商品两列列表
 * zlxls
 */
export default {
  components: { uniLoadMore },
  name: 'ZlxlsGoodsList',
  props: {
    // 产品列表
    productList: {
      type: Array,
      value: [],
    },
    // 显示列数1列或者2列
    column: {
      type: Number,
      value: 2,
    },
    // 分页数据状态 more：还有更多数据、noMore：没有更多数据、loadding ：加载中
    status: {
      type: String,
      value: '',
    },
  },
  data() {
    return {
      col: 'col-' + this.column,
    }
  },
  created() {},
  beforeUnmount() {},
  methods: {
    toDetail(e) {
      uni.navigateTo({
        url: '/pages/goods/goods-detail/index?id=' + e.currentTarget.dataset.id,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$show-lines: 1;

@import '@climblee/uv-ui/libs/css/variable';

.product-cate {
  padding: 4rpx 8rpx;
  margin-right: 8rpx;
  font-size: 24rpx;
  color: #4fd216;
  border: 1rpx solid #4fd216;
}

.product-marks {
  margin-right: 8rpx;
}

.product-num1 {
  color: #f60;
  border: 1rpx solid #f60;
}

.product-num2 {
  color: #f00;
  border: 1rpx solid #f00;
}

.product-num3 {
  color: #f0ad4e;
  border: 1rpx solid #f0ad4e;
}

.product-num4 {
  color: #16baaa;
  border: 1rpx solid #16baaa;
}

.product-num5 {
  color: #dd524d;
  border: 1rpx solid #dd524d;
}

.bg-gray {
  background-color: #f2f2f2;
}

.padding {
  padding: 0 4%;
}

.product-box {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}

.product-item {
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.product-sale {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 24rpx;
  color: #999;
}

.product-left {
  box-sizing: border-box;
  width: 100%;
}

.product-name {
  overflow: hidden;
  font-size: $uni-font-size-base;
  color: #333;
}

.product-desc {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #999;
}

.col-1 {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 15rpx 4%;
  background-color: #fff;
}

.col-1 .product-item {
  display: flex;
}

.col-1 .product-img {
  width: 250rpx !important;
  height: 166rpx !important;
  margin-right: 20rpx;
}

.col-1 .product-name {
  height: ($uni-font-size-base + 15) * 2;
  line-height: $uni-font-size-base + 15;
}

.col-1 .product-sale {
  margin-top: 10rpx;
}

.col-2 {
  width: 48.5%;
  margin: 0 0 30rpx;
  background-color: #fff;
  border-radius: 5px;
}

.col-2:nth-child(odd) {
  margin-right: 3%;
}

.col-2 .product-img {
  width: 100% !important;
  height: 340rpx !important;
  border-radius: 3px;
}

.col-2 .product-name {
  height: ($uni-font-size-base + 15) * 2;
  line-height: $uni-font-size-base + 15;
}

.col-2 .product-sale {
  margin-top: 10rpx;
}

.col-2 .product-left {
  padding: 8rpx 0rpx;
}

.price {
  color: $uni-color-price;
}

.price span {
  font-size: $uni-font-size-base + 2rpx;
}

.del-price {
  margin-right: 20rpx;
  font-size: 20rpx;
  text-decoration: line-through;
}

.tips {
  position: absolute;
  z-index: 9;
}

.vip-image {
  width: 80rpx;
}
</style>
