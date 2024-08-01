<template>
  <view class="button-radio-group">
    <view
      class="button-radio-item"
      :class="{ active: currentIndex === index }"
      v-for="(item, index) in list"
      :key="index"
      @click="changeCurrentIndex(index)"
    >
      {{ item.label }}
    </view>
  </view>
</template>
<script lang="ts" setup>
interface ListItem {
  label: string
  value: string | number
}

const emit = defineEmits(['update:modelValue', 'change'])
const props = withDefaults(
  defineProps<{
    list: ListItem[]
    modelValue: string | number
  }>(),
  {
    list: () => [],
  },
)
const currentIndex = ref<number>(-1)
// 监听modelValue变化修改索引
watchEffect(() => {
  if (props.modelValue) {
    props.list.forEach((item, index) => {
      if (item.value === props.modelValue) {
        currentIndex.value = index
      }
    })
  } else {
    currentIndex.value = -1
  }
})

function changeCurrentIndex(index: number) {
  currentIndex.value = index
  emit('update:modelValue', props.list[index].value)
  emit('change', props.list[index])
}
</script>
<style lang="scss" scoped>
.button-radio-group {
  display: flex;
  flex-flow: row wrap;
  margin: 10px -10rpx;
}

.button-radio-item {
  padding: 8rpx 30rpx;
  margin: 0 10rpx;
  color: #666;
  border: 1px solid #e5e5e5;
  border-radius: 30rpx;
}

.button-radio-item.active {
  color: #7bca54;
  background-color: #f0f9eb;
}
</style>
