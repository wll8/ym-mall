import { http, uniFileUpload } from '@/utils/http'

export const get = () => {
  return http({
    url: `/blade-desk/notice/list`,
    method: 'GET',
    query: {
      category: 1,
    },
  })
}

export const getById = (id) => {
  return http({
    url: `/blade-desk/notice/detail`,
    method: 'GET',
    query: {
      id,
    },
  })
}
