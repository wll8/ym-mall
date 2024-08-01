/**
 * @description H5+下载App
 * @param downloadUrl:App下载链接
 * @param progressCallBack:下载进度回调
 */
export const downloadApp = (downloadUrl, progressCallBack = () => { }) => {
  return new Promise((resolve, reject) => {
    // 创建下载任务
    const downloadTask = plus.downloader.createDownload(
      downloadUrl,
      {
        method: 'GET',
      },
      (task, status) => {
        console.log(status, 'status')
        if (status == 200) {
          // 下载成功
          resolve(task.filename)
        } else {
          reject('fail')
          uni.showToast({
            title: '下载失败',
            duration: 1500,
            icon: 'none',
          })
        }
      },
    )
    // 监听下载过程
    downloadTask.addEventListener('statechanged', (task, status) => {
      switch (task.state) {
        case 1: // 开始
          break
        case 2: // 已连接到服务器
          break
        case 3: // 已接收到数据
          console.log(task, 'task')
          const hasProgress = task.totalSize && task.totalSize > 0 // 是否能获取到App大小
          if (hasProgress) {
            const current = parseInt((100 * task.downloadedSize) / task.totalSize) // 获取下载进度百分比
            progressCallBack(current, task.downloadedSize, task.totalSize)
          }
          break
        case 4: // 下载完成
          break
      }
    })
    // 开始执行下载
    downloadTask.start()
  })
}
/**
 * @description H5+安装APP
 * @param fileName:app文件名
 * @param callBack:安装成功回调
 */
export const installApp = (fileName, callBack = () => { }) => {
  // 注册广播监听app安装情况
  onInstallListening(callBack)
  // 开始安装
  plus.runtime.install(
    plus.io.convertLocalFileSystemURL(fileName),
    {},
    () => {
      // 成功跳转到安装界面
    },
    function (error) {
      uni.showToast({
        title: '安装失败',
        duration: 1500,
        icon: 'none',
      })
    },
  )
}
/**
 * @description 注册广播监听APP是否成功
 * @param callBack:安装成功回调函数
 */
const onInstallListening = (callBack = () => { }) => {
  const mainActivity = plus.android.runtimeMainActivity() // 获取activity
  // 生成广播接收器
  const receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
    onReceive: (context, intent) => {
      // 接收广播回调
      plus.android.importClass(intent)
      mainActivity.unregisterReceiver(receiver) // 取消监听
      callBack()
    },
  })
  const IntentFilter = plus.android.importClass('android.content.IntentFilter')
  const Intent = plus.android.importClass('android.content.Intent')
  const filter = new IntentFilter()
  filter.addAction(Intent.ACTION_PACKAGE_ADDED) // 监听apk安装
  filter.addDataScheme('package')
  mainActivity.registerReceiver(receiver, filter) // 注册广播
}
