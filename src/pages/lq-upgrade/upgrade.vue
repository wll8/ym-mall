<route lang="json5" type="page">
{
  loginTag: true,
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
    'app-plus': {
      bounce: 'none',
      animationType: 'none',
      background: 'transparent',
    },
  },
}
</route>
<template>
  <view class="upgrade-popup">
    <image class="header-bg" src="./upgrade_bg.png" mode="widthFix"></image>
    <view class="main">
      <view class="version">发现新版本{{ versionName }}</view>
      <view class="content">
        <text class="title">更新内容</text>
        <view class="desc" v-html="versionDesc"></view>
      </view>
      <!--下载状态-进度条显示 -->
      <view class="footer" v-if="isStartDownload">
        <view class="progress-view" :class="{ active: !hasProgress }" @click="handleInstallApp">
          <!-- 进度条 -->
          <view v-if="hasProgress" style="height: 100%">
            <view class="txt">{{ percentText }}</view>
            <view class="progress" :style="setProStyle"></view>
          </view>
          <view v-else>
            <view class="btn upgrade force">{{ isDownloadFinish ? '立即安装' : '下载中...' }}</view>
          </view>
        </view>
      </view>
      <!-- 强制更新 -->
      <view class="footer" v-else-if="isForceUpdate">
        <view class="btn upgrade force" @click="handleUpgrade">立即更新</view>
      </view>
      <!-- 可选择更新 -->
      <view class="footer" v-else>
        <view class="btn close" @click="handleClose">以后再说</view>
        <view class="btn upgrade" @click="handleUpgrade">立即更新</view>
      </view>
    </view>
  </view>
</template>

<script>
import { downloadApp, installApp } from './upgrade.js'
export default {
  data() {
    return {
      isForceUpdate: false, //是否强制更新
      versionName: '', //版本名称
      versionDesc: '', //更新说明
      downloadUrl: '', //APP下载链接
      isDownloadFinish: false, //是否下载完成
      hasProgress: false, //是否能显示进度条
      currentPercent: 0, //当前下载百分比
      isStartDownload: false, //是否开始下载
      fileName: '', //下载后app本地路径名称
    }
  },
  computed: {
    //设置进度条样式，实时更新进度位置
    setProStyle() {
      return {
        width: (510 * this.currentPercent) / 100 + 'rpx', //510：按钮进度条宽度
      }
    },
    //百分比文字
    percentText() {
      let percent = this.currentPercent
      if (typeof percent !== 'number' || isNaN(percent)) return '下载中...'
      if (percent < 100) return `下载中${percent}%`
      return '立即安装'
    },
  },

  onBackPress(options) {
    // 禁用返回
    if (options.from == 'backbutton') {
      return true
    }
  },
  onLoad({ obj }) {
    this.bindEmit(JSON.parse(obj))
    console.log(`加载了 onLoad`)
  },
  created() {
    console.log(`加载了 created`)
  },
  methods: {
    bindEmit(e) {
      let { name, content, url, forceUpdate } = e
      this.isForceUpdate = forceUpdate
      this.versionName = name
      this.versionDesc = content
      this.downloadUrl = url
    },
    //更新
    handleUpgrade() {
      if (this.downloadUrl) {
        this.isStartDownload = true
        //开始下载App
        downloadApp(this.downloadUrl, (current) => {
          //下载进度监听
          this.hasProgress = true
          this.currentPercent = current
        })
          .then((fileName) => {
            //下载完成
            this.isDownloadFinish = true
            this.fileName = fileName
            if (fileName) {
              //自动安装App
              this.handleInstallApp()
            }
          })
          .catch((e) => {
            console.log(e, 'e')
          })
      } else {
        uni.showToast({
          title: '下载链接不存在',
          icon: 'none',
        })
      }
    },
    //安装app
    handleInstallApp() {
      //下载完成才能安装，防止下载过程中点击
      if (this.isDownloadFinish && this.fileName) {
        installApp(this.fileName, () => {
          //安装成功,关闭升级弹窗
          uni.navigateBack()
        })
      }
    },
    //关闭返回
    handleClose() {
      uni.navigateBack()
    },
  },
}
</script>

<style>
page {
  background: rgb(0 0 0 / 50%); /**  设置窗口背景半透明 */
}
</style>
<style lang="scss" scoped>
.upgrade-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  width: 580rpx;
  height: auto;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 20rpx;
  transform: translate(-50%, -50%);
}

.header-bg {
  width: 100%;
  margin-top: -112rpx;
}

.main {
  box-sizing: border-box;
  padding: 10rpx 30rpx 30rpx;

  .version {
    width: 100%;
    overflow: hidden;
    font-size: 36rpx;
    font-weight: 700;
    color: #026df7;
    text-align: center;
    text-overflow: ellipsis;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .content {
    margin-top: 60rpx;

    .title {
      font-size: 28rpx;
      font-weight: 700;
      color: #000;
    }

    .desc {
      box-sizing: border-box;
      max-height: 40vh;
      margin-top: 20rpx;
      overflow-y: auto;
      font-size: 28rpx;
      color: #6a6a6a;
    }
  }

  .footer {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 100rpx;

    .btn {
      position: relative;
      z-index: 999;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 246rpx;
      height: 96rpx;
      font-size: 32rpx;
      letter-spacing: 2rpx;
      border-radius: 10rpx;

      &.force {
        width: 500rpx;
      }

      &.close {
        margin-right: 25rpx;
        color: #000;
        border: 1px solid #e0e0e0;
      }

      &.upgrade {
        color: white;
        background-color: #026df7;
      }
    }

    .progress-view {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 510rpx;
      height: 90rpx;
      padding: 0;
      overflow: hidden;
      background-color: #dcdcdc;
      border: none;
      border-radius: 6rpx;

      &.active {
        background-color: #026df7;
      }

      .progress {
        box-sizing: border-box;
        height: 100%;
        padding: 0;
        background-color: #026df7;
        border: none;
        border-top-left-radius: 10rpx;
        border-bottom-left-radius: 10rpx;
      }

      .txt {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 28rpx;
        color: #fff;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
