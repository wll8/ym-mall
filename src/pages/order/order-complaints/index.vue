<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '订单投诉',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="">
    <wd-form ref="formDataRef" :model="formData">
      <wd-cell-group border>
        <wd-textarea
          v-model="formData.content"
          label-width="60px"
          label="投诉内容"
          placeholder="请输入投诉内容"
          :rules="[
            {
              required: false,
              pattern: /^.+$/,
              message: '请输入投诉内容',
            },
          ]"
        />

        <wd-input
          label="联系电话"
          label-width="80px"
          prop="phone"
          clearable
          v-model="formData.phone"
          placeholder="请输入联系电话"
          :rules="[
            {
              required: false,
              pattern:
                /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: '请填写正确的联系电话',
            },
          ]"
        />
        <wd-input
          label="联系地址"
          label-width="80px"
          prop="address"
          clearable
          v-model="formData.address"
          placeholder="请输入联系地址"
          :rules="[
            {
              required: false,
              pattern: /^.+$/,
              message: '请输入联系地址',
            },
          ]"
        />

        <wd-cell title="上传图片" title-width="58px" />
        <UploadImages
          :multiple="false"
          :max-count="5"
          v-model:imgs-list="imageValues"
          :show-file-list="showFiles"
        />
      </wd-cell-group>
      <view class="footer">
        <view class="btnstyle" @click="handleSubmit">提交</view>
      </view>
    </wd-form>
  </view>
</template>

<script lang="js" setup>
import { getPickerList, getAddressdata, addAddress, updateAddress } from '@/service/address'
import { handleOrdercomplain } from '@/service/order/index'
const formData = ref({})
const showFiles = ref([])
const imageValues = ref([])
const formDataRef = ref()
const classes = ref('0')
const dataTree = ref([])

onLoad((options) => {
  console.log(options.id)
  formData.value.orderId = options.id
})
function handleSubmit() {
  formDataRef.value.validate().then(({ valid }) => {
    if (valid) {
      uni.showToast({
        title: '提交成功',
        duration: 2000,
      })
      formData.value.fileIds = imageValues.value ?? []
      console.log('formData', formData.value)
      handleOrdercomplain(formData.value).then((res) => {
        uni.navigateBack({
          delta: 1,
        })
      })
    }
  })
}

function handlePickerList() {
  getPickerList().then((res) => {
    dataTree.value = test(res.data)
  })
}
function onnodeclick(e) {}
function onchange(e) {
  const data = e.detail.value
  formData.value.provinceId = data[0].value
  formData.value.cityId = data[1].value
  formData.value.countyId = data[2].value
  formData.value.storeAddress = data[0].value + ',' + data[1].value + ',' + data[2].value
}
function test(tree) {
  const outArray = []
  for (const data of tree) {
    const out = { text: data.name, value: data.code }

    if (data.children && data.children.length) {
      out.children = test(data.children)
    }
    outArray.push(out)
  }
  return outArray
}
function select(e) {
  formData.value.businessLicense = e.tempFilePaths[0]
}

handlePickerList()
</script>

<style lang="scss" scoped>
.from {
  position: relative;
  height: 50px;
  margin: 0 auto;
}

.link {
  position: absolute;
  right: 10px;
  bottom: 25px;
  font-size: 14px;
  color: #999;
}

.link-left {
  position: absolute;
  bottom: 25px;
  left: 10px;
  font-size: 14px;
  color: #999;
}

.btnstyle {
  position: absolute;
  bottom: 16px;
  left: 50%;
  width: 319px;
  height: 48px;
  line-height: 48px;
  color: #fff;
  text-align: center;
  background: #b42a3e;
  border-radius: 24px;
  transform: translateX(-50%);
}
</style>
