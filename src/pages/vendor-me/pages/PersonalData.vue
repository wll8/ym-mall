<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '个人资料',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="text-center">
    <view class="p-10px">
      <wd-img-cropper
        v-model="show"
        :img-src="src"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      ></wd-img-cropper>
      <view class="profile my-2">
        <view v-if="!imgSrc" class="img" @click="upload">
          <wd-icon name="fill-camera" custom-class="img-icon"></wd-icon>
        </view>
        <wd-img
          v-if="imgSrc"
          round
          width="100px"
          height="100px"
          :src="httpurl(userStore.userInfo.avatar)"
          mode="aspectFit"
          custom-class="profile-img"
          @click="upload"
        />
        <view class="text-sm text-slate-400">点击上传头像</view>
      </view>

      <wd-form ref="form" :model="formData">
        <wd-cell-group border>
          <wd-input
            label="账号"
            label-width="80px"
            prop="Captcha"
            v-model="formData.name"
            use-suffix-slot
            placeholder="请输入新账号"
          ></wd-input>
          <wd-divider></wd-divider>
          <view class="flex items-center h-10">
            <view class="ml-15px mr-65px">性别</view>
            <wd-radio-group v-model="formData.sex" shape="dot" inline>
              <wd-radio value="1">男</wd-radio>
              <wd-radio value="2">女</wd-radio>
            </wd-radio-group>
          </view>
          <wd-input
            label="昵称"
            label-width="80px"
            prop="name"
            clearable
            v-model="formData.name"
            placeholder="请输入新的昵称"
          />
          <wd-input
            label="年龄"
            label-width="80px"
            prop="age"
            clearable
            v-model="formData.age"
            placeholder="请输入新的年龄"
          />
        </wd-cell-group>

        <view class="footer">
          <view class="btnstyle" @click="handleSubmit()">保存</view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
const userStore = useUserStore()
const formData = ref({
  phoneNumber: '',
  name: '',
  address: '',
  sex: '1',
  description: '',
  isDefault: false,
  age: '',
})
formData.value.name = userStore.userInfo.name
const isRevise = ref(true)
const form = ref()
const changePage = () => {
  uni.redirectTo({ url: 'enroll' })
}
function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      console.log('valid')
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
const src = ref<string>('')
const imgSrc = ref<string>('/static/images/personalCenter/beauty.png')
const show = ref<boolean>(false)

function upload() {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const tempFilePaths = res.tempFilePaths[0]
      src.value = tempFilePaths
      show.value = true
    },
  })
}
function handleCancel(event) {
  console.log('取消', event)
}
function handleConfirm(event) {
  const { tempFilePath } = event
  imgSrc.value = tempFilePath
}
const displayFormat = (items) => {
  return items
    .map((item) => {
      return item.label
    })
    .join('-')
}
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
