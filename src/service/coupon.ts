import { http } from '@/utils/http'

/** 首页优惠券 */
export const indexList = () => {
  return http({
    url: `/coupon/coupon/getIndexlist`,
    method: 'GET',
  })
}

/** 首页优惠券领取 */
export const receive = (key) => {
  return http({
    url: `/coupon/couponreceive/receive`,
    method: 'POST',
    data: {
      key,
    },
  })
}

// 获取优惠卷列表
export function getCouponsList(queryInfo: any) {
  return http({
    url: `/coupon/couponreceive/list`,
    method: 'GET',
    data: queryInfo,
  })
}

// 查询可用优惠券
export function getAvailableCoupon(queryInfo: any) {
  return http({
    url: `/coupon/couponreceive/getAvailableCoupon`,
    method: 'GET',
    data: queryInfo,
  })
}

// 通过商品id查询优惠券
export function getCouponByProductId(queryInfo: any) {
  return http({
    url: `/coupon/couponbusi/list`,
    method: 'GET',
    data: queryInfo,
  })
}
