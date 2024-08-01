import { http, uniFileUpload } from '@/utils/http'

// 获取热卖商品
export const getHot = () => {
  return http({
    url: `/goods`,
    method: 'GET',
    query: {
      商品类型: `热卖`,
    },
  })
}

// 商品分类
export const getType = (data) => {
  return http({
    url: `/type`,
    method: 'GET',
    data,
  })
}

// 获取商品分类
export const getCategory = (parentId) => {
  return http({
    url: `/v1/category/list`,
    method: 'GET',
    query: {
      parentId,
    },
  })
}

// 购物车
export const getCar = (data = {}) => {
  return http({
    url: `/v1/cart/list`,
    method: 'POST',
    data,
  })
}
// 商家购物车
export const listByUserId = (data = {}) => {
  return http({
    url: `/v1/cart/listByUserId`,
    method: 'POST',
    data,
  })
}

// 加入购物车
export function addCar(postInfo: any) {
  return http({
    url: `/v1/cart/add`,
    method: 'POST',
    data: postInfo,
  })
}

// 删除购物车商品
export const delCar = (ids = []) => {
  return http({
    url: `/v1/cart/remove`,
    method: 'POST',
    data: {
      shoppingCartIds: ids,
    },
  })
}

export function getGoodsDetail(id: number | string) {
  return http({
    url: `/mall/goodsinfo/detail`,
    method: 'GET',
    data: { id },
  })
}

// 查询商品列表
export function getGoods(queryInfo) {
  return http({
    url: `/v1/goods/page`,
    method: 'GET',
    data: {
      current: 1,
      size: 20,
      ...queryInfo,
    },
  })
}

// 获取首页活动目录
export function getDir() {
  return http({
    url: `/v1/goods/list`,
    method: 'GET',
  })
}

// 获取供应商端商品列表
export function getSupplierGoodsList(query: any) {
  return http({
    url: `/v1/goods/supplierPage`,
    method: 'GET',
    data: query,
  })
}

// 获取商品分类树
export function getCategoryInfoTree() {
  return http({
    url: `/v1/category/listTree`,
    method: 'GET',
  })
}

// 供应商商品添加, 编辑
export function newGoods(payload: any) {
  return http({
    url: '/v1/goods/saveOrUpdateGoods',
    method: 'POST',
    data: payload,
  })
}

// 删除供应商商品

export function deleteGoods(id: IdType) {
  return http({
    url: '/v1/goods/deleteById',
    method: 'POST',
    query: {
      id,
    },
  })
}

// 修改购物车数量
export function updateNum(data) {
  return http({
    url: '/v1/cart/updateNum',
    method: 'POST',
    data,
    query: data,
  })
}

// 商品上下架
export function goodsOnOrDownShelves(id: IdType) {
  return http({
    url: '/v1/goods/upOrDownById',
    method: 'POST',
    query: {
      id,
    },
  })
}

/** 采购员，操作接口 **/
// 采购员端获取商品列表通过供应商
export function getGoodsListBySupplier(queryInfo: any) {
  return http({
    url: `/mall/goodsinfo/page`,
    method: 'GET',
    data: queryInfo,
  })
}

// 商品新增, 为供应商
export function addGoodsForSupplier(goodsInfo: any) {
  return http({
    url: `/mall/goodsinfo/submit`,
    method: 'POST',
    data: goodsInfo,
  })
}
// 商品编辑, 为供应商
export function updateGoodsForSupplier(goodsInfo: any) {
  return http({
    url: `/mall/goodsinfo/update`,
    method: 'POST',
    data: goodsInfo,
  })
}

export interface AuditInfo {
  id: number | string
  auditStatus: number | string // 1. 通过，2. 未通过
  remark?: string
}
// 商品审核, 为供应商
export function auditGoodForSupplier(data: AuditInfo) {
  return http({
    url: `/mall/goodsinfo/audit`,
    method: 'POST',
    query: data,
  })
}

export interface PublishInfo {
  ids: string
  state: number | string
}
// 商品上下架下架, 为供应商
export function whetherPublish(data: PublishInfo) {
  return http({
    url: `/mall/goodsinfo/modifyState`,
    method: 'POST',
    query: data,
  })
}
// 获取供应商信息
export function getSupplerInfoById(id: number | string) {
  return http({
    url: `/mall/store/detail`,
    method: 'GET',
    query: {
      id,
    },
  })
}
// 获取单位
export function fetchUnitList() {
  return http({
    url: `/mall/unit/all-list`,
    method: 'GET',
  })
}

// 采购员删除商品
export function deleteGoodsForSupplier(id: number | string) {
  return http({
    url: `/mall/goodsinfo/remove?ids=${id}`,
    method: 'POST',
    query: {
      id,
    },
  })
}

export interface InventoryInfo {
  ids: string
  stock: number | string
}
// 采购员删除商品
export function changeInventory(data: InventoryInfo) {
  return http({
    url: `/mall/goodsinfo/setStock`,
    method: 'POST',
    query: data,
  })
}
