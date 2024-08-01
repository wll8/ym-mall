import { http } from '@/utils/http'

// 获取数据字典
export function queryDictListByCode(code: string) {
  return http({
    url: '/blade-system/dict-biz/dictionary',
    method: 'GET',
    query: {
      code,
    },
  })
}
