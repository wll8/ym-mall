import { uniFileUpload, http } from '@/utils/http'

// 文件上传
export function fileUpload(filePath: string) {
  return uniFileUpload({
    url: '/v1/file/put-file',
    filePath,
    name: 'file',
  })
}

// 获取版本
export const curVer = () => {
  return http({
    url: `/v1/versionUpgrade`,
    method: 'GET',
  })
}
