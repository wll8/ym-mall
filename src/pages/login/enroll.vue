<route lang="json5" type="page">
{
  loginTag: true,
  style: {
    navigationBarTitleText: '注册',
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
        <h2 class="text-2xl">欢迎注册亿侎商城</h2>
      </view>
    </view>
    <view class="px-10px">
      <wd-form ref="form" :model="formData">
        <wd-cell-group border>
          <wd-input
            label="手机号码"
            label-width="100px"
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
            label-width="100px"
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
          <wd-cell left title="所属地区" title-width="80px">
            <view class="custom-value">
              <uni-data-picker
                :clear-icon="false"
                :ellipsis="true"
                :localdata="dataTree"
                @change="onchange"
                v-slot:default="{ data, error }"
              >
                <view class="input-border">
                  <view v-if="error" class="error">
                    <text>{{ error }}</text>
                  </view>
                  <view v-else-if="data.length" class="input-selected">
                    <view v-for="(item, index) in data" :key="index" class="selected-item">
                      <text>{{ item.text }}</text>
                    </view>
                  </view>
                  <view class="text1" v-else><text>请选择收货地址所在地区</text></view>
                </view>
              </uni-data-picker>
            </view>
          </wd-cell>
          <wd-input
            label="邀请码"
            label-width="100px"
            prop="inviteCode"
            clearable
            v-model="formData.inviteCode"
            placeholder="请输入邀请码（非必填/可跳过）"
          />
        </wd-cell-group>
        <view class="from">
          <view class="link">
            <view>
              已有账号，
              <span class="captcha" @click="changePage">直接登录</span>
            </view>
          </view>
        </view>
        <view class="footer">
          <view class="btnstyle" @click="handleSubmit">立即注册</view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="js" setup>
import { loginRoute } from '@/store'
import { enrolluser, sendValidate } from '@/service/user'
import { getPickerList } from '@/service/address'
const formData = ref({
  captchaCode: '',
  captchaId: '',
  phone: '',
  inviteCode: '',
})
const dataTree = ref([])
const classes = ref('0')
const form = ref()
const changePage = () => {
  uni.redirectTo({ url: 'index' })
}
const isCaptcha = ref(true)
const time = ref(60)
const captcha = ref()

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
  })
  captcha.value = setInterval(() => {
    time.value--
    if (time.value === 0) {
      isCaptcha.value = true
      clearInterval(captcha.value)
      time.value = 60
    }
  }, 1000)
}
function onchange(e) {
  const data = e.detail.value
  formData.value.province = data[0].value
  formData.value.city = data[1].value
  formData.value.district = data[2].value
  formData.value.addressAllName = data[0].text + data[1].text + data[2].text
  formData.value.address = data[0].value + ',' + data[1].value + ',' + data[2].value
}
function handlePickerList() {
  getPickerList().then((res) => {
    dataTree.value = testChange(res.data)
  })
}
function testChange(tree) {
  const outArray = []
  for (const data of tree) {
    const out = { text: data.name, value: data.code }
    if (data.children && data.children.length) {
      out.children = testChange(data.children)
    }
    outArray.push(out)
  }
  return outArray
}
function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        enrolluser(formData.value).then((res) => {
          if (res.code === 200) {
            uni.showToast({
              title: '注册成功',
              success() {
                setTimeout(function () {
                  uni.hideToast()
                  uni.redirectTo({ url: loginRoute })
                }, 2000)
              },
            })
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'error',
            })
          }
        })
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
onUnmounted(() => {
  clearInterval(captcha.value)
})
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

.captcha {
  font-size: 14px;
  color: #b42a3e;
}

.text1 {
  padding-left: 20px;
  overflow: hidden;
  color: #bfbfbf;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.input-selected {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  line-height: 2;
}
</style>
