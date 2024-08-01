export function extractImageUrlsFromHtml(htmlContent: string) {
  // 正则表达式匹配<img>标签内的src属性值
  const imgSrcRegex = /<img[^>]*?src\s*=\s*["']([^"']+)["'][^>]*?>/g
  const matches = []
  let match

  // 循环查找所有匹配项
  while ((match = imgSrcRegex.exec(htmlContent)) !== null) {
    // match[1]包含了图片的URL
    matches.push(match[1])
  }

  return matches
}
