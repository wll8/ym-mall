import { defineStore } from 'pinia'
import useAddressStore from '../address'
import useOrderStore from '../order'
interface IGoodsState {
  // 购买信息
  purchaseInformation: {
    goodsId?: IdType
    num: number
  }
}

// 初始化购买信息
const purchaseInformation: IGoodsState['purchaseInformation'] = {
  num: 1,
}

const useGoodsStore = defineStore('Goods', {
  state: (): IGoodsState => ({
    purchaseInformation,
  }),
  actions: {
    // 进入详情重置购买信息
    resetPurchaseInformationAction(id: IdType) {
      this.purchaseInformation = {
        goodsId: id,
        num: 1,
      }
      // 加载默认地址信息
      useAddressStore().loadDefaultAddressInfo()
      // 重置订单信息
      useOrderStore().resetState()
    },
  },
})

export default useGoodsStore
