<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '设置',
    navigationBarBackgroundColor: '#fff',
    navigationStyle: 'default',
  },
}
</route>

<template>
  <view class="text-center">
    <view class="p-10px">
      <wd-cell-group border>
        <wd-cell title-width="110px" size="large" title="平台协议">
          <template #default>
            <view>
              <view clas="display: inline-block ">
                <span class="text-red-700" @click="toPrivacy(2)">《用户协议》</span>
                <span class="text-red-700" @click="toPrivacy(1)">《隐私政策》</span>
              </view>
            </view>
          </template>
          <template #icon>
            <view class="xieyi"></view>
          </template>
        </wd-cell>
        <wd-cell
          v-if="userStore.userInfo.role_name === 'user'"
          title-width="110px"
          @click="cancelAccount"
          size="large"
          title="注销账号"
          is-link
        >
          <template #icon>
            <view class="kaiji"></view>
          </template>
        </wd-cell>
        <!-- <wd-cell title-width="110px" size="large" @click="toChangePW" title="修改密码" is-link>
          <template #icon>
            <view class="xiugai"></view>
          </template>
        </wd-cell> -->
        <wd-cell title-width="110px" size="large" title="关于我们" @click="toPrivacy(3)" is-link>
          <template #icon>
            <view class="jinggao"></view>
          </template>
        </wd-cell>
        <wd-cell
          title-width="110px"
          size="large"
          title="版本更新"
          is-link
          @click="toVersionUpdates()"
        >
          <template #icon>
            <view class="jurassic"></view>
          </template>
          <view v-if="isUpdate" class="isUpdate">New</view>
        </wd-cell>
      </wd-cell-group>

      <view class="footer">
        <view class="btnstyle" @click="handleSubmit">退出登录</view>
      </view>
    </view>
    <view class="copyright">
      <view>贵州亿侎在线科技有限公司</view>
      <view>ICP备案号：黔ICP备2024024973号</view>
      <view>Copyright@2024-2025</view>
      <view>gzymzx.com 版权所有</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore, loginRoute } from '@/store'
import { logOut, oauthLogout, getDetail } from '@/service/user'
import { curVer } from '@/service/file'
// eslint-disable-next-line import/extensions
import checkVersion from '@/pages/lq-upgrade/checkVersion.js'

const userStore = useUserStore()
const isUpdate = ref(undefined)
const appVersion = ref(undefined)
function toChangePW(type) {
  uni.navigateTo({ url: `changePassword?type=${type}` })
}
function handleSubmit() {
  uni.showModal({
    title: '提示',
    content: '确认是否要退出登录',
    success: function (res) {
      if (res.confirm) {
        oauthLogout().then((res) => {})
        userStore.clearUserInfo()
        uni.reLaunch({ url: loginRoute })
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
}
function toPrivacy(type) {
  viewHtml(() => getDetail({ type }).then((res) => res.data))
}
function toVersionUpdates() {
  curVer()
    .then((res) => {
      const { versionCode, versionName, content, apkUrl, type } = res.data || {}
      const url = httpurl(apkUrl)
      versionName &&
        checkVersion({
          name: versionName, // 最新版本名称
          content, // 更新内容
          url, // 下载链接
          forceUpdate: Number(type) === 2,
        })
    })
    .catch(console.log)
}
function cancelAccount() {
  uni.showModal({
    title: '警告',
    content: '是否确认注销该账号',
    success: function (res) {
      if (res.confirm) {
        logOut().then((res) => {})
        userStore.clearUserInfo()
        uni.reLaunch({ url: loginRoute })
      } else if (res.cancel) {
        // console.log('用户点击取消')
      }
    },
  })
}
function getCurVer() {
  const appVersion = uni.getSystemInfoSync().appVersion
  curVer().then((res) => {
    const { versionName } = res.data || {}
    if (versionName) {
      versionName === appVersion ? (isUpdate.value = false) : (isUpdate.value = true)
    }
  })
}
getCurVer()
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

.copyright {
  position: absolute;
  bottom: 5%;
  left: 50%;
  width: 300px;
  font-size: 12px;
  color: #9b9b9b;
  text-align: center;
  transform: translateX(-50%);
}

.btnstyle {
  width: 319px;
  height: 48px;
  margin: 20px auto;
  line-height: 48px;
  color: #000;
  background: #f9f9f9;
  border-radius: 10px;
}

.jinggao {
  box-sizing: border-box;
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: httpurl('/static/images/setting/guanyuwomen.png') no-repeat;
  background-size: cover;
}

.jurassic {
  box-sizing: border-box;
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: httpurl('/static/images/setting/banbengengxin.png') no-repeat;
  background-size: cover;
}

.kaiji {
  box-sizing: border-box;
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: httpurl('/static/images/setting/zhuxiao.png') no-repeat;
  background-size: cover;
}

.xiugai {
  box-sizing: border-box;
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: httpurl('/static/images/setting/xiugai.png') no-repeat;
  background-size: cover;
}

.xieyi {
  box-sizing: border-box;
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: httpurl('/static/images/setting/yonghuxieyi.png') no-repeat;
  background-size: cover;
}

.isUpdate {
  width: 60px;
  height: 25px;
  font-size: 17px;
  line-height: 25px;
  color: white;
  text-align: center;
  background: #b91c1c;
  border-radius: 30px;
}
</style>
