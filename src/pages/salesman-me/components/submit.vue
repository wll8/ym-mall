<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '',
  },
}
</route>

<template>
  <view class="">
    <wd-form ref="formDataRef" :model="formData">
      <wd-cell-group border>
        <wd-input
          label="商家名称"
          label-width="80px"
          prop="name"
          clearable
          v-model="formData.name"
          placeholder="请输入姓名"
          :rules="[
            {
              required: false,
              pattern: /^.+$/,
              message: '请输入姓名',
            },
          ]"
        />
        <wd-input
          label="法人名称"
          label-width="80px"
          prop="userName"
          clearable
          v-model="formData.userName"
          placeholder="请输入法人名称"
          :rules="[
            {
              required: false,
              pattern: /^.+$/,
              message: '请输入法人名称',
            },
          ]"
        />
        <wd-input
          label="手机号码"
          label-width="80px"
          prop="tel"
          clearable
          v-model="formData.tel"
          placeholder="请输入手机号码"
          :rules="[
            {
              required: false,
              pattern:
                /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: '请填写正确的手机号码',
            },
          ]"
        />
        <wd-cell left title="所在地区" title-width="60px">
          <view class="custom-value">
            <uni-data-picker
              placeholder="请选择收货地址所在地区"
              :localdata="dataTree"
              v-model="classes"
              @change="onchange"
              @nodeclick="onnodeclick"
            ></uni-data-picker>
          </view>
        </wd-cell>
        <wd-textarea
          v-model="formData.detailAddress"
          auto-height
          label-width="60px"
          label="详细地址"
          placeholder="详细到街道、门牌号"
        />
        <wd-cell title="相关凭证" title-width="58px" />
        <UploadImages
          :max-count="5"
          v-model:imgs-list="imageValues"
          :show-file-list="handlePhotoBack(imageValues)"
        />
      </wd-cell-group>
      <view class="footer">
        <view class="btnstyle" @click="handleSubmit">提交邀请</view>
      </view>
    </wd-form>
  </view>
</template>

<script lang="js" setup>
import { getPickerList } from '@/service/address'
import { submit } from '@/service/user'
const formData = ref({
  tel: '',
  name: '',
  userName: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  auditState: 0,
  state: 0,
  businessLicense: '',
})
const showFiles = ref([])
const imageValues = ref([])
const formDataRef = ref()
watchEffect(() => {
  console.log(formData.value, 'watch')
})
const classes = ref('0')
const dataTree = ref([])
const addRessId = ref(null)

function handleSubmit() {
  formDataRef.value.validate().then(({ valid }) => {
    if (valid) {
      uni.showToast({
        title: '提交成功',
        duration: 2000,
      })
      formData.value.businessLicense = images.value.join(',')
      submit(formData.value).then((res) => {
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
  formData.value.storeAddressName = data[0].text + '|' + data[1].text + '|' + data[2].text
}
function test(tree) {
  const outArray = []
  for (const data of tree) {
    const out = { text: data.name, value: data.code }
    // outArray.push(out)
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
  background: #b42a3e;
  border-radius: 24px;
  transform: translateX(-50%);
}
</style>
