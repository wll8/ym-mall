<route lang="json5">
{
  layout: 'demo',
  style: {
    navigationBarTitleText: '请求',
  },
}
</route>

<template>
  <view class="mt-6">
    <!-- http://localhost:9100/#/pages/index/request -->
    <button @click="getFoo" class="my-4">测试 GET 请求</button>
    <view class="text-xl">请求数据如下</view>
    <view class="text-green h-10">{{ JSON.stringify(data) }}</view>
    <view class="text-xl">完整数据</view>
    <view class="text-green h-20">{{ JSON.stringify(originalData) }}</view>
    <button @click="postFoo" class="my-4">测试 POST 请求</button>
    <view class="text-xl">请求数据如下</view>
    <view class="text-green h-10">{{ JSON.stringify(data2) }}</view>

    <button class="my-8" type="warn" @click="reset">一键清空数据</button>
  </view>
</template>

<script lang="ts" setup>
import { getFooAPI, postFooAPI, IFooItem } from '@/service/foo'

onLoad(() => {
  getFoo()
  postFoo()
})
const originalData = ref<IResData<IFooItem>>()
const data = ref<IFooItem>()
const getFoo = async () => {
  const res = await getFooAPI('菲鸽')
  data.value = res.data
  originalData.value = res
}

const data2 = ref<IFooItem>()
const postFoo = async () => {
  const res = await postFooAPI('菲鸽2')
  data2.value = res.data
}

const reset = () => {
  data.value = undefined
  data2.value = undefined
  originalData.value = undefined
}
</script>
