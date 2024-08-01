export function mapImgs(list: string[] | undefined) {
  if (!list) {
    return []
  }
  let id = 1
  return list.map((item) => ({
    path: item,
    id: id++,
  }))
}
// 回显图片文件列表处理
export function handlePhotoBack(list: string[]) {
  const newList = []
  for (const item of list) {
    if (item) {
      newList.push({
        status: 'success',
        url: item,
      })
    }
  }
  return newList
}
