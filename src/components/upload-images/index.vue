<template>
  <view class="upload-images">
    <uv-upload
      :fileList="fileList"
      :maxCount="maxCount"
      :multiple="multiple"
      @afterRead="afterRead"
      @delete="deletePic"
      :previewFullImage="previewFullImage"
      :disabled="disabled"
    ></uv-upload>
  </view>
</template>

<script lang="ts" setup>
import { fileUpload } from '@/service/file'
import { watchEffect } from 'vue'

import type { FileListOption } from '@ttou/uv-typings/types/upload'
type ModelValueType = string | string[] | number[]

interface IProps {
  maxCount?: number
  previewFullImage?: boolean
  multiple?: boolean
  modelValue?: ModelValueType
  showFileList?: FileListOption[]
  valueIsArray?: boolean // 绑定的是否是文件数组
  imgsList?: any[]
  disabled?: boolean
}
const emit = defineEmits(['update:modelValue', 'update:imgsList'])
const props = withDefaults(defineProps<IProps>(), {
  maxCount: 99,
  previewFullImage: true,
  multiple: true,
  showFileList: () => [],
  valueIsArray: false,
  modelValue: '',
  imgsList: () => [],
  disabled: false,
})

const fileList = ref<FileListOption[]>([])
// 存储文件ids
const fileIds = ref<string[]>([])
// 图片列表回显
watchEffect(() => {
  if (props.showFileList && props.showFileList.length) {
    fileList.value = props.showFileList
    if (!props.valueIsArray && props.modelValue) {
      fileIds.value = (props.modelValue as string).split(',')
    } else {
      fileIds.value = props.modelValue as string[]
    }
  }
})

// 删除图片
function deletePic(event: any) {
  if (props.disabled) {
    return
  }
  if (fileList.value && fileList.value.length) {
    fileList.value.splice(event.index, 1)
  }

  if (fileIds.value && fileIds.value.length) {
    fileIds.value.splice(event.index, 1)
  }

  // 删除后更新值
  changeModelValue()
  return []
}

// 处理文件上传
async function afterRead(event: any) {
  let fileListLen = fileList.value.length
  // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
  const lists: any[] = [].concat(event.file)
  lists.forEach((item: any) => {
    fileList.value.push({
      ...item,
      status: 'uploading',
      message: '上传中',
    })
  })

  for (let i = 0; i < lists.length; i++) {
    const item = fileList.value[fileListLen]
    try {
      // 上传文件
      const result = await fileUpload(lists[i].url)
      if (String(result.code) === String(200)) {
        item.status = 'success'
        item.message = ''
        item.url = result.data.link
        fileIds.value.push(result.data.attachId)
      } else {
        item.status = 'failed'
      }
    } catch {
      item.status = 'failed'
    }
    fileListLen++
  }
  // 更新值
  changeModelValue()
}

/**
 * 处理文件id更新改变modelValue
 */
function changeModelValue() {
  const value = getModelValue()
  emit('update:modelValue', value)
  emit('update:imgsList', getImgsList())
}
function getImgsList() {
  return fileList.value.map((item) => item.url)
}
function getModelValue() {
  if (!props.valueIsArray && fileIds.value.length) {
    return fileIds.value.join(',')
  }
  return fileIds.value
}
</script>

<style lang="scss" scoped>
//
</style>
