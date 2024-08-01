/* stylelint-disable order/properties-order */
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
                <span class="text-red-700" @click="toPrivacy(0)">《服务条款》</span>
                <span class="text-red-700" @click="toPrivacy(1)">《隐私政策》</span>
              </view>
            </view>
          </template>
          <template #icon>
            <view class="xieyi"></view>
          </template>
        </wd-cell>
        <wd-cell title-width="110px" @click="cancelAccount" size="large" title="注销账号" is-link>
          <template #icon>
            <view class="kaiji"></view>
          </template>
        </wd-cell>
        <wd-cell title-width="110px" size="large" @click="toChangePW" title="修改密码" is-link>
          <template #icon>
            <view class="xiugai"></view>
          </template>
        </wd-cell>
        <wd-cell
          title-width="110px"
          size="large"
          title="关于我们"
          @click="changePage('AboutUs')"
          is-link
        >
          <template #icon>
            <view class="jinggao"></view>
          </template>
        </wd-cell>
        <wd-cell title-width="110px" size="large" title="版本更新" is-link>
          <template #icon>
            <view class="jurassic"></view>
          </template>
        </wd-cell>
      </wd-cell-group>

      <view class="footer">
        <view class="btnstyle" @click="handleSubmit">退出登录</view>
      </view>
    </view>
  </view>
</template>

<script lang="js" setup>
import { getDetail } from '@/service/user'
import { useUserStore, loginRoute } from '@/store'
const userStore = useUserStore()

const changePage = (data) => {
  uni.navigateTo({ url: data })
}
function toChangePW(type) {
  uni.navigateTo({ url: `changePassword?type=${type}` })
}
function handleSubmit() {
  userStore.clearUserInfo()
  uni.reLaunch({ url: loginRoute })
}
function toPrivacy(type) {
  viewHtml(() => getDetail({ type }).then((res) => res.data))
}
function cancelAccount() {
  uni.showModal({
    title: '警告',
    content: '是否确认注销该账号',
    success: function (res) {
      if (res.confirm) {
        handleSubmit()
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
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
  width: 319px;
  height: 48px;
  margin: 20px auto;
  line-height: 48px;
  color: #b6b6b6;
  background: #f9f9f9;
  border-radius: 10px;
}

.jinggao {
  box-sizing: border-box;
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: httpurl('/static/images/setting/jinggao.png') no-repeat;
  background-size: cover;
}

.jurassic {
  box-sizing: border-box;
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: httpurl('/static/images/setting/jurassic_version.png') no-repeat;
  background-size: cover;
}

.kaiji {
  box-sizing: border-box;
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: httpurl('/static/images/setting/kaiji.png') no-repeat;
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
  background: httpurl('/static/images/setting/yonghuxieyi1.png') no-repeat;
  background-size: cover;
}
</style>
