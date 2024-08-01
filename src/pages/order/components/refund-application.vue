<template>
  <view class="refund-application">
    <w-bottom-drawer title="退款申请" v-model="show">
      <view class="refund-content">
        <uv-form ref="formRef" :rules="rules" labelPosition="left" labelWidth="100" :model="form">
          <uv-form-item label="退款运费" borderBottom>
            <uv-input :modelValue="returnPostage" readonly border="none"></uv-input>
          </uv-form-item>
          <uv-form-item label="退款金额" borderBottom>
            <uv-input :modelValue="refuseAmount" readonly border="none"></uv-input>
          </uv-form-item>
          <uv-form-item label="退款方式" borderBottom>
            <dict-select code="return_reason_type" v-model="form.type" />
          </uv-form-item>
          <uv-form-item label="退货理由" prop="reason" borderBottom>
            <uv-textarea
              v-model="form.reason"
              border="none"
              placeholder="请输入退货理由"
            ></uv-textarea>
          </uv-form-item>
          <uv-form-item label="图片说明" prop="returnImg" borderBottom>
            <view class="wrap-upload">
              <UploadImages v-model:imgs-list="form.returnImg" />
            </view>
          </uv-form-item>
        </uv-form>
        <view class="footer" flex mt3>
          <view flex-1>
            <CommonButton width="100%" @click="show = false" color="#666" bg-color="#f5f5f5">
              取消
            </CommonButton>
          </view>
          <view flex-1 style="margin-left: 16rpx">
            <CommonButton width="100%" @click="onConfirm">确定</CommonButton>
          </view>
        </view>
      </view>
    </w-bottom-drawer>
  </view>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { userOrderReturn } from '@/service/order/index'
import { showToast } from '@/utils/interaction'
import useRefuseInfo from '@/hooks/useRefuseInfo'
const emit = defineEmits<{
  (e: 'finished'): void
}>()
const orderInfo = ref<any>({})
const show = ref(false)
const formRef = ref<any>()
const form = reactive({
  reason: '',
  returnImg: [],
  type: '',
})

const rules = reactive<any>({
  reason: {
    type: 'string',
    required: true,
    message: '请输入退货理由',
    trigger: ['bluer', 'change'],
  },
  type: {
    type: 'string',
    required: true,
    message: '请选择退货方式',
    trigger: ['bluer', 'change'],
  },
  returnImg: {
    // 自定义验证函数
    validator(rule, value, callback) {
      if (value && value.length) {
        return true
      }
      return false
    },
    message: '请上传图片',
    trigger: ['change'],
  },
})
const { changeOrderInfo, refuseAmount, returnPostage } = useRefuseInfo(form)
// 处理退款申请
function onConfirm() {
  formRef.value.validate().then(() => {
    show.value = false
    userOrderReturn({
      orderId: orderInfo.value.id,
      reason: form.reason,
      returnImg: form.returnImg.join(','),
      status: 0,
      type: form.type,
    })
      .then((res) => {
        if (res.code === 200) {
          emit('finished')
        }
      })
      .catch((err) => {
        if (Array.isArray(err) && err.length) {
          showToast(err[0].message)
        }
      })
  })
}
function resetForm() {
  form.reason = ''
  form.returnImg = []
  form.type = ''
}
defineExpose({
  open(data: any) {
    orderInfo.value = data
    changeOrderInfo(data)
    // 重置数据
    resetForm()
    show.value = true
  },
})
</script>
<style lang="scss" scoped></style>
