const { queryInfosById, injectUtilForClass, responseModal } = require('../utils/utils')
const SuperController = require('../utils/super.controller')
const { stringToNumber, paginate } = require('../../../util')
const dbService = require('../utils/db.service')

class OrderController extends SuperController {
  // 创建订单
  async create(req, res) {
    const { goodsInfos, isCat, couponUserId, userAddressId } = req.body
    const mockjs = this.mockjs

    if (goodsInfos && goodsInfos.length) {
      const db = await globalThis.config._db
      const data = db.getState()
      // 地址信息
      const addressInfos = data.address || []
      const addressInfo = queryInfosById(userAddressId, addressInfos)
      // 订单信息
      const order = data.order || []
      // 暂存订单信息
      const cacheOrder = []
      // 订单关联订单编号数组
      const orderOrderNos = data.orderOrderNo || []
      // 商品信息
      const goods = data.goods || []
      for (const info of goodsInfos) {
        const { goodsId: id, num } = info
        const goodsInfo = queryInfosById(id, goods)
        if (goodsInfo) {
          const couponPrice = await this.getCouponPrice(couponUserId)
          // 得到优惠券，修改优惠券使用状态，对优惠券价格进行平摊
          // 订单id
          const orderId = mockjs.mock(`@uuid`)
          const orderNo = mockjs.mock(`@uuid`)
          const orderDetail = this.createOrderDetail(addressInfo)
          const orderGrouponGoods = this.createOrderGrouponGoods(goodsInfo, num, orderId)
          // 处理关联的订单编号与订单id
          this.saveOrderNoLikeOrder(orderId, orderNo, orderOrderNos)
          const orderInfo = {
            id: orderId,
            consignee: addressInfo.realName,
            consigneePhoneNumber: addressInfo.phone,
            driverState: 1,
            orderDetail,
            orderGrouponGoods,
            orderNo,
            orderState: 1,
            paymentAmount: goodsInfo.salePrice * num - couponPrice,
            paymentState: 1,
            remainingTime: 1000 * 60 * 20,
            supState: 1,
            isCart: isCat,
            discountAmount: couponPrice / goodsInfos.length,
            createTime: mockjs.mock(`@now`),
          }

          // 添加订单
          cacheOrder.push(orderInfo)
        }
      }
      // 加入订单
      order.push(...cacheOrder)
      if (cacheOrder.length === 1) {
        db.write() // 存入数据库
        res.json(
          responseModal({
            data: { orderNo: cacheOrder[0].orderNo },
            msg: '操作成功！',
          }),
        )
        return undefined
      } else {
        const orderNo = mockjs.mock(`@uuid`)
        // 关联订单编号
        for (const orderInfo of cacheOrder) {
          this.saveOrderNoLikeOrder(orderInfo.id, orderNo, orderOrderNos)
        }
        db.write()
        res.json(
          responseModal({
            data: {
              orderNo,
            },
            msg: '操作成功！',
          }),
        )
        return undefined
      }
    }
  }

  // 订单列表
  async list(req, _, next) {
    req.url = '/order'
    if (!req.query.orderState) {
      delete req.query.orderState // 删除订单状态
    }
    await next()
  }

  // 订单详情
  async detail(req, _, next) {
    req.url = `/order/${req.query.id}`
    next()
  }

  // 订单取消
  async remove(req, res) {
    const { orderId } = req.query
    if (orderId) {
      const orderInfos = await dbService.getDataByKey('order')
      const index = orderInfos.findIndex((item) => {
        return item.id === stringToNumber(orderId)
      })
      if (index !== -1) {
        orderInfos.splice(index, 1)
        dbService.save()
        res.json(responseModal({ msg: '操作成功' }))
      } else {
        res.json(responseModal({ code: 1121, msg: '订单不存在' }))
      }
    } else {
      res.json(responseModal({ code: 1124, msg: '未传入订单id' }))
    }
  }

