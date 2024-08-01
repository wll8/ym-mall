<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '修改密码',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="text-center">
    <view class="p-10px">
      <wd-form ref="form" :model="formData">
        <wd-cell-group border>
          <wd-input
            label="手机号码"
            label-width="80px"
            prop="phoneNumber"
            clearable
            v-model="formData.phoneNumber"
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
          <wd-input
            label="验证码"
            label-width="80px"
            prop="Captcha"
            v-model="formData.Captcha"
            use-suffix-slot
            placeholder="请输入验证码"
            :rules="[{ required: false, pattern: /^.+$/, message: '请填写验证码' }]"
          >
            <template #suffix>
              <view v-if="isCaptcha" class="captcha" @click="test">获取验证码</view>
              <view v-else id="time" class="captcha">
                {{ '请在' + time + '秒后重试' }}
              </view>
            </template>
          </wd-input>
          <wd-input
            label="新密码"
            label-width="80px"
            prop="password"
            clearable
            v-model="formData.password"
            placeholder="请输入新的密码"
            :rules="[{ required: false, pattern: /^.+$/, message: '请填写密码' }]"
          />
          <wd-input
            label="确认密码"
            label-width="80px"
            prop="password"
            clearable
            v-model="formData.password"
            placeholder="请再次输入密码"
            :rules="[{ required: false, pattern: /^.+$/, message: '请填写密码' }]"
          />
        </wd-cell-group>

        <view class="footer">
          <view class="btnstyle" @click="handleSubmit">确认</view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="ts" setup>
const formData = reactive<{
  phoneNumber: string
  name: string
  address: string
  description: string
  isDefault: boolean
  password: string
  Captcha: number
}>({
  Captcha: null,
  phoneNumber: '',
  name: '',
  address: '',
  description: '',
  isDefault: false,
  password: '',
})
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
const isCaptcha = ref(true)
const time = ref(60)
const captcha = ref()
function test() {
  isCaptcha.value = false
  captcha.value = setInterval(() => {
    time.value--
    if (time.value === 0) {
      isCaptcha.value = true
      clearInterval(captcha.value)
      time.value = 60
    }
  }, 1000)
}
const displayFormat = (items) => {
  return items
    .map((item) => {
      return item.label
    })
    .join('-')
}
onUnmounted(() => {
  clearInterval(captcha.value)
})
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

.captcha {
  font-size: 14px;
  color: #b42a3e;
}
</style>
