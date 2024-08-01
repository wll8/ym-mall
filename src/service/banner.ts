import { http, uniFileUpload } from '@/utils/http'

export const get = () => {
  return http({
    url: `/v1/ads-list?type=2`,
    method: 'GET',
  })
}
