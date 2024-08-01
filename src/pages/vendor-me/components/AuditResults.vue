/* stylelint-disable selector-class-pattern */
<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '',
  },
}
</route>

<template>
  <view>
    <view v-if="isSuccess" class="flex flex-col items-center justify-center h-96">
      <view>
        <wd-img
          :width="70"
          :height="70"
          :src="httpurl('/static/images/personalCenter/icon_cell/success.png')"
        />
        <view class="py-16px text-lime-600">审核成功</view>
      </view>

      <view class="footer">
        <view class="successStn" @click="backIndex">返回首页</view>
      </view>
    </view>
    <view v-else class="flex flex-col items-center justify-center h-96">
      <view>
        <wd-img
          :width="70"
          :height="70"
          :src="httpurl('/static/images/personalCenter/icon_cell/defeat.png')"
        />
        <view class="py-16px">审核失败</view>
      </view>
      <view class="reasonfailure">这里显示审核失败的原因</view>
      <view class="footer">
        <view class="btnstyle" @click="handleSubmit">重新提交审核</view>
      </view>
    </view>
  </view>
</template>

<script lang="js" setup>
import { getResultsAudit } from '@/service/user'
onLoad((options) => {
  getResultsAuditData()
})
const isSuccess = ref(true)
function handleSubmit() {}
function backIndex() {
  uni.navigateBack({
    delta: 1,
  })
}
function getResultsAuditData() {
  getResultsAudit().then((res) => {
    console.log(res)
  })
}
</script>

<style lang="scss" scoped>
/* stylelint-disable-next-line selector-class-pattern */
.successStn {
  width: 319px;
  height: 48px;
  margin-top: 80px;
  line-height: 48px;
  color: #b22338;
  background-color: #fff7f8;
  border: 1px solid #b22338;
  border-radius: 21px;
}

.reasonfailure {
  width: 343px;
  height: 67px;
  padding: 11px 16px;
  margin-bottom: 80px;
  background: #fff7f8;
  border-radius: 3px;
}

.btnstyle {
  width: 319px;
  height: 48px;
  line-height: 48px;
  color: #fff;
  background: #b42a3e;
  border-radius: 24px;
}
</style>
