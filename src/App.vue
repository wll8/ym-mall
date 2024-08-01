<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { saveNavbarInfo } from './utils/saveNavBarInfo'
import { useUserStore } from '@/store'
// eslint-disable-next-line import/extensions
import checkVersion from '@/pages/lq-upgrade/checkVersion.js'
import { curVer } from '@/service/file'
import { perListener } from '@/utils/permission-listener'
onLaunch((arg) => {
  // 当前方法只在app里面执行
  // #ifdef APP-PLUS
  perListener()
  // #endif

  console.log('App Launch', arg)
  const indexPage = useUserStore().userInfo.indexPage
  if (!arg.path.startsWith(indexPage)) {
    // todo 当用户手动删除路由为 / 时，应跳转到用户真实的所属首页
    // uni.reLaunch({
    //   url: indexPage,
    // })
  }
  saveNavbarInfo()

  // #ifdef APP-PLUS
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
  // #endif
})
onShow(() => {
  console.log('App Show')
  // checkLogin()()
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
