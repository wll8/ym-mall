export interface IPayGoods {
  goodsId: IdType
  num: number // 购买数量
}

export interface IPayInfo {
  goodsInfos: IPayGoods[]
  // 用户优惠卷id
  couponUserId?: IdType
  distributeMode?: 1 | 2 //	配送方式;1-快递 2-自取
  goodsInfoId?: IdType // 商品ID
  goodsNum?: number // 商品列表
  goodsSpecId?: IdType // 商品规格ID
  grouponId?: IdType // 团购ID
  isCat: 0 | 1 // 是否来自购物车，0不是，1是
  orderSource: 1 | 2 // 1 - 小程序，2 - app
  orderType: 1 | 2 // 订单类型 1-拼团订单，2-亿米订单
  remark?: string
  selfTakeId?: IdType // 自提点ID
  shoppingCartId?: IdType // 购物车ID
  trademarkId?: IdType // 商标ID
  userAddressId?: IdType // 地址ID
  wlPrice?: number // 运费
}
