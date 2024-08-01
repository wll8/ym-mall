<route lang="json5">
{
  style: {
    navigationBarTitleText: '登录',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="text-center">
    <view class="mx-auto my-40px">
      <view class="mx-auto my-16px">
        <wd-img :width="100" :height="100" :src="httpurl('/static/icon/108.png')" />
      </view>
      <view>
        <h2 class="text-2xl">欢迎进入亿侎商城</h2>
      </view>
    </view>
    <view class="px-10px">
      <wd-form ref="form" :model="formData">
        <wd-cell-group border>
          <wd-input
            label="手机号码"
            label-width="80px"
            prop="phone"
            clearable
            v-model="formData.phone"
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
            prop="captchaCode"
            v-model="formData.captchaCode"
            use-suffix-slot
            placeholder="请输入验证码"
            :rules="[{ required: false, pattern: /^.+$/, message: '请填写验证码' }]"
          >
            <template #suffix>
              <view v-if="time == 60" class="captcha" @click="test(formData.phone)">
                获取验证码
              </view>
              <view v-else id="time" class="captcha">
                {{ '请在' + time + '秒后重试' }}
              </view>
            </template>
          </wd-input>
        </wd-cell-group>
        <view class="from">
          <view class="link">
            <view @click="changePage">
              没有账号，
              <span class="captcha">马上注册</span>
            </view>
          </view>
          <!-- <view class="link-left" @click="toChangePW">
            <view>忘记密码？</view>
          </view> -->
        </view>
        <view class="footer">
          <view class="agreement-content">
            <view v-if="isCheck" class="svg-icon si-checked" @click="changeClick"></view>
            <view v-else class="svg-icon si-check" @click="changeClick"></view>
            <view class="agreement">
              <text>允许我们在必要的场景下合理使用你的相关信息， 请阅读并同意</text>
              <text @click="toPrivacy(2)" class="text-color">《用户协议》</text>
              <text @click="toPrivacy(1)" class="text-color">《隐私政策》</text>
            </view>
          </view>
          <view class="btnstyle" @click="handleSubmit">登录</view>
          <view class="version">v{{ appVersion }}</view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="js" setup>
import { useUserStore, useTabbarStore } from '@/store'
import { storeToRefs } from 'pinia'
import { login, sendValidate, getAuthorization, getDetail } from '@/service/user'
import { getLastItem, toHome } from '@/utils'
const isCheck = ref(false)
const tabbar = storeToRefs(useTabbarStore())

const userStore = useUserStore()

const formData = ref({
  captchaCode: '',
  captchaId: '',
  phone: '',
})
const appVersion = ref()
const form = ref()
const isCaptcha = ref(true)
const time = ref(60)
const captcha = ref()
const changePage = () => {
  uni.redirectTo({ url: '/pages/login/enroll' })
}

function changeClick() {
  isCheck.value = !isCheck.value
}
function toPrivacy(type) {
  viewHtml(() => getDetail({ type }).then((res) => res.data))
}
function toChangePW() {
  uni.navigateTo({ url: '/pages/me/pages/set/changePassword' })
}
function test(phone) {
  const uPattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (!uPattern.test(phone)) {
    uni.showToast({
      title: '请填写正确的手机号码',
      icon: 'error',
    })
    return
  }
  sendValidate({ key: phone }).then((res) => {
    formData.value.captchaId = res.data.id
    isCaptcha.value = false
    captcha.value = setInterval(() => {
      time.value--
      if (time.value === 0) {
        isCaptcha.value = true
        clearInterval(captcha.value)
        time.value = 60
      }
    }, 1000)
  })
}
function handleSubmit() {
  form.value
    .validate()
    .then(async ({ valid, errors }) => {
      if (valid) {
        if (!isCheck.value) {
          uni.showToast({
            title: '请同意用户协议与隐私政策',
            icon: 'none',
          })
          return
        }
        const res = await getAuthorization()
        userStore.setAuth({
          authorization: res.data.Authorization,
          tenantId: res.data.Tenant_Id,
        })
        login(formData.value).then((result) => {
          const data = result.data
          userStore.setAuth({
            accessToken: data.access_token,
          })
          // 记录token userId
          userStore.setUserInfo({
            ...data,
            phone: data.account,
            indexPage: data.indexPage || `/pages/index/index`,
            name: data.nick_name,
          })
          tabbar.tabBarList.value = data.tabbar || []
          toHome()
        })
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}

onLoad(() => {
  appVersion.value = uni.getSystemInfoSync().appVersion
})
</script>

<style lang="scss" scoped>
.from {
  position: relative;
  height: 50px;
  margin: 0 auto;
}

.svg-icon {
  width: 54rpx;
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
  bottom: 30px;
  left: 50%;
  width: 319px;
  height: 48px;
  line-height: 48px;
  color: #fff;
  background: #b42a3e;
  border-radius: 24px;
  transform: translateX(-50%);
}

.version {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 319px;
  font-size: 12px;
  color: #b1b1b1;
  transform: translateX(-50%);
}

.agreement-content {
  position: absolute;
  bottom: 90px;
  left: 50%;
  display: flex;
  align-items: center;
  width: 319px;
  margin: 0 auto;
  font-size: 12px;
  text-align: left;
  transform: translateX(-50%);
}

.agreement {
  margin-left: 10px;
}

.text-color {
  color: #b42a3e;
}

.captcha {
  font-size: 14px;
  color: #b42a3e;
}
</style>
