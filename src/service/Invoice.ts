import { http } from '@/utils/http'

// 新增发票抬头
export function addInvoiceTitle(data) {
  return http({
    url: '/invoice/invoiceheader/save',
    method: 'POST',
    data,
  })
}
// 查询发票抬头
export function getInvoiceTitle(data) {
  return http({
    url: '/invoice/invoiceheader/detail',
    method: 'GET',
    data,
  })
}
// 修改发票抬头
export function updateInvoiceTitle(data) {
  return http({
    url: '/invoice/invoiceheader/update',
    method: 'POST',
    data,
  })
}
