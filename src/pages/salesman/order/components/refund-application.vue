<template>
  <view class="refund-application">
    <w-bottom-drawer title="退款处理" v-model="show">
      <view class="refund-content">
        <uv-form ref="formRef" :rules="rules" labelPosition="left" labelWidth="100" :model="form">
          <uv-form-item label="退款运费" borderBottom>
            <uv-input :modelValue="returnPostage" readonly border="none"></uv-input>
          </uv-form-item>
          <uv-form-item label="退款金额" borderBottom>
            <uv-input :modelValue="refuseAmount" readonly border="none"></uv-input>
          </uv-form-item>
          <uv-form-item label="退款方式" borderBottom>
            <dict-select code="return_reason_type" readonly v-model="form.type" />
          </uv-form-item>
          <uv-form-item label="退货理由" prop="reason" borderBottom>
            <uv-textarea
              v-model="form.reason"
              border="none"
              placeholder="请输入退货理由"
              disabled
            ></uv-textarea>
          </uv-form-item>
          <uv-form-item label="申请图片说明" prop="returnImg" borderBottom>
            <view class="wrap-upload">
              <UploadImages
                v-model:imgs-list="form.returnImg"
                :show-file-list="handlePhotoBack(form.returnImg)"
                disabled
              />
            </view>
          </uv-form-item>
          <uv-form-item label="处理说明" prop="busiDesc" borderBottom>
            <uv-textarea
              v-model="form.busiDesc"
              border="none"
              placeholder="请输入处理说明"
            ></uv-textarea>
          </uv-form-item>
          <uv-form-item label="处理图片说明" prop="busiImg" borderBottom>
            <view class="wrap-upload">
              <UploadImages v-model:imgs-list="form.busiImg" />
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
import { orderReturnApproval } from '@/service/order/index'
import useRefuseInfo from '@/hooks/useRefuseInfo'
import { handlePhotoBack } from '@/utils/map-imgs'
import { showToast } from '@/utils/interaction'
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
  busiDesc: '',
  busiImg: [],
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
  busiDesc: {
    type: 'string',
    required: true,
    message: '请输入处理说明',
    trigger: ['bluer', 'change'],
  },
  busiImg: {
    // 自定义验证函数
    validator(rule, value, callback) {
      if (value && value.length) {
        return true
      }
      return false
    },
    message: '请上传业务员处理图片',
    trigger: ['change'],
  },
})
const { changeOrderInfo, refuseAmount, returnPostage } = useRefuseInfo(form)
// 退货信息
const returnInfo = ref<any>({})

// 处理退款申请
function onConfirm() {
  formRef.value.validate().then(() => {
    show.value = false
    orderReturnApproval({
      ...returnInfo.value,
      ...form,
      busiStatus: 1,
      busiImg: form.busiImg.join(','),
      returnImg: form.returnImg.join(','),
    })
      .then((res) => {
        emit('finished')
      })
      .catch((err) => {
        if (Array.isArray(err) && err.length) {
          showToast(err[0].message)
        }
      })
  })
}

function resetForm(info = {}) {
  for (const key in form) {
    if (key === 'returnImg' || key === 'busiImg') {
      if (info[key]) {
        form[key] = info[key].split(',')
      } else {
        form[key] = []
      }
    } else {
      form[key] = info[key] ?? ''
    }
  }
}
defineExpose({
  open(data: any, info) {
    orderInfo.value = data
    changeOrderInfo(data)
    resetForm(info)
    returnInfo.value = info
    show.value = true
  },
})
</script>
<style lang="scss" scoped></style>
