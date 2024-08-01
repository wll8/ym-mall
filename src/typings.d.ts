/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// 全局要用的类型放到这里

type IResData<T = any> = {
  code: number
  msg: string
  data: T
  success?: boolean
}

// uni.uploadFile文件上传参数
type IUniUploadFileOptions = {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

interface tabBarItem {
  iconPath: string
  selectedIconPath: string
  pagePath: string
  text: string
}

type IUserInfo = {
  nickname?: string
  avatar?: string
  /** 微信的 openid，非微信没有这个字段 */
  openid?: string
  /** 用户的 tabbar */
  tabbar?: tabBarItem[]
  /** 用户的 tabbar 的高度 */
  tabbarHeight?: number
  /** 用户首页 */
  indexPage?: string
  phone?: string
  tenantId?: string
  registerState?: string | number // 是否填写邀请码状态
  user_id?: IdType
  role_name?: string
}

enum TestEnum {
  A = 'a',
  B = 'b',
}

declare type Recordable<T = any> = Record<string, T>

// 文件信息
interface FileInfo {
  id: string | number
  path: string
}
// id类型
type IdType = number | string
// 常用配置信息
interface IBaseOption<T = any> {
  label: string
  value?: T
}
