/**
 * 包裹 api 的返回值
 * @param {*} param0
 * @param {object} param0.data - 原始数据
 * @param {number|string} [param0.code=200] - http状态码
 * @returns
 */
function wrapApiData({ data, code = 200 }) {
  code = String(code)
  return {
    code,
    success: Boolean(code.match(/^[2]/)), // 如果状态码以2开头则为 true
    data,
  }
}

function likeFilter({
  data, // 要过滤的数组
  like = ``, // like 的 key, 使用逗号分割
  value = ``, // 字符串
  itemFn = (item) => true, // 数据项条件
  valFn = (likeList, k, v, value) => likeList.includes(k) && v.includes(value), // 值项条件
} = {}) {
  const likeList = like.split(`,`)
  const list = data.filter(
    (item) =>
      itemFn(item) &&
      (like ? Object.entries(item).some(([k, v]) => valFn(likeList, k, v, value)) : true),
  )
  return list
}

// 分页器
function paginate(array, page, limit) {
  // 计算分页的起始条目索引
  const start = (page - 1) * limit
  // 计算分页的结束条目索引
  const end = start + limit
  // 返回分页切片的数组部分
  return array.slice(start, end)
}
// 字符串转数字
function isNumber(val) {
  return !isNaN(Number(val))
}

// 将字符串转换为数字
function stringToNumber(val) {
  if (!val) return val
  if (typeof val === 'string') {
    if (isNumber(val)) return Number(val)
    return val
  }
  return val
}

module.exports = {
  paginate,
  wrapApiData,
  likeFilter,
  isNumber,
  stringToNumber,
}
