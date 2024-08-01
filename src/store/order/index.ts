import type { IPayInfo, IPayGoods } from '@/service/order/type'
import { defineStore } from 'pinia'
import { ORDER_COUPON, ORDER_GOODS_INFOS, ORDER_PAY_INFO } from './constants'

interface IOrderState {
  payInfo: IPayInfo
  goodsInfos: any[]
  currentCoupon: any
}

const useOrderStore = defineStore('Order', {
  state: (): IOrderState => ({
    // 确认订单页面使用生成订单数据
    payInfo: {
      goodsInfos: [],
      isCat: 0,
      orderSource: 2,
      orderType: 2,
    },
    // 商品列表信息
    goodsInfos: [],
    // 当前优惠券信息
    currentCoupon: {},
  }),
  actions: {
    // 重置信息
    resetState() {
      this.payInfo = {
        goodsInfos: [],
        isCat: 0,
        orderSource: 2,
        orderType: 2,
      }
      this.goodsInfos = []
      // 重置优惠券信息
      this.resetCurrentCoupon()
      this.saveStateDataAction()
    },
    // 改变订单信息
    changeGoodsInfosAction(infos: any) {
      this.goodsInfos = infos
      this.saveStateDataAction()
    },
    // 改变payInfo的goodsInfos
    changePayInfoGoodsInfos(infos: IPayGoods[], isCat: 1 | 0 = 0) {
      this.payInfo.goodsInfos = infos
      this.payInfo.isCat = isCat
      this.saveStateDataAction()
    },
    // 改变支付信息
    changePayInfoAction(info: IPayInfo) {
      this.payInfo = info
    },
    // 改变当前使用的优惠券
    changeCurrentCouponAction(coupon: any) {
      this.payInfo.couponUserId = coupon.id
      this.currentCoupon = coupon
      this.saveStateDataAction()
    },
    // 重置优惠券信息
    resetCurrentCoupon() {
      this.currentCoupon = {}
    },
    // 改变地址id
    changePayAddressIdAction(id: IdType) {
      this.payInfo.userAddressId = id
    },
    // 改变payInfo的id
    changePayInfoOfIdByIdName(key: keyof IPayInfo, id: IdType) {
      this.payInfo[key] = id
    },
    // 加载购物车过来数据
    loadCarListData(list: any) {
      // 重置优惠券信息
      this.resetCurrentCoupon()
      if (list && list.length) {
        // 获取购买商品infos
        const goodsInfos = list.map((item) => {
          return {
            goodsId: item.goodsId,
            num: item.goodsNum,
          }
        })
        // 获取购物车ids
        this.payInfo.isCat = 1
        this.payInfo.goodsInfos = goodsInfos
        this.goodsInfos = list.map((item) => {
          return {
            goodsCover: item.cover,
            id: item.goodsId,
            goodsName: item.goodsName,
            goodsSpec: item.goodsSpec,
            salePrice: item.salePrice,
            shoppingCartId: item.shoppingCartId,
          }
        })
        this.saveStateDataAction()
      }
    },
    // 存储state数据
    saveStateDataAction() {
      uni.setStorageSync(ORDER_PAY_INFO, this.payInfo)
      uni.setStorageSync(ORDER_GOODS_INFOS, this.goodsInfos)
      uni.setStorageSync(ORDER_COUPON, this.currentCoupon)
    },

    // 加载订单数据
    loadLocalDataAction() {
      const payInfo = uni.getStorageSync(ORDER_PAY_INFO)
      if (payInfo) {
        this.payInfo = payInfo
      }
      const goodsInfos = uni.getStorageSync(ORDER_GOODS_INFOS)
      if (goodsInfos) {
        this.goodsInfos = goodsInfos
      }
      const currentCoupon = uni.getStorageSync(ORDER_COUPON)
      if (currentCoupon) {
        this.currentCoupon = currentCoupon
      }
    },
  },
})

export default useOrderStore
