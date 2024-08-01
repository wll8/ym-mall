import { http } from '@/utils/http'

// 获取我的商家
export function getBusinesses(queryInfo: any) {
  return http({
    url: `/invite/invite/myInviteUserList`,
    method: 'GET',
    data: queryInfo,
  })
}

export function getVendorList(queryInfo: any) {
  return http({
    url: `/mall/store/list`,
    method: 'GET',
    data: queryInfo,
  })
}

// 请求参数类型定义
export interface IUpdateRegisterStateInfo {
  id: IdType
  registerState: number
  registerResult?: string
}
// 修改供应商申请状态
export function updateRegisterState(postInfo: IUpdateRegisterStateInfo) {
  return http({
    url: `/blade-user/updateRegisterState`,
    method: 'POST',
    data: postInfo,
  })
}

// 获取商品浏览器数量
export function getGoodsBrowseInfos(queryInfo: any) {
  return http({
    url: `/platform/userbrowse/list`,
    method: 'GET',
    data: queryInfo,
  })
}
