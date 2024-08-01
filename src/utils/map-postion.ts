import { showToast } from './interaction'

interface MapNavConfig {
  /**
   * 纬度，范围为-90~90，负数表示南纬
   */
  latitude: number
  /**
   * 经度，范围为-180~180，负数表示西经
   */
  longitude: number
  /**
   * 位置名称
   */
  name?: string
  /**
   * 地址的详细说明
   */
  address?: string
}

export function openURL(map, platform) {
  const _defaultUrl = {
    android: {
      amap: `amapuri://route/plan/?sid=&did=&dlat=${this.latitude}&dlon=${this.longitude}&dname=${this.name}&dev=0&t=0`,
      qqmap: `qqmap://map/routeplan?type=drive&to=${this.name}&tocoord=${this.latitude},${this.longitude}&referer=fuxishan_uni_client`,
      baidumap: `baidumap://map/direction?origin=${this.selfLocation.latitude},${this.selfLocation.longitude}&destination=name:${this.name}|latlng:${this.latitude},${this.longitude}&coord_type=wgs84&mode=driving&src=andr.baidu.openAPIdemo"`,
    },
    ios: {
      amap: `iosamap://path?sourceApplication=fuxishan_uni_client&dlat=${this.latitude}&dlon=${this.longitude}&dname=${this.name}&dev=0&t=0`,
      qqmap: `qqmap://map/routeplan?type=drive&to=${this.name}&tocoord=${this.latitude},${this.longitude}&referer=fuxishan_uni_client`,
      baidumap: `baidumap://map/direction?origin=${this.selfLocation.latitude},${this.selfLocation.longitude}&destination=name:${this.name}|latlng:${this.latitude},${this.longitude}&mode=driving&src=ios.baidu.openAPIdemo`,
    },
  }
  const newurl = encodeURI(_defaultUrl[platform][map.name])
  plus.runtime.openURL(
    newurl,
    function (res) {
      uni.showModal({
        content: res.message,
      })
    },
    map.androidName ? map.androidName : '',
  )
}

export function toMapNavigation(config: MapNavConfig) {
  if (!config.latitude || !config.longitude) return
  // 微信
  // #ifdef MP-WEIXIN
  uni.openLocation({
    ...config,
    success: function (res) {
      console.log('打开系统位置地图成功')
    },
    fail: function () {
      uni.setClipboardData({
        data: config.name,
        success: () => {
          showToast('复制地址成功')
        },
      })
    },
  })
  // #endif

  // #ifdef APP-PLUS
  // 判断系统安装的地图应用有哪些, 并生成菜单按钮
  const _mapName = [
    { title: '高德地图', name: 'amap', androidName: 'com.autonavi.minimap', iosName: 'iosamap://' },
    {
      title: '百度地图',
      name: 'baidumap',
      androidName: 'com.baidu.BaiduMap',
      iosName: 'baidumap://',
    },
    { title: '腾讯地图', name: 'qqmap', androidName: 'com.tencent.map', iosName: 'qqmap://' },
  ]
  // 根据真机有的地图软件 生成的 操作菜单
  const buttons = []
  const platform = uni.getSystemInfoSync().platform
  platform === 'android' &&
    _mapName.forEach((item) => {
      if (plus.runtime.isApplicationExist({ pname: item.androidName })) {
        buttons.push(item)
      }
    })
  platform === 'ios' &&
    _mapName.forEach((item) => {
      if (plus.runtime.isApplicationExist({ action: item.iosName })) {
        buttons.push(item)
      }
    })
  if (buttons.length) {
    plus.nativeUI.actionSheet(
      {
        // 选择菜单
        title: '选择地图应用',
        cancel: '取消',
        buttons,
      },
      function (e) {
        const _map = buttons[e.index - 1]
        openURL(_map, platform)
      },
    )
  } else {
    uni.showToast({
      title: '请安装地图软件',
      icon: 'none',
    })
  }
  // #endif
}
