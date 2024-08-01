import { defineStore } from 'pinia'
import { getCar, delCar, updateNum, addCar } from '@/service/goods'
import { showToast } from '@/utils/interaction'

export const useCarStore = defineStore(
  'car',
  () => {
    const carList = ref([])
    const carNum = computed(() => {
      return carList.value.reduce((acc, cur) => {
        return Number(acc) + Number(cur.goodsNum)
      }, 0)
    })
    const refreshList = () => {
      return getCar().then((res) => {
        carList.value = res.data
      })
    }
    const changeNum = (id, num) => {
      carList.value.some((item) => {
        if (item.shoppingCartId === id) {
          item.goodsNum = num
          updateNum({ shoppingCartId: id, goodsNum: num })
          return true
        } else {
          return false
        }
      })
    }
    const add = (id, num) => {
      addCar({
        goodsInfoId: id,
        num,
      }).then((res) => {
        if (res.success) {
          showToast('添加购物车成功')
          refreshList()
        }
      })
    }
    const addNum = (id) => {
      carList.value.forEach((item) => {
        if (item.id === id) {
          item.goodsNum++
        }
      })
    }

    return {
      carNum,
      add,
      refreshList,
      carList,
      changeNum,
      addNum,
    }
  },
  {
    persist: false,
  },
)

export type useCarStoreType = ReturnType<typeof useCarStore>
