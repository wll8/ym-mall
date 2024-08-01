import { http } from '@/utils/http'
import { IPayInfo } from './type'

// 获取订单列表
export function getOrderList(queryInfo) {
  return http({
    url: `/v1/order/getOrderPage`,
    method: 'GET',
    data: queryInfo,
  })
}

// 获取订单详情
export function getOrderDetail(id: number | string) {
  return http({
    url: `/v1/order/getOrderDetail`,
    method: 'GET',
    data: { id },
  })
}

// 获取退货信息
export function getReturnInfo(id: number | string) {
  return http({
    url: `/order/orderaftersales/detail`,
    method: 'GET',
    data: { orderId: id },
  })
}
// 添加地址
export function newAddress(info: any) {
  return http({
    url: '/platform/useraddress/save',
    method: 'POST',
    data: info,
  })
}

// 获取默认地址列表
export function getDefaultAddress(userId: IdType) {
  return http({
    url: '/v1/userAddress-detailByUserId',
    data: {
      userId,
    },
  })
}

// 添加订单
export function addOrder(postInfo: IPayInfo) {
  return http({
    url: '/v1/order/submit',
    method: 'POST',
    data: postInfo,
  })
}

// 删除订单
export function cancelOrder(id: IdType) {
  return http({
    url: `/v1/order/cancel?orderId=${id}`,
    method: 'POST',
  })
}

/**
 * 微信支付
 */

// 根据订单编号生成支付信息
export function getWPayInfo(orderNo: number | string) {
  return http({
    url: `/v1/wxPay/appPay`,
    method: 'POST',
    query: {
      orderNo,
    },
  })
}
// 生成购物车支付信息
export function getCarWPayInfo(orderNo: number | string) {
  return http({
    url: `/v1/wxPay/appPay/cart`,
    method: 'POST',
    query: {
      orderNo,
    },
  })
}

/**
 * 支付宝支付
 */
// 非购物车支付
export function getAPayInfo(orderNo: number | string) {
  return http({
    url: `/v1/alipay/initiate`,
    method: 'POST',
    query: {
      orderNo,
    },
  })
}
// 购物车支付
export function getCarAPayInfo(orderNo: number | string) {
  return http({
    url: `/v1/alipay/cart/initiate`,
    method: 'POST',
    query: {
      orderNo,
    },
  })
}

// 调用uniapp支付方法
// 订单支付
export function payment(payType: number, orderInfo) {
  return new Promise<any>((resolve, reject) => {
    uni.requestPayment({
      provider: payType === 1 ? 'alipay' : 'wxpay', // wxpay微信 alipay支付宝
      orderInfo, // 订单数据 后台返回的数据
      success: function (res) {
        resolve(res)
      },
      // 参数有问题则抛出错误
      fail: function (err) {
        reject(err)
      },
    })
  })
}

// 更改订单状态
export function modifyOrderState(orderId: IdType, supState: IdType) {
  return http({
    url: `/v1/order/supUpdateOrderStatus`,
    method: 'POST',
    data: {
      orderId,
      supState,
    },
  })
}

// 更改订单地址
export function modifyOrderAddress(orderId: IdType, addressId: IdType) {
  return http({
    url: `/v1/order/updateOrderAddress`,
    method: 'POST',
    query: {
      orderId,
      addressId,
    },
  })
}

// 确认收货
export function sureReceipt(orderId: IdType) {
  return http({
    url: '/v1/order/custmorConfirm',
    method: 'POST',
    data: {
      orderId,
      supState: '4',
    },
  })
}
/*
 * 供应商
 */

// 获取供应商订单列表
export function getSupplierOrderList(queryInfo) {
  return http({
    url: `/v1/order/getSupOrder`,
    method: 'GET',
    data: queryInfo,
  })
}

// 获取订单列表统计
// 获取供应商端tab数据统计
export function getOrderCount() {
  return http({
    url: '/v1/order/getSupOrderNumGroupBySupStatus',
    method: 'GET',
  })
}

/**
 * 司机端
 */

// 获取司机订单列表
export function getDriverOrderList(queryInfo: any) {
  const { driverState, goodsName, current, size, startTime, endTime } = queryInfo
  return http({
    url: '/v1/order/getDriverOrder',
    method: 'GET',
    data: queryInfo,
  })
}
// 获取司机订单数量
export function getDriverOrderNumber() {
  return http({
    url: '/v1/order/getDriverOrderNumGroupByDriverStatus',
    method: 'GET',
  })
}

/**
 * 司机发送
 */
export function driverSend(ids: IdType[], files?: string[], supState = '2') {
  return http({
    url: '/v1/order/driverSend',
    method: 'POST',
    data: {
      ids,
      supState,
      files,
    },
  })
}
/** 业务员查询供应商订单 */
export function getOrderByuserId(queryInfo) {
  return http({
    url: `/v1/order/getPlatSupOrder`,
    method: 'GET',
    data: queryInfo,
  })
}
// 提交投诉申请
export function handleOrdercomplain(queryInfo) {
  return http({
    url: `/ordercomplain/save`,
    method: 'POST',
    data: queryInfo,
  })
}
/** 获取投诉信息 */
export const getOrdercomplain = (queryInfo) => {
  return http({
    url: `/ordercomplain/list`,
    method: 'GET',
    data: queryInfo,
  })
}
/** 处理投诉订单 */
export const handlecomplain = (queryInfo) => {
  return http({
    url: `/ordercomplain/update`,
    method: 'POST',
    data: queryInfo,
  })
}

// 用户退货申请
export const userOrderReturn = (postInfo) => {
  return http({
    url: `/order/orderaftersales/save`,
    method: 'POST',
    data: postInfo,
  })
}

// 业务员退货采购员审批
export const orderReturnApproval = (postInfo) => {
  return http({
    url: `/order/orderaftersales/update`,
    method: 'POST',
    data: postInfo,
  })
}

// 查询全部订单
export const getAllOrder = (queryInfo) => {
  return http({
    url: `/v1/order/getAllOrder`,
    method: 'GET',
    data: queryInfo,
  })
}
// 查询订单状态统计
export const getOrderStateCount = (queryInfo) => {
  return http({
    url: `/v1/order/getOrderCountBuyStatus`,
    method: 'GET',
    data: queryInfo,
  })
}
// 查询全部订单统计
export const getAllOrderCount = (queryInfo) => {
  return http({
    url: `/v1/order/getAllOrderCount`,
    method: 'GET',
    data: queryInfo,
  })
}

// 申请发票
export const RequestAnInvoice = (postInfo) => {
  return http({
    url: `/v1/order/isHeader`,
    method: 'POST',
    data: postInfo,
  })
}

// 取消退货申请
export const cancelOrderReturn = (orderId) => {
  return http({
    url: `/order/orderaftersales/deleteOrderAfterSalesPage`,
    method: 'GET',
    data: {
      orderId,
    },
  })
}
