const { queryInfosById } = require('./utils')

class DbService {
  getDb() {
    return globalThis.config._db
  }

  async getData() {
    const db = await this.getDb()
    return db.getState()
  }

  async getDataByKey(key) {
    const data = await this.getData()
    return data[key]
  }

  async setData(key, value) {
    const db = await this.getDb()
    const data = db.getState()
    data[key] = value
    db.write()
  }

  async save() {
    const db = await this.getDb()
    db.write()
  }

  // 过去数据
  /**
   *
   * @param { Object } queryInfo
   * @param { Object } queryInfo.filterByKeyValue -- 通过Key, Value过滤数据{[key1]: [value1], [key2]: [value2]}
   * @param { Array }  query.like --  通过Key, Value模糊过滤数据{[key1]: [value2], [key2]: [value2]}
   * @param { Array } data
   * @return Array
   */
  filterData(queryInfo, data) {
    const { filterByKeyValue, like } = queryInfo
    if (filterByKeyValue) {
      data = data.filter((item) => {
        const keyValues = Object.entries(queryInfo.filterByKeyValue)
        for (const [key, value] of keyValues) {
          // 过滤数据
          if (String(item[key]) !== String(value)) {
            return false
          }
        }
        return true
      })
    }
    if (like) {
      data = data.filter((item) => {
        const keyValues = Object.entries(queryInfo.like)
        for (const [key, value] of keyValues) {
          // 过滤数据
          if (!item[key].includes(value)) {
            return false
          }
        }
        return true
      })
    }
    return data
  }

  // 获取信息
  async getUserInfo(id) {
    const users = await this.getDataByKey('user')
    const userInfo = queryInfosById(id, users)
    return userInfo
  }
}

module.exports = new DbService()