  // 供应商商品列表查询
  async supOrderList(req, res) {
    // 分页， 订单编号或订单名称查询，状态：已支付
    const { _page: page, _limit: size, supState, goodsName } = req.query
    const order = await dbService.getDataByKey('order')
    const filterByKeyValue = {
      paymentState: 2,
    }

    if (supState !== '0' && supState) {
      filterByKeyValue.supState = supState
    }
    const list = dbService.filterData(
      {
        filterByKeyValue,
        like: {
          orderNo: goodsName,
        },
      },
      order,
    )
    const infos = list.map((item) => this.mapSupOrderData(item))
    const limit = paginate(
      infos, // 映射数据
      Number(page),
      Number(size),
    )
    res.json(
      responseModal({
        msg: '操作成功',
        data: {
          total: list.length,
          records: limit,
        },
      }),
    )
  }

  // 供应商订单统计
  async supOrderCount(req, res) {
    // 分页， 订单编号或订单名称查询，状态：已支付

    const order = await dbService.getDataByKey('order')
    const supState0List = dbService.filterData(
      {
        filterByKeyValue: {
          paymentState: 2,
        },
      },
      order,
    )
    const supState1List = dbService.filterData(
      {
        filterByKeyValue: {
          supState: 1,
        },
      },
      supState0List,
    )
    const supState2List = dbService.filterData(
      {
        filterByKeyValue: {
          supState: 2,
        },
      },
      supState0List,
    )

    const supState3List = dbService.filterData(
      {
        filterByKeyValue: {
          supState: 3,
        },
      },
      supState0List,
    )

    res.json(
      responseModal({
        msg: '操作成功！',
        data: [
          {
            supState: '0',
            num: supState0List.length,
          },
          {
            supState: '1',
            num: supState1List.length,
          },
          {
            supState: '2',
            num: supState2List.length,
          },
          {
            supState: '3',
            num: supState3List.length,
          },
        ],
      }),
    )
  }

  // 供应商发货
  async seedOffOut(res, req, next) {
    const { orderId, supState } = res.body
    const order = dbService.getDataByKey('order')
    const orderInfo = queryInfosById(orderId, order)
    if (orderInfo) {
      orderInfo.supState = stringToNumber(supState)
      dbService.save()
      res.json(responseModal({ msg: '操作成功' }))
    } else {
      res.json(responseModal({ code: 1121, msg: '订单不存在' }))
    }
  }

  // 订单付款
  async pay(req, res) {
    const { orderNo } = req.query
    // 查询订单数组，修改状态
    const db = await globalThis.config._db
    const data = db.getState()
    const orderOrderNos = data.orderOrderNo || []
    const idInfos = orderOrderNos.filter((item) => item.orderNo === orderNo)
    if (idInfos && idInfos.length) {
      const orderInfos = db.getState().order || []
      for (const idInfo of idInfos) {
        const { orderId } = idInfo
        const orderInfo = queryInfosById(orderId, orderInfos)
        if (orderInfo) {
          orderInfo.orderState = 3
          orderInfo.paymentState = 2
          orderInfo.paymentTime = this.mockjs.mock('@now')
          orderInfo.remainingTime = 0
          orderInfo.paymentMode = req.paymentMode
        }
      }
      db.write()
      res.json(responseModal({ msg: '操作成功！' }))
    } else {
      res.json(responseModal({ code: 1121, msg: '订单不存在' }))
    }
  }

  // 确认收货
  async confirmReceipt(req, res) {
    const { orderId } = req.body
    const db = await globalThis.config._db
    const data = db.getState()
    if (orderId) {
      const orderInfos = data.order || []
      const orderInfo = queryInfosById(orderId, orderInfos)
      if (orderInfo) {
        if (stringToNumber(orderInfo.driverState) === 3) {
          orderInfo.orderState = 4
          orderInfo.confirmTime = this.mockjs.mock('@now')
          db.write()
          res.json(responseModal({ msg: '操作成功！' }))
        } else {
          res.json(responseModal({ code: 1123, msg: '司机未完成配送，不能确认收货' }))
        }
      } else {
        res.json(responseModal({ code: 1123, msg: '订单不存在' }))
      }
    }
  }

