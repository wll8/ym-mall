// 通过id查询数组里面的项
function queryInfosById(id, list) {
  return list.find((item) => {
    return String(item.id) === String(id)
  })
}

// 得到数据
async function getData() {
  const db = await globalThis.config._db
  const data = db.getState()
  return data
}

/*
 * 通过key获取数据
 * @param {*} id
 * @param {*} list
 */
async function getDataByKey(key) {
  const data = await getData()
  return data[key]
}

// 注入util创建方法为类
function injectUtilForClass(Cls) {
  return function create(util) {
    return new Cls(util)
  }
}

// 返回的responseModal
function responseModal(config) {
  const code = config.code || 200
  const success = code === 200
  return {
    ...config,
    code,
    success,
  }
}

module.exports = {
  queryInfosById,
  getData,
  getDataByKey,
  injectUtilForClass,
  responseModal,
}
