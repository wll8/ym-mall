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
      <wd-img-cropper v-model="show" :img-src="src" @confirm="handleConfirm"></wd-img-cropper>
      <view class="profile">
        <view v-if="!imgSrc" class="img" @click="upload">
          <wd-icon name="fill-camera" custom-class="img-icon"></wd-icon>
        </view>
        <wd-img
          v-if="imgSrc"
          round
          width="200px"
          height="200px"
          :src="httpurl(imgSrc)"
          mode="aspectFit"
          custom-class="profile-img"
          @click="upload"
        />
        <view style="font-size: 14px">点击上传头像</view>
      </view>

      <wd-form ref="form" :model="formData">
        <wd-cell-group class="mt-30px" border>
          <wd-input
            label="昵称"
            label-width="80px"
            prop="name"
            clearable
            v-model="formData.name"
            placeholder="请输入新的昵称"
            :rules="[
              {
                required: false,
                pattern: /^.+$/,
                message: '昵称不能为空',
              },
            ]"
          />
        </wd-cell-group>
        <wd-cell-group
          class="mt-30px"
          v-if="String(userInfo.registerState) === '10' && userInfo.role_name === 'user'"
          border
        >
          <wd-input
            label="邀请码"
            label-width="80px"
            prop="inviteCode"
            clearable
            v-model="formData.inviteCode"
            placeholder="请输入邀请码"
            :rules="[
              {
                required: true,
                message: '邀请码不能为空',
              },
            ]"
          />
        </wd-cell-group>
        <wd-cell title="相关凭证" title-width="58px" />
        <UploadImages
          :max-count="5"
          v-model:imgs-list="imageValues"
          :show-file-list="handlePhotoBack(imageValues)"
        />
        <view class="footer">
          <view class="btnstyle" @click="handleSubmit()">保存</view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="js" setup>
import { useUserStore } from '@/store'
import { putUserInfo, getUserInfo } from '@/service/user'
import { fileUpload } from '@/service/file'
import { showToast } from '@/utils/interaction'
import { handlePhotoBack } from '@/utils/map-imgs'
const userStore = useUserStore()
// eslint-disable-next-line camelcase
const userInfo = userStore.userInfo

const formData = ref({
  name: '',
  address: '',
  businessLicense: '',
  inviteCode: '',
})
const showFiles = ref([])
const imageValues = ref([])
const src = ref('')
const imgSrc = ref('')
const show = ref(false)

const form = ref()
const isInviteCode = ref(false)
onLoad((options) => {
  console.log(options)
  if (options.isInviteCode) {
    isInviteCode.value = true
  }
})
async function updateUserInfoRegisterState() {
  const res = await getUserInfo()
  if (res.data.registerState) {
    userStore.setUserInfo({ ...userStore.userInfo, ...res.data })
  }
}

function handleSubmit() {
  form.value.validate().then(({ valid }) => {
    if (valid) {
      const data = Object.assign({}, formData.value, { avatar: imgSrc.value })
      //
      data.businessLicense = imageValues.value.join(',')
      putUserInfo(data).then(async (res) => {
        userStore.setUserInfo({ ...userStore.userInfo, avatar: imgSrc.value })
        await updateUserInfoRegisterState()
        if (isInviteCode.value) {
          uni.$emit('refreshData')
          showToast('邀请码绑定成功！')
          setTimeout(() => {
            uni.navigateBack({ delta: 1 })
          }, 1000)
          return
        }
        uni.reLaunch({ url: '/pages/me/index' })
      })
    }
  })
}

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
function handleConfirm(event) {
  const { tempFilePath } = event
  fileUpload(tempFilePath).then((res) => {
    imgSrc.value = res.data.link
  })
}
function handleUserInfo() {
  getUserInfo().then((res) => {
    formData.value = res.data
    imgSrc.value = res.data.avatar
    formData.value.businessLicense = res.data.businessLicense
    if (res.data.businessLicense) {
      imageValues.value = res.data.businessLicense.split(',')
      // showFiles.value = [{ status: 'success', url: res.data.businessLicense }]
    } else {
      imageValues.value = []
    }
  })
}

handleUserInfo()
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
