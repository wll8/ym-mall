<template>
  <div class="car-list" :data-data="carList.length">
    <div class="car-item mt4" v-for="item in carList" :key="item.id">
      <div class="check-box">
        <wd-checkbox
          custom-class="box p4"
          shape="square"
          v-model="item.select"
          @change="({ value }) => checkBoxChange(item, value)"
        ></wd-checkbox>
      </div>
      <div class="image" @click="() => checkBoxChange(item, !item.select)">
        <img class="img mr4" :src="item.goodsImg" alt="" />
      </div>
      <div class="info mr4">
        <div class="title mb2">{{ item.goodsName }}</div>
        <div class="des font-size-12px color-gray mb-8px g-line-1">{{ item.goodsSpecName }}</div>
        <div class="flex justify-between items-center">
          <div class="price">
            <text class="unit">¥</text>
            <text class="value">{{ item.salePrice }}</text>
          </div>
          <div class="acc">
            <wd-input-number
              v-model="item.goodsNum"
              @change="({ value }) => updateNumFn(item, value)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
const props = defineProps({
  carList: {
    type: Array,
    default: () => [],
  },
  checkBoxChange: {
    type: Function,
    default: (item, value) => {
      item.select = value
    },
  },
  updateNumFn: {
    type: Function,
    default: (item, value) => {
      item.goodsNum = value
    },
  },
})
</script>

<style lang="scss" scoped>
%price {
  font-weight: bold;
  color: #b22338;

  .unit {
    font-size: 10px;
  }
}

view {
  ::v-deep {
    /* stylelint-disable-next-line selector-class-pattern */
    .wd-input-number__input {
      width: 50px;
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
  }
}

.car-list {
  .car-item {
    display: flex;

    .check-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image {
      display: flex;
      align-items: center;
      justify-content: center;

      .img {
        width: 90px;
        height: 90px;
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
</style>
