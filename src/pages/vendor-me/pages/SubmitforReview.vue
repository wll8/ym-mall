<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '商家审核',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="text-center">
    <view style="padding: 10px">
      <AuditResults></AuditResults>
    </view>
  </view>
</template>

<script lang="ts" setup>
import AuditResults from '../components/AuditResults.vue'
</script>

<style lang="scss" scoped></style>
