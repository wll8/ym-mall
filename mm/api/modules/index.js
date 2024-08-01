const order = require('./order/index')
const goods = require('../modules/goods/index')
module.exports = (util) => {
  return {
    ...order(util), // 注入订单模块
    ...goods(util),
  }
}
