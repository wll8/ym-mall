const mapPermission = {
  'android.permission.CAMERA': {
    title: '相机权限说明',
    content:
      '便于您使用该功能上传图片，用于与设置头像，设置产品相关的图片以及拍摄图片作为凭证记录信息',
  },
  'android.permission.WRITE_EXTERNAL_STORAGE': {
    title: '相机/相册权限说明',
    content:
      '便于您使用该功能上传您的照片/图片/视频及用于更换头像、发布产品/需求、下载以及拍摄图片作为凭证记录信息场景中读取和写入相册和文件内容',
  },
  'android.permission.CALL_PHONE': {
    title: '电话权限说明',
    content: '便于您使用该功能拨打电话，用于与客服沟通等场景中拨打电话',
  },
}

// 判断数组的两个项是否相等
export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }

  const sortedArr1 = arr1.slice().sort()
  const sortedArr2 = arr2.slice().sort()

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false
    }
  }

  return true
}

let isIos = false
// #ifdef APP-PLUS
isIos = plus.os.name === 'iOS'
// #endif

export function createView() {
  return new plus.nativeObj.View('per-modal', {
    top: '0px',
    left: '0px',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    // opacity: '.9'
  })
}
// 只展示安安卓的内容
export function showViewDesc(view: PlusNativeObjView, permission: string) {
  if (isIos) return
  // 获取对应的权限信息
  const info = mapPermission[permission]
  if (info) {
    view.drawRect(
      {
        color: '#fff',
        radius: '5px',
      },
      {
        top: '30px',
        left: '5%',
        width: '90%',
        height: '100px',
      },
    )
    view.drawText(
      info.title,
      {
        top: '40px',
        left: '8%',
        height: '30px',
      },
      {
        align: 'left',
        color: '#000',
      },
    )
    view.drawText(
      info.content,
      {
        top: '65px',
        height: '60px',
        left: '8%',
        width: '84%',
      },
      {
        whiteSpace: 'normal',
        size: '14px',
        align: 'left',
        color: '#656563',
      },
    )
  }

  return view
}

export function perListener() {
  const permissionListener = (uni as any).createRequestPermissionListener()
  const view = createView()
  permissionListener.onConfirm((e) => {
    const keys = Object.keys(mapPermission)
    for (const key of keys) {
      if (e.includes(key)) {
        showViewDesc(view, key)
        view.show()
        break
      }
    }
  })
  permissionListener.onComplete((e) => {
    view.hide()
  })
}
