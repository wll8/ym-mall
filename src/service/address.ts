import { http, uniFileUpload } from '@/utils/http'

/** 获取地址列表 */
export const getAddressList = (data) => {
  return http({
    url: `/v1/address/list`,
    method: 'POST',
    data,
  })
}

/** 修改默认地址 */
export const changeDefaultAddress = (data) => {
  return http({
    url: `/v1/address/defaultSet`,
    method: 'GET',
    data,
  })
}

/** 查询地址详情 */
export const getAddressdata = (data) => {
  return http({
    url: `/v1/userAddress-detailById`,
    method: 'GET',
    data,
  })
}
/** 修改用户收货地址 */
export const updateAddress = (data) => {
  return http({
    url: `/v1/userAddress-update`,
    method: 'POST',
    data,
  })
}

/** 删除地址 */
export const deleteAddressdata = (data) => {
  return http({
    url: `/v1/address/removeById`,
    method: 'GET',
    data,
  })
}

/** 新增地址 */
export const addAddress = (data) => {
  return http({
    url: `/v1/userAddress-save`,
    method: 'POST',
    data,
  })
}
/** 获取省市区列表 */
export const getPickerList = () => {
  return http({
    url: `/blade-system/region/tree`,
    method: 'GET',
  })
}
