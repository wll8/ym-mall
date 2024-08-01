const { queryInfosById, injectUtilForClass, responseModal } = require('../utils/utils')
const SuperController = require('../utils/super.controller')
const { stringToNumber, paginate } = require('../../../util')
const dbService = require('../utils/db.service')

class GoodsController extends SuperController {
  // 商品添加
  async create(req, res) {
    const goods = await dbService.getDataByKey('goods')
    if (res.body.id) {
      const index = goods.findIndex((item) => String(item.id) === res.body.id)
      const goodsInfo = goods[index]
      goods[index] = {
        ...goodsInfo,
        ...req.body,
      }
    } else {
      goods.push({
        id: this.mockjs.mock('@uuid'),
        ...req.body,
        salePrice: this.mockjs.mock(`@integer(1, 100)`),
        auditStatus: 0,
        isHot: 0,
      })
    }

    await dbService.save()
    res.json(responseModal({ msg: '操作成功' }))
  }

  // 商品删除
  async remove(req, res, next) {
    const { id } = req.query
    if (id) {
      const goods = await dbService.getDataByKey('goods')
      const index = goods.findIndex((item) => {
        return String(item.id) === id
      })
      if (index !== -1) {
        goods.splice(index, 1)
        dbService.save()
        res.json(responseModal({ msg: '操作成功' }))
        return
      }
    }
    res.json(responseModal({ code: 1126, msg: '操作失败' }))
  }

  // 供应商商品列表
  async supplierList(req, res, next) {
    const { status } = req.query
    if (req.query.query !== undefined) {
      delete req.query.status
    }
    switch (status) {
      case '2':
        req.query.auditStatus = '0'
        break
      case '3':
        req.query.auditStatus = '1'
        break
      case '4':
        req.query.auditStatus = '2'
        break
      case '0':
        req.query.isSale = '1'
        break
      case '1':
        req.query.isSale = '0'
        break
    }
    req.url = '/goods'
    next()
  }

  // 上架下架
  async onOrDownShelves(req, res, next) {
    const { id } = req.query
    const goods = await dbService.getDataByKey('goods')
    const goodsInfos = queryInfosById(id, goods)
    if (goodsInfos) {
      goodsInfos.isSale = goodsInfos.isSale === 1 ? 0 : 1
      dbService.save()
      res.json(responseModal({ msg: '操作成功' }))
    } else {
      res.json(responseModal({ code: 1201, msg: '商品不存在' }))
    }
  }
}

module.exports = injectUtilForClass(GoodsController)
