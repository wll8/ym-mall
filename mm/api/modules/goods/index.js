const createGoodsController = require('./goods.controller')
// 商品模块
module.exports = (util) => {
  const goodsController = createGoodsController(util)
  return {
    // 供应商商品编辑
    async 'post /v1/goods/saveOrUpdateGoods'(...args) {
      goodsController.create(...args)
    },
    // 供应商商品删除
    async 'post /v1/goods/deleteById'(...args) {
      goodsController.remove(...args)
    },

    // 商品上下架
    async 'post /v1/goods/upOrDownById'(...args) {
      goodsController.onOrDownShelves(...args)
    },
    // 获取供应商端商品列表
    async '/v1/goods/supplierPage'(...args) {
      goodsController.supplierList(...args)
    },
  }
}
