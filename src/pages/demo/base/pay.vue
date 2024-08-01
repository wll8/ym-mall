<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '支付',
  },
}
</route>

<template>
  <view class="">
    <view class="uni-padding-wrap">
      <view style="padding: 50rpx 0; background: #fff">
        <view class="uni-hello-text uni-center"><text>支付金额</text></view>
        <view class="uni-h1 uni-center uni-common-mt">
          <text class="rmbLogo">￥</text>
          <input class="price" type="digit" :value="price" maxlength="4" @input="priceChange" />
        </view>
      </view>
      <view class="uni-btn-v uni-common-mt">
        <!-- #ifdef MP-WEIXIN -->
        <button type="primary" @click="weixinPay" :loading="loading">微信支付</button>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <template v-if="providerList.length > 0">
          <button
            v-for="(item, index) in providerList"
            :key="index"
            @click="requestPayment(item, index)"
            :loading="item.loading"
          >
            {{ item.name }}支付
          </button>
        </template>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script lang="js" setup>
const loading = ref(false)
const price = ref(1)
const openid = ref(``)
const providerList = ref([])

onLoad(() => {
  // #ifdef APP-PLUS
  uni.getProvider({
    service: 'payment',
    success: (e) => {
      console.log('payment success:' + JSON.stringify(e))
      const list = []
      providerList.value = e.provider.map((value) => ({
        name: value,
        id: value,
        loading: false,
      }))
    },
    fail: (e) => {
      console.log('获取支付通道失败：', e)
    },
  })
  // #endif
})

console.log(`平台`, process.env.UNI_PLATFORM)

function loginMpWeixin() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success(res) {
        console.warn(
          '此处使用uni-id处理微信小程序登录，详情参考: https://uniapp.dcloud.net.cn/uniCloud/uni-id',
        )
        uni.request({
          url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/user-center',
          method: 'POST',
          data: {
            action: 'loginByWeixin',
            params: {
              code: res.code,
              platform: 'mp-weixin',
            },
          },
          success(res) {
            if (res.data.code !== 0) {
              reject(new Error('获取openid失败：', res.result.msg))
              return
            }
            uni.setStorageSync('openid', res.data.openid)
            resolve(res.data.openid)
          },
          fail(err) {
            reject(new Error('获取openid失败：' + err))
          },
        })
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

async function weixinPay() {
  let id = uni.getStorageSync('openid')
  console.log('发起支付')
  loading.value = true
  if (!id) {
    try {
      id = await loginMpWeixin()
    } catch (e) {
      console.error(e)
    }

    if (!id) {
      uni.showModal({
        content: '获取openid失败',
        showCancel: false,
      })
      loading.value = false
      return
    }
  }
  openid.value = id
  const orderInfo = await getOrderInfo('wxpay')
  if (!orderInfo) {
    uni.showModal({
      content: '获取支付信息失败',
      showCancel: false,
    })
    return
  }
  uni.requestPayment({
    ...orderInfo,
    success: (res) => {
      uni.showToast({
        title: '感谢您的赞助!',
      })
    },
    fail: (res) => {
      uni.showModal({
        content: '支付失败,原因为: ' + res.errMsg,
        showCancel: false,
      })
    },
    complete: () => {
      loading.value = false
    },
  })
}
async function requestPayment(e, index) {
  providerList.value[index].loading = true
  const provider = e.id
  const orderInfo = await getOrderInfo(provider)
  if (!orderInfo) {
    uni.showModal({
      content: '获取支付信息失败',
      showCancel: false,
    })
    return
  }
  console.log('--------orderInfo--------')
  console.log(orderInfo)
  uni.requestPayment({
    provider,
    orderInfo,
    success: (e) => {
      console.log('success', e)
      uni.showToast({
        title: '感谢您的赞助!',
      })
    },
    fail: (e) => {
      console.log('fail', e)
      uni.showModal({
        content: '支付失败,原因为: ' + e.errMsg,
        showCancel: false,
      })
    },
    complete: () => {
      providerList.value[index].loading = false
    },
  })
}
function getOrderInfo(provider) {
  return new Promise((resolve, reject) => {
    if (!price.value) {
      reject(new Error('请输入金额'))
    }
    console.warn('此处使用uni-pay处理支付，详情参考: https://uniapp.dcloud.io/uniCloud/unipay')
    uni.request({
      method: 'POST',
      url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/pay',
      data: {
        provider,
        openid: openid.value,
        totalFee: Number(price.value) * 100, // 转为以分为单位
        platform:
          {
            app: `app-plus`,
            'mp-weixin': `mp-weixin`,
          }[process.env.UNI_PLATFORM] || `app-plus`,
      },
      success(res) {
        if (res.data.code === 0) {
          resolve(res.data.orderInfo)
        } else {
          reject(new Error('获取支付信息失败' + res.data.msg))
        }
      },
      fail(err) {
        reject(new Error('请求支付接口失败' + err))
      },
    })
  })
}
function priceChange(e) {
  console.log(e.detail.value)
  price.value = e.detail.value
}
</script>

<style lang="scss" scoped>
.rmbLogo {
  font-size: 40rpx;
}

button {
  color: #fff;
  background-color: #007aff;
}

.uni-center {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
}

.price {
  width: 200rpx;
  height: 80rpx;
  padding-bottom: 4rpx;
  border-bottom: 1px solid #eee;
}

.ipaPayBtn {
  margin-top: 30rpx;
}
</style>
