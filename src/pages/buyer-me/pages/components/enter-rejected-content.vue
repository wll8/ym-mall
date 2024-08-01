<template>
  <common-modal v-model:show="show" title="拒绝" @confirm="onConfirm">
    <uv-form :rules="rules" labelPosition="left" labelWidth="100" :model="form" ref="formRef">
      <uv-form-item label="拒绝理由" prop="registerResult">
        <uv-textarea
          v-model="form.registerResult"
          border="none"
          placeholder="请输入拒绝理由"
          autoHeight
        ></uv-textarea>
      </uv-form-item>
    </uv-form>
  </common-modal>
</template>

<script lang="ts" setup>
import { IUpdateRegisterStateInfo } from '@/service/salesman'

// emit
const emit = defineEmits(['confirm'])
// 定义数据
const show = ref(false)
const formRef = ref<any>(null)
const form = reactive<IUpdateRegisterStateInfo>({
  registerResult: '',
  id: '',
  registerState: 30,
})
const rules = reactive<any>({
  registerResult: {
    type: 'string',
    required: true,
    message: '请输入拒绝理由',
    trigger: ['bluer', 'change'],
  },
})

// 事件处理
function onConfirm() {
  // 校验表单
  formRef.value.validate().then(() => {
    show.value = false
    emit('confirm', form)
  })
}

// 抛出事件
defineExpose({
  openModal(data: any) {
    show.value = true
    form.id = data.userId
  },
})
</script>

<style lang="scss" scoped></style>
