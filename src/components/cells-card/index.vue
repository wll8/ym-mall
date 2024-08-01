<template>
  <view class="cells-card">
    <BasicCard :title="title">
      <view class="content">
        <template v-for="item in columns" :key="item.prop">
          <template v-if="!data?.[item.prop] && item.hide ? false : true">
            <view class="common-cell" :class="{ 'flex-column': item.isColumn }">
              <view class="cell-left">{{ item.label }}</view>
              <view class="cell-right">
                <template v-if="item.type === 'custom'">
                  <slot :name="item.slotName" :value="data?.[item.prop] || ''"></slot>
                </template>
                <template v-else-if="item.type === 'showprice'">
                  <view class="showprice">
                    {{ data?.[item.prop] || 0 }}
                  </view>
                </template>
                <template v-else>
                  <view class="cell-right-content">
                    {{ data?.[item.prop] }}
                  </view>
                </template>
              </view>
            </view>
          </template>
        </template>
      </view>
      <view class="footer">
        <slot></slot>
      </view>
    </BasicCard>
  </view>
</template>

<script lang="ts" setup>
import BasicCard from '../basic-card/index.vue'
import { ICellsCardColumns } from './type'

interface IProps {
  title?: string
  columns?: ICellsCardColumns
  data?: any
}
withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  columns: () => [],
  title: '',
})
</script>

<style lang="scss" scoped>
.common-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
  font-size: 28rpx;
  line-height: 1.2;
  color: #666;
}

.cell-right-content {
  color: #333;
}

.flex-column {
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .cell-right {
    width: 100%;
  }

  .cell-right-content {
    width: 100%;
    padding: 20rpx;
    margin-top: 20rpx;
    font-size: 30rpx;
    font-weight: bold;
    border: 1px solid #ccc;
    border-radius: 10rpx;
  }
}

.showprice {
  font-size: 28rpx;
  font-weight: bold;
}
</style>
