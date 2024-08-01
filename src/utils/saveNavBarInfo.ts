// 自定义navbar调用这个方法，保存设置navbar需要用到信息
export function saveNavbarInfo(): void {
  uni.getSystemInfo({
    success(res) {
      const { statusBarHeight, platform } = res
      let top = 0
      let height = 32
      if (uni.getMenuButtonBoundingClientRect) {
        const info = uni.getMenuButtonBoundingClientRect()
        top = info.top
        height = info.height
      }

      // 状态栏高度
      uni.setStorageSync('statusBarHeight', statusBarHeight)
      // 胶囊按钮高度 一般是32 如果获取不到就使用32
      uni.setStorageSync('menuButtonHeight', height || 32)

      // 判断胶囊按钮信息是否成功获取
      if (top && top !== 0 && height && height !== 0) {
        const navigationBarHeight = (top - statusBarHeight) * 2 + height
        // 导航栏高度
        uni.setStorageSync('navigationBarHeight', navigationBarHeight)
      } else {
        uni.setStorageSync('navigationBarHeight', platform === 'android' ? 48 : 44)
      }
    },
  })
}
