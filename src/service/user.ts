import { http, uniFileUpload } from '@/utils/http'

/** get 请求 */
export const getFooAPI = (name: string) => {
  return http({
    url: `/foo`,
    method: 'GET',
    query: { name },
  })
}

/** 验证码登录 */
export const login = (data) => {
  return http({
    url: `/v1/user/phoneLogin`,
    method: 'POST',
    data,
  })
}

/** 发送验证码 */
export const sendValidate = (data) => {
  return http({
    url: `/v1/common/send-validate`,
    method: 'POST',
    data,
  })
}
/** 获取用户信息 */
export const userInfo = (data: any) => {
  return http({
    url: `/user/index/index`,
    method: 'POST',
    data,
  })
}
/** 注册用户 */
export const enrolluser = (data: any) => {
  return http({
    url: `/v1/register`,
    method: 'POST',
    data,
  })
}
/** 获取用户协议 */
export const getAgreement = (data: any) => {
  return http({
    url: `/getAgreement`,
    method: 'GET',
    data,
  })
}
/** 获取审核结果 */
export const getResultsAudit = (data: any) => {
  return http({
    url: `/getResultsAudit`,
    method: 'GET',
    data,
  })
}

/** 图片上传 */
export const uploadImage = (filePath: any) => {
  return uniFileUpload({
    url: `/file/upload`,
    name: 'file',
    filePath,
  })
}
/** 修改个人信息 */
export const putUserInfo = (data) => {
  console.log(data)
  return http({
    url: `/v1/userInfo/save`,
    method: 'POST',
    data,
  })
}
/** 获取请求头 */
export const getAuthorization = () => {
  return http({
    url: `/v1/getAuthorization`,
    method: 'GET',
  })
}
/** 获取客服电话 */
export const getCustomerPhoneList = () => {
  return http({
    url: `/v1/after-sales/user/serviceTel`,
    method: 'GET',
  })
}
/** 获取客服经理电话 */
export const getCustomerPhone = () => {
  return http({
    url: `/v1/after-sales/user/salesmanTel`,
    method: 'GET',
  })
}
/** 详情 */
export const getDetail = (data) => {
  return http({
    url: `/v1/article/detail`,
    method: 'GET',
    data,
  })
}
/** 供应商 获取 */
export const getSupplierCount = () => {
  return http({
    url: `/v1/goods/supplierCount`,
    method: 'GET',
  })
}
/** 获取供应商订单数量 */
export const getSupOrderNum = () => {
  return http({
    url: `/v1/order/getSupOrderNumGroupBySupStatus`,
    method: 'GET',
  })
}

/** 提交供应商邀请 */
export const submit = (data) => {
  return http({
    url: `/mall/store/save`,
    method: 'POST',
    data,
  })
}
/** 账号注销 */
export const logOut = () => {
  return http({
    url: `/v1/logOut`,
    method: 'POST',
  })
}
/** 退出登录 */
export const oauthLogout = () => {
  return http({
    url: `/blade-auth/oauth/logout`,
    method: 'GET',
  })
}
/** 获取验证码 */
export const getInviteCode = () => {
  return http({
    url: `/invite/invite/save`,
    method: 'POST',
  })
}
/** 获取用户信息 */
export const getUserInfo = () => {
  return http({
    url: `/v1/userInfo/get`,
    method: 'GET',
  })
}
/** 供应商 库存不足 获取 */
export const getNotEnoughStore = () => {
  return http({
    url: `/mall/store/notEnoughStore`,
    method: 'GET',
  })
}