  // 获取司机订单列表
  async getDiverOrderList(req, res, next) {
    const { driverState, goodsName } = req.body
    const { _page: page, _limit: size } = req.query
    const order = await dbService.getDataByKey('order')
    const list = dbService.filterData(
      {
        filterByKeyValue: {
          driverState,
        },
        like: {
          orderNo: goodsName,
        },
      },
      order,
    )
    // 映射数据
    const infos = list.map((item) => this.mapDriverOrderData(item))
    const limit = paginate(infos, Number(page), Number(size))
    res.json(
      responseModal({
        msg: '操作成功',
        data: {
          total: list.length,
          records: limit,
        },
      }),
    )
  }

  // 司机端发货
  async driverSend(req, res, next) {
    const { ids, supState, files } = req.body
    const order = await dbService.getDataByKey('order')
    for (const id of ids) {
      const item = queryInfosById(id, order)
      if (item) {
        const userInfo = await dbService.getUserInfo(req.userId)
        item.driverName = userInfo.nick_name
        if (String(supState) === '2') {
          item.driverState = stringToNumber(supState)
        } else if (String(supState) === '3') {
          item.driverState = stringToNumber(supState)
          // 司机配送图片
          item.fileUrl = files
        }
      }
    }
    await dbService.save()
    res.json(
      responseModal({
        msg: '操作成功',
      }),
    )
  }

  // 获取优惠券价格
  async getCouponPrice(id) {
    if (id) {
      const db = await globalThis.config._db
      const data = db.getState()
      const couponInfos = data.coupon || []
      const couponInfo = queryInfosById(id, couponInfos)
      if (couponInfo) {
        couponInfo.useStatus = 1
        db.write()
        return stringToNumber(couponInfo.val)
      }
    }
    return 0
  }

  // 创建地址信息
  createOrderDetail(addressInfo) {
    const [province, city, district] = addressInfo.addressAllName.split(' ')
    return {
      id: addressInfo.id,
      address: addressInfo.detail,
      city,
      district,
      province,
    }
  }

  // 创建商品信息数组
  createOrderGrouponGoods(goodsInfo, num, orderId) {
    return [
      {
        id: goodsInfo.id,
        costPrice: goodsInfo.costPrice,
        goodsId: goodsInfo.id,
        goodsImage: goodsInfo.goodsCover,
        goodsName: goodsInfo.goodsName,
        goodsNo: goodsInfo.goodsNo,
        goodsNum: num,
        goodsPrice: goodsInfo.salePrice,
        goodsSpec: goodsInfo.goodsSpec,
        orderId,
      },
    ]
  }

  // 关联订单编号与订单id
  saveOrderNoLikeOrder(orderId, orderNo, orderOrderNos) {
    orderOrderNos.push({
      id: this.mockjs.mock('uuid'),
      orderId,
      orderNo,
    })
  }

  // 映射供应商订单列表数据
  mapSupOrderData(orderInfo) {
    const goodsInfo = orderInfo.orderGrouponGoods[0]
    return {
      costPrice: goodsInfo.costPrice,
      goodsId: goodsInfo.goodsId,
      goodsImage: goodsInfo.goodsImage,
      goodsName: goodsInfo.goodsName,
      goodsNum: goodsInfo.goodsNum,
      goodsSpec: goodsInfo.goodsSpec,
      orderCreateTime: orderInfo.createTime,
      orderId: orderInfo.id,
      orderNo: orderInfo.orderNo,
      orderPayTime: orderInfo.payTime,
      supState: orderInfo.supState,
    }
  }

  // 映射司机订单数据
  mapDriverOrderData(orderInfo) {
    const goodsInfo = orderInfo.orderGrouponGoods[0]
    return {
      driverState: orderInfo.driverState,
      goodsId: goodsInfo.goodsId,
      goodsImage: goodsInfo.goodsImage,
      goodsName: goodsInfo.goodsName,
      goodsNum: goodsInfo.goodsNum,
      goodsSpec: goodsInfo.goodsSpec,
      orderId: orderInfo.id,
      orderNo: orderInfo.orderNo,
    }
  }
}

module.exports = injectUtilForClass(OrderController)
