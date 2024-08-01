const createOrderController = require('./order.controller')
// 订单模块
module.exports = (util) => {
  const orderController = createOrderController(util)
  return {
    // 添加订单
    async 'post /v1/order/submit'(...args) {
      await orderController.create(...args)
    },
    // 查询订单列表
    async 'get /v1/order/getOrderPage'(...args) {
      await orderController.list(...args)
    },

    // 订单详情
    async 'get /v1/order/getOrderDetail'(...args) {
      await orderController.detail(...args)
    },
    // 删除订单
    async '/v1/order/cancel'(...args) {
      await orderController.remove(...args)
    },

    // 供应商商品列表
    async '/v1/order/getSupOrder'(...args) {
      await orderController.supOrderList(...args)
    },
    // 获取供应商订单统计
    async '/v1/order/getSupOrderNumGroupBySupStatus'(...args) {
      await orderController.supOrderCount(...args)
    },

    // 供应商发货
    async 'post /v1/order/supUpdateOrderStatus'(...args) {
      await orderController.supOrderCount(...args)
    },

    // 司机端-获取订单列表
    async 'post /v1/order/getDriverOrder'(...args) {
      await orderController.getDiverOrderList(...args)
    },

    // 司机端-发货
    async 'post /v1/order/driverSend'(...args) {
      await orderController.driverSend(...args)
    },

    // 订单支付,微信支付
    async 'post /v1/wxPay/appPay'(...args) {
      args[0].paymentMode = '微信支付'
      await orderController.pay(...args)
    },
    // 订单支付,微信购物车支付
    async 'post /v1/wxPay/appPay/cart'(...args) {
      args[0].paymentMode = '微信支付'
      await orderController.pay(...args)
    },
    // 订单支付,支付宝支付
    async 'post /v1/alipay/initiate'(...args) {
      args[0].paymentMode = '支付宝支付'
      await orderController.pay(...args)
    },
    // 订单支付,支付宝购物车支付
    async 'post /v1/alipay/cart/initiate'(...args) {
      args[0].paymentMode = '支付宝支付'
      await orderController.pay(...args)
    },
    // 确认收货
    async 'post /v1/order/custmorConfirm'(...args) {
      await orderController.confirmReceipt(...args)
    },
  }
}
